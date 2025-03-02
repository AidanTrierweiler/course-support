import { useState, useEffect } from "react";
import { Container, Row, Button } from "react-bootstrap";

export const selectRandomOneFromList = (list) => {
    return list[Math.floor(Math.random() * list.length)];
};

export const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

export const SingleStudentSelector = (props) => {
    const [studentChosen, setStudentChosen] = useState("-");
    const [answered, setAnswered] = useState(null);
    const [studentsData, setStudentsData] = useState(props.studentsPresent.map(student => ({
        name: student,
        timesCalledOn: 0,
        timesAnswered: 0
    })));
    const [studentQueue, setStudentQueue] = useState([]);

    useEffect(() => {
        if (props.selectionMethod === "queue") {
            setStudentQueue(shuffleArray(props.studentsPresent));
        }
    }, [props.studentsPresent, props.selectionMethod]);

    const onChooseClick = (e) => {
        let chosenStudent;
        if (props.selectionMethod === "queue") {
            if (studentQueue.length === 0) {
                setStudentQueue(shuffleArray(props.studentsPresent));
            }
            chosenStudent = studentQueue[0];
            setStudentQueue(studentQueue.slice(1));
        } else {
            chosenStudent = selectRandomOneFromList(props.studentsPresent);
        }
        setStudentChosen(chosenStudent + ", your turn!");
        setAnswered(null); // resets the answered state after click

        setStudentsData(studentsData.map(student => 
            student.name === chosenStudent ? { ...student, timesCalledOn: student.timesCalledOn + 1 } : student
        ));
    };

    const onRecordAnswer = (didAnswer) => {
        setAnswered(didAnswer);
        const studentName = studentChosen.split(",")[0];

        setStudentsData(studentsData.map(student => 
            student.name === studentName ? { ...student, timesAnswered: student.timesAnswered + (didAnswer ? 1 : 0) } : student
        ));

        // TODO: add logic to record the answer to the server
        console.log(`${studentName} answered ${didAnswer ? "Yes" : "No"}`);
    };

    return (
        <Container className="border rounded m-2">
            <Row>
                <h6 className="px-2"> Choose Random student: </h6>
            </Row>
            <Row>
                <Button className="m-2" onClick={onChooseClick}>Choose Next</Button>
            </Row>
            <Row>
                <h4 className="p-2">{studentChosen}</h4>
            </Row>
            {studentChosen !== "-" && (
                <Row>
                    <Button className="m-2 btn-success" onClick={() => onRecordAnswer(true)}>Answered</Button>
                    <Button className="m-2 btn-danger" onClick={() => onRecordAnswer(false)}>Did Not Answer</Button>
                </Row>
            )}
            {answered !== null && (
                <Row>
                    <h5 className="p-2">{answered ? "Student answered" : "Student did not answer"}</h5>
                </Row>
            )}
        </Container>
    );
};

export default SingleStudentSelector;