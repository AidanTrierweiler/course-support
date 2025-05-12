import { useState, useEffect } from "react";
import AttendanceDataService from "./AttendanceDataService";

const ClassroomDashboard = ({ courseId }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (courseId) {
            setLoading(true);
            AttendanceDataService.getStudents(courseId)
                .then((response) => {
                    if (response.data && response.data.length > 0) {
                        setStudents(response.data);
                    } else {
                        setStudents([]); // Handle empty response
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching students:", error);
                    setError("Failed to load students.");
                    setLoading(false);
                });
        }
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
        <div>
            {students.map((student) => (
                <div key={student.id}>{student.name}</div>
            ))}
        </div>
    );
};

export default ClassroomDashboard;