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
    const [error, setError] = useState(null);

    // Fetch all course IDs from the database
    useEffect(() => {
        let isMounted = true; // Track if the component is mounted

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
                    <Route path="student-list" element={<StudentList />} />
                    <Route path="saved-groups" element={<SavedGroups />} />
                    <Route
                        path="random-picker"
                        element={
                            <SingleStudentSelector
                                studentsPresent={["Alice", "Bob", "Charlie"]}
                                selectionMethod="random"
                            />
                        }
                    />
                    <Route
                        path="group-maker"
                        element={
                            <GroupBuilder
                                studentsPresent={["Alice", "Bob", "Charlie", "David"]}
                                defaultGroupSize={2}
                            />
                        }
                    />
                    <Route
                        path="attendance-checker"
                        element={
                            <AttendanceChecker
                                roster={
                                    new Map([
                                        ["Alice", "present"],
                                        ["Bob", "absent"],
                                    ])
                                }
                            />
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default CourseSupport;