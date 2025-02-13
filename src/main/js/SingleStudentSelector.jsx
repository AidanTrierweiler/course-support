import { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";


export const selectRandomOneFromList = (list) => {
    return list[Math.floor(Math.random() * list.length)];
};

export const SingleStudentSelector = (props) => {
    const [studentChosen, setStudentChosen] = useState("-");
    const [answered, setAnswered] = useState(null);
    
    const onChooseClick = (e) => {
        setStudentChosen(selectRandomOneFromList(props.studentsPresent)+", your turn!");
        setAnswered(null); //resets the answered state after click
    };

    const onRecordAnswer = (didAnswer) => {
        setAnswered(didAnswer);
        // TODO: add logic to record the answer to the server
        console.log(`${studentChosen.split(",")[0]} answered ${didAnswer ? "Yes" : "No"}`);
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
