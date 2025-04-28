import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { exampleCourseAttendance } from "../../test/js/examples/AttendanceCourseReportExample";
import AttendanceReportDisplay from "./AttendanceReportDisplay";
import ClassroomDashboard from "./ClassroomDashboard"
import CourseSupportHeader from "./CourseSupportHeader"
import GroupBuilderDemo from '../../test/js/GroupBuilderDemo';
import AttendanceCheckerDemo from '../../test/js/AttendanceCheckerDemo';
import ClassroomDashboardDemo from '../../test/js/ClassroomDashboardDemo';
import SingleStudentSelectorDemo from '../../test/js/SingleStudentSelectorDemo';
import CourseSupportDemo from '../../test/js/CourseSupportDemo';
import AttendanceReportDisplayDemo from '../../test/js/AttendanceReportDisplayDemo';
import StudentList from "./StudentList";
import SavedGroups from "./SavedGroups";
import SavedGroupsDemo from "../../test/js/SavedGroupsDemo";

const CourseSupport = (props) => {
    const [courseId, setCourseId] = useState(props.courseId);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <CourseSupportHeader
                            courseId={courseId}
                            allCourseIds={["COMP220", "COMP171", "COMP172"]} // Example course IDs
                            onCourseIdSelected={setCourseId}
                        />
                    }
                >
                    <Route
                        index
                        element={<ClassroomDashboard courseId={courseId} studentNames={props.studentNames} />}
                    />
                    <Route
                        path="attendancereport"
                        element={<AttendanceReportDisplay courseId={courseId} attendanceCourseReport={exampleCourseAttendance} />}
                    />
                    <Route path="saved-groups" element={<SavedGroups />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default CourseSupport;