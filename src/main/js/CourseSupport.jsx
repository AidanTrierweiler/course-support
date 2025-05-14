import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AttendanceReportDisplay from "./AttendanceReportDisplay";
import ClassroomDashboard from "./ClassroomDashboard";
import CourseSupportHeader from "./CourseSupportHeader";
import StudentList from "./StudentList";
import SavedGroups from "./SavedGroups";
import SingleStudentSelector from "./SingleStudentSelector";
import GroupBuilder from "./GroupBuilder";
import AttendanceChecker from "./AttendanceChecker";
import AttendanceDataService from "./AttendanceDataService";

const CourseSupport = (props) => {
    const [courseId, setCourseId] = useState(null);
    const [allCourseIds, setAllCourseIds] = useState([]);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    // Fetch all course IDs from the database
    useEffect(() => {
        let isMounted = true;

        AttendanceDataService.getCourseIds()
            .then((response) => {
                if (isMounted) {
                    setAllCourseIds(response.data);
                    if (response.data.length > 0) {
                        setCourseId(response.data[0]); // Set the first course as the default
                    }
                }
            })
            .catch((error) => {
                if (isMounted) {
                    console.error("Error fetching course IDs:", error);
                    setError("Failed to load courses. Please try again later.");
                }
            });

        return () => {
            isMounted = false; // Cleanup function to prevent state updates
        };
    }, []);

    // Fetch students for the selected course
    useEffect(() => {
        if (courseId) {
            AttendanceDataService.getStudents(courseId)
                .then((response) => {
                    setStudents(response.data.map((student) => student.netpass)); // Use netpass or preferredName
                })
                .catch((error) => {
                    console.error("Error fetching students:", error);
                });
        }
    }, [courseId]);

    if (error) {
        return <div>{error}</div>; // Display error message
    }

    if (!courseId || allCourseIds.length === 0) {
        return <div>Loading...</div>; // Fallback UI while data is loading
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <CourseSupportHeader
                            courseId={courseId}
                            allCourseIds={allCourseIds}
                            onCourseIdSelected={setCourseId}
                        />
                    }
                >
                    <Route
                        index
                        element={<ClassroomDashboard courseId={courseId} />}
                    />
                    <Route
                        path="attendancereport"
                        element={<AttendanceReportDisplay courseId={courseId} />}
                    />
                    <Route
                        path="student-list"
                        element={<StudentList courseId={courseId} />} // Pass the selected courseId dynamically
                    />
                    <Route path="saved-groups" element={<SavedGroups courseId={courseId} />} />
                    <Route
                        path="random-picker"
                        element={
                            <SingleStudentSelector
                                courseId={courseId} // Pass the selected courseId dynamically
                            />
                        }
                    />
                    <Route
                        path="group-maker"
                        element={
                            <GroupBuilder
                                studentsPresent={students} // students for the selected course
                                defaultGroupSize={2}
                                courseId={courseId}        // pass the selected courseId
                            />
                        }
                    />
                    <Route
                        path="attendance-checker"
                        element={
                            <AttendanceChecker
                                roster={new Map(students.map((student) => [student, "present"]))}
                                courseId={courseId} // <-- This must be present and not undefined!
                            />
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default CourseSupport;