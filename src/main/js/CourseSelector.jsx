import { useEffect, useState } from "react";
import AttendanceDataService from "./AttendanceDataService";

export const CourseSelector = (props) => {
    const [allCourseIds, setAllCourseIds] = useState(props.allCourseIds);

    const onCourseIdSelected = (e) => {
        props.onCourseIdSelected(e.target.value);
    };

    useEffect(() => {
        AttendanceDataService.getCourseIds().then((response) => setAllCourseIds(response.data));
    }, []);

    return (
        <select value={props.courseId} onChange={onCourseIdSelected}>
            {allCourseIds.map((aCourseId) => (
                <option key={aCourseId} value={aCourseId}>
                    {aCourseId}
                </option>
            ))}
        </select>
    );
};

export default CourseSelector;