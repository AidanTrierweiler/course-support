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

const CourseSupport = (props) => {

    const [courseId, setCourseId] = useState(props.courseId);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CourseSupportHeader courseId={courseId} allCourseIds={[]} onCourseIdSelected={setCourseId} /> }>
                    <Route index element={<ClassroomDashboard courseId={courseId} studentNames={props.studentNames} /> }/>
                    <Route path="attendancereport" element={<AttendanceReportDisplay courseId={courseId} attendanceCourseReport={exampleCourseAttendance} />} />
                    <Route path="group-builder-demo" element={<GroupBuilderDemo />} />
                    <Route path="attendance-checker-demo" element={<AttendanceCheckerDemo />} />
                    <Route path="classroom-dashboard-demo" element={<ClassroomDashboardDemo />} />
                    <Route path="single-student-selector-demo" element={<SingleStudentSelectorDemo />} />
                    <Route path="course-support-demo" element={<CourseSupportDemo />} />
                    <Route path="attendance-report-demo" element={<AttendanceReportDisplayDemo />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default CourseSupport;