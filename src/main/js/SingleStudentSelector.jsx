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

export const SingleStudentSelector = ({ courseId }) => {
    const [studentChosen, setStudentChosen] = useState(null); // Store the full student object
    const [answered, setAnswered] = useState(null);
    const [studentsData, setStudentsData] = useState([]);
    const [studentQueue, setStudentQueue] = useState([]);

    // Fetch full student objects when the course changes
    useEffect(() => {
        if (!courseId) {
            console.error("No courseId provided to SingleStudentSelector.");
            return;
        }

        console.log("Fetching students for course:", courseId); // Debugging log

        const fetchStudents = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/students/courses/${courseId}/students`
                );
                console.log("Backend response:", response.data); // Debugging log

                const updatedStudentsData = response.data.map((student) => ({
                    id: student.id,
                    name: student.preferredName || student.netpass,
                    netpass: student.netpass,
                    timesCalledOn: 0,
                    timesAnswered: 0,
                }));

                console.log("updatedStudentsData:", updatedStudentsData); // Debugging log

                setStudentsData(updatedStudentsData);
                const shuffledQueue = shuffleArray(updatedStudentsData);
                console.log("shuffledQueue:", shuffledQueue); // Debugging log
                setStudentQueue(shuffledQueue);
                setStudentChosen(null);
                setAnswered(null);
            } catch (error) {
                console.error("Error fetching students:", error.response || error.message);
            }
        };

        fetchStudents();
    }, [courseId]);

    const onChooseClick = () => {
        console.log("studentQueue before choosing:", studentQueue); // Debugging log

        if (studentQueue.length === 0) {
            console.log("Queue is empty, reshuffling...");
            const reshuffledQueue = shuffleArray(studentsData);
            console.log("reshuffledQueue:", reshuffledQueue); // Debugging log
            if (reshuffledQueue.length > 0) {
                setStudentQueue(reshuffledQueue);
                setStudentChosen(reshuffledQueue[0]); // Choose the first student object
                setStudentQueue(reshuffledQueue.slice(1));
            } else {
                console.error("No students available to choose from.");
                setStudentChosen(null);
            }
        } else {
            const chosenStudent = studentQueue[0];
            console.log("chosenStudent:", chosenStudent); // Debugging log
            setStudentChosen(chosenStudent); // Set the full student object
            setStudentQueue(studentQueue.slice(1));
        }

        setAnswered(null);
    };

    const onRecordAnswer = async (didAnswer) => {
        setAnswered(didAnswer);

        if (!studentChosen || !studentChosen.id) {
            console.error("No valid student selected");
            return;
        }

        try {
            const endpoint = didAnswer
                ? `http://localhost:8080/api/student-responses/increment-answered/${studentChosen.id}`
                : `http://localhost:8080/api/student-responses/increment-passed/${studentChosen.id}`;

            await axios.post(endpoint);

            console.log(`${studentChosen.name} ${didAnswer ? "answered" : "passed"}`);
        } catch (error) {
            console.error("Error updating student response:", error.response || error.message);
        }

        setStudentsData(
            studentsData.map((s) =>
                s.id === studentChosen.id
                    ? {
                          ...s,
                          timesAnswered: s.timesAnswered + (didAnswer ? 1 : 0),
                      }
                    : s
            )
        );

        setTimeout(() => {
            setStudentChosen(null);
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
                <h4 className="p-2">
                    {studentChosen ? `${studentChosen.name}, your turn!` : "-"}
                </h4>
            </Row>
            {studentChosen && (
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
