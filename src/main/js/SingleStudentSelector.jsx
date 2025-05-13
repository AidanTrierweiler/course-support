import { useState, useEffect } from "react";
import { Container, Row, Button } from "react-bootstrap";
import axios from "axios";

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
    const [studentsData, setStudentsData] = useState(
        props.studentsPresent.map((student, index) => ({
            id: index + 1, // Assign a temporary ID if not provided
            name: student,
            timesCalledOn: 0,
            timesAnswered: 0,
        }))
    );
    const [studentQueue, setStudentQueue] = useState([]);

    useEffect(() => {
        if (props.selectionMethod === "queue") {
            setStudentQueue(shuffleArray(props.studentsPresent));
        }
    }, [props.studentsPresent, props.selectionMethod]);

    const onChooseClick = () => {
        if (studentQueue.length === 0) {
            console.log("Queue is empty, reshuffling...");
            const reshuffledQueue = shuffleArray(props.studentsPresent);
            setStudentQueue(reshuffledQueue);
            setStudentChosen(reshuffledQueue[0] + ", your turn!");
            setStudentQueue(reshuffledQueue.slice(1));
        } else {
            const chosenStudent = studentQueue[0];
            setStudentChosen(chosenStudent + ", your turn!");
            setStudentQueue(studentQueue.slice(1));
        }

        setAnswered(null);
    };

    const onRecordAnswer = async (didAnswer) => {
        setAnswered(didAnswer);

        const studentName = studentChosen.split(",")[0];
        const student = studentsData.find((s) => s.name === studentName);

        if (!student || !student.id) {
            console.error("No valid student found for:", studentName);
            return;
        }

        try {
            const endpoint = didAnswer
                ? `http://localhost:8080/api/student-responses/increment-answered/${student.id}`
                : `http://localhost:8080/api/student-responses/increment-passed/${student.id}`;

            await axios.post(endpoint);

            console.log(`${student.name} ${didAnswer ? "answered" : "passed"}`);
        } catch (error) {
            console.error("Error updating student response:", error.response || error.message);
        }

        setStudentsData(
            studentsData.map((s) =>
                s.name === studentName
                    ? {
                          ...s,
                          timesAnswered: s.timesAnswered + (didAnswer ? 1 : 0),
                      }
                    : s
            )
        );

        setTimeout(() => {
            setStudentChosen("-");
            setAnswered(null);
        }, 1000);
    };

    return (
        <Container className="border rounded m-2">
            <Row>
                <h6 className="px-2"> Choose Random student: </h6>
            </Row>
            <Row>
                <Button className="m-2" onClick={onChooseClick}>
                    Choose Next
                </Button>
            </Row>
            <Row>
                <h4 className="p-2">{studentChosen}</h4>
            </Row>
            {studentChosen !== "-" && (
                <Row>
                    <Button className="m-2 btn-success" onClick={() => onRecordAnswer(true)}>
                        Answer
                    </Button>
                    <Button className="m-2 btn-light-blue" onClick={() => onRecordAnswer(false)}>
                        Pass
                    </Button>
                </Row>
            )}
            {answered !== null && (
                <Row>
                    <h5 className="p-2">{answered ? "Answered" : "Passed"}</h5>
                </Row>
            )}
        </Container>
    );
};

export default SingleStudentSelector;
