import { useState } from "react";
import axios from "axios";
import { Button, Container, Form } from "react-bootstrap";

export const AttendanceChecker = (props) => {
    const produceDayNumbers = (lastDayNumber) => {
        let dayNumbers = [];
        for (var dayNum = 1; dayNum <= lastDayNumber; dayNum++) {
            dayNumbers.push(dayNum);
        }
        return dayNumbers;
    };

    const [dayNumber, setDayNumber] = useState(6);
    const dayNumbers = produceDayNumbers(58);

    // Local attendance state
    const [attendance, setAttendance] = useState(new Map(props.roster));

    const onCheckboxChange = (e) => {
        const student = e.target.name;
        const checked = e.target.checked;
        setAttendance((prev) => new Map(prev).set(student, checked ? "present" : "absent"));
    };

    const onDayNumberSelected = (e) => {
        setDayNumber(Number(e.target.value));
    };

    const handleSubmit = async () => {
        const attendanceMarks = Array.from(attendance.entries()).map(([studentId, status]) => ({
            studentId,
            courseId: props.courseId,
            dayNumber,
            status,
        }));

        try {
            await axios.post("http://localhost:8080/api/attendanceMarks", attendanceMarks);
            alert("Attendance submitted!");
        } catch (error) {
            alert("Error submitting attendance.");
            console.error(error);
        }
    };

    const produceCheckbox = ([studentName]) => {
        const checked = attendance.get(studentName) === "present";
        return (
            <Form.Check
                inline
                checked={checked}
                onChange={onCheckboxChange}
                type="checkbox"
                label={studentName}
                key={studentName}
                name={studentName}
                id={studentName + "checkbox"}
            />
        );
    };

    return (
        <Container className="border rounded m-2">
            <h6> Attendance </h6>
            {Array.from(props.roster, produceCheckbox)}
            for day
            <select value={dayNumber} onChange={onDayNumberSelected}>
                {dayNumbers.map((dayNum) => (
                    <option key={dayNum} value={dayNum}>{dayNum}</option>
                ))}
            </select>
            <Button onClick={handleSubmit}>Submit Attendance</Button>
        </Container>
    );
};

export default AttendanceChecker;