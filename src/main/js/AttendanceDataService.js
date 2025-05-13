import axiosInstance from "../../http-common";

class AttendanceDataService {
    getAllAttendanceMarks() {
        return axiosInstance.get("/attendanceMarks");
    }

    getRecentAttendanceMarks() {
        return axiosInstance.get("/recentAttendanceMarks");
    }

    getCourseIds() {
        return axiosInstance.get("/courses/courseIds");
    }

    getStudents(courseId) {
        return axiosInstance.get(`/courses/${courseId}/students`);
    }

    getResponseCountersByCourseId(courseId) {
        // Fixed method to avoid duplicate /api
        return axiosInstance.get(`/student-responses/course/${courseId}/students`);
    }

    recordAttendance(attendanceMarks) {
        return axiosInstance.post("/attendanceMarks", attendanceMarks);
    }

    createAttendanceReport(courseId) {
        return axiosInstance.get("/attendanceReport", { params: { courseId: courseId } });
    }
}

export default new AttendanceDataService();