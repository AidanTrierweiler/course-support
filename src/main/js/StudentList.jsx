import { useEffect, useState } from "react";
import { Container, Row, Table } from "react-bootstrap";
import AttendanceDataService from "./AttendanceDataService";

const StudentList = (props) => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        AttendanceDataService.getAllAttendanceMarks().then((response) => {
            setStudents(response.data);
        });
    }, []);

    return (
        <Container className="border rounded m-2">
            <Row>
                <h6 className="px-2">Student List</h6>
            </Row>
            <Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Times Called On</th>
                            <th>Times Answered</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student.studentId}</td>
                                <td>{student.timesCalledOn}</td>
                                <td>{student.timesAnswered}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
};

export default StudentList;