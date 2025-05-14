import { useEffect, useState } from "react";
import { Container, Row, Table, Form, Col } from "react-bootstrap";
import AttendanceDataService from "./AttendanceDataService";

const chooseBootstrapClassByStatus = (status) => {
    if (status === "present") return "bg-success";
    if (status === "absent") return "bg-danger";
    return "bg-light";
};

export const AttendanceReportDisplay = ({ courseId, studentInfo }) => {
    const [attendanceMarks, setAttendanceMarks] = useState([]);
    const [dayNumber, setDayNumber] = useState(1);
    const [availableDays, setAvailableDays] = useState([1]);

    // Fetch attendance marks for the selected course and day
    useEffect(() => {
        if (!courseId || !dayNumber) return;
        AttendanceDataService.getAllAttendanceMarks(courseId, dayNumber)
            .then((response) => {
                setAttendanceMarks(response.data || []);
            })
            .catch(() => setAttendanceMarks([]));
    }, [courseId, dayNumber]);

    // Optionally, fetch available days for the course (or just use a fixed range)
    useEffect(() => {
        setAvailableDays(Array.from({ length: 58 }, (_, i) => i + 1));
    }, [courseId]);

    // Group attendance marks by student
    const studentMap = {};
    attendanceMarks.forEach((mark) => {
        if (!studentMap[mark.studentId]) {
            studentMap[mark.studentId] = mark.status;
        }
    });

    return (
        <Container className="border rounded m-2">
            <Row className="m-2">
                <strong>Currently viewing day: {dayNumber}</strong>
            </Row>
            <Row>
                <Form.Group as={Row} className="m-2" controlId="dayNumberSelect">
                    <Form.Label column sm="2">Day Number:</Form.Label>
                    <Col sm="2">
                        <Form.Control
                            as="select"
                            value={dayNumber}
                            onChange={(e) => setDayNumber(Number(e.target.value))}
                        >
                            {availableDays.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </Form.Control>
                    </Col>
                </Form.Group>
            </Row>
            <Row>
                <Table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(studentMap).map(([studentId, status]) => (
                            <tr key={studentId}>
                                <td>{studentInfo?.[studentId] || studentId}</td>
                                <td className={chooseBootstrapClassByStatus(status)}>{status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
};

export default AttendanceReportDisplay;