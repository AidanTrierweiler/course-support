import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import AttendanceChecker from "./AttendanceChecker";
import AttendanceDataService from "./AttendanceDataService";
import GroupBuilder from "./GroupBuilder";
import SingleStudentSelector from "./SingleStudentSelector";

export const presentListFromRosterMap = (rosterMap) => {
    return Array.from(rosterMap).filter( mapEntry => (mapEntry[1] === "present")).map(mapEntry=>mapEntry[0]);
}

export const ClassroomDashboard = (props) => {
    //Make the data structure that will track students marked absent or present
    let rosterMapStart = new Map();
    props.studentNames.forEach(studentName=>(rosterMapStart.set(studentName, "present")));
    const [roster, setRoster] = useState(rosterMapStart);

    //give this to other components that need to update attendanceMarks in the rosterMap
    const switchStudentStatus = (studentName) => {
        if(roster.get(studentName)==="present"){
            roster.set(studentName, "absent");
        }
        else{
            roster.set(studentName, "present");
        }
        setRoster(new Map(roster));
    }

    //give this to other components that need to record attendance to the server
    const recordAttendance = (dayNumber) => {
        const attendanceMarks =  Array.from (roster, ([studentName, status])=> (
            {
                "studentId": studentName,
                "courseId": props.courseId,
                "dayNumber": dayNumber,
                "status": status

            }));
        console.log(attendanceMarks);
        AttendanceDataService.recordAttendance(attendanceMarks);
    }
    
    return (
        <Container>
            <Row>
                <Col className="col-sm-4">
                    <SingleStudentSelector studentsPresent={presentListFromRosterMap(roster)} selectionMethod="queue" />
                </Col>
                <Col className="col-sm-8">
                    <GroupBuilder studentsPresent={presentListFromRosterMap(roster)} defaultGroupSize={3} />
                </Col>
            </Row>
            <Row>
                <AttendanceChecker roster={roster} switchStudentStatus={switchStudentStatus} recordAttendance={recordAttendance} />
            </Row>
        </Container>
    );
};

export default ClassroomDashboard;