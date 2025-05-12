import { Row, Jumbotron, Image, Container } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { CourseSelector } from "./CourseSelector";

export const CourseSupportHeader = (props) => {
    return (
        <Container>
            <Jumbotron>
                <Row className="justify-content-center align-items-center">
                    <Image src="./teacherIcon128.png" alt="" />
                    <h1>DragonLab's Course Support </h1>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/attendancereport">Attendance Report</Link>
                            </li>
                            <li>
                                <Link to="/student-list">Student List</Link>
                            </li>
                            <li>
                                <Link to="/saved-groups">Saved Groups</Link>
                            </li>
                            <li>
                                <Link to="/random-picker">Random Picker</Link>
                            </li>
                            <li>
                                <Link to="/group-maker">Group Maker</Link>
                            </li>
                            <li>
                                <Link to="/attendance-checker">Attendance Checker</Link>
                            </li>
                        </ul>
                    </nav>
                </Row>
                <Row>
                    <CourseSelector
                        courseId={props.courseId}
                        allCourseIds={props.allCourseIds}
                        onCourseIdSelected={props.onCourseIdSelected}
                    />
                </Row>
            </Jumbotron>
            <Outlet />
        </Container>
    );
};

export default CourseSupportHeader;