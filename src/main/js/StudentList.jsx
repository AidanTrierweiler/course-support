import { useEffect, useState } from "react";
import { Container, Row, Table } from "react-bootstrap";
import AttendanceDataService from "./AttendanceDataService";

const StudentList = ({ courseId }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch students and their response counters for the selected course
    useEffect(() => {
        let isMounted = true; // Prevent state updates if the component is unmounted

        if (!courseId) {
            console.error("No courseId provided to StudentList.");
            setError("No course selected.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        AttendanceDataService.getResponseCountersByCourseId(courseId)
            .then((response) => {
                if (isMounted) {
                    const formattedStudents = response.data.map((student) => ({
                        id: student[0], // Student ID
                        preferredName: student[1], // Preferred Name
                        netpass: student[2], // Netpass
                        answered_count: student[3], // Answered Count
                        passed_count: student[4], // Passed Count
                    }));
                    setStudents(formattedStudents);
                    setLoading(false);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    console.error("Error fetching students:", error);
                    setError("Failed to load students. Please try again later.");
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false; // Cleanup to prevent memory leaks
        };
    }, [courseId]);

    if (loading) {
        return <div>Loading students...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!students || students.length === 0) {
        return <div>No students available for this course.</div>;
    }

    return (
        <Container className="border rounded m-2">
            <Row>
                <h6 className="px-2">Student List for Course: {courseId}</h6>
            </Row>
            <Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Times Answered</th>
                            <th>Times Passed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student.preferredName || student.netpass}</td>
                                <td>{student.answered_count || 0}</td>
                                <td>{student.passed_count || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
};

export default StudentList;