import { validateJson } from "../../../utils/validatejson.js";
import AttendanceMarkSchema from "../schemas/attendanceMark.schema.json";
import SavedGroupsSchema from "../schemas/savedGroups.schema.json";
import StudentSchema from "../schemas/student.schema.json";
import attendanceMarksExample from "../examples/AttendanceMarksExample";
import { exampleCourseAttendance } from "../examples/AttendanceCourseReportExample";
import { exampleOf18Students } from "../examples/JsonExamples";

// Test for AttendanceMarksExample
test("Validate attendanceMarksExample", () => {
    attendanceMarksExample.forEach((attendanceMark, index) => {
        const isValid = validateJson(attendanceMark, AttendanceMarkSchema);

        if (!isValid) {
            console.error(`Validation errors for record at index ${index}:`, validateJson.errors);
        }

        expect(isValid).toBe(true); // Test will fail if any record is invalid
    });
});

// Test for AttendanceCourseReportExample
test("Validate exampleCourseAttendance", () => {
    const schema = {
        type: "object",
        properties: {
            courseId: { type: "string" },
            studentReports: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        marks: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    dayNumber: { type: "integer" },
                                    status: { type: "string", enum: ["present", "absent"] }
                                },
                                required: ["dayNumber", "status"]
                            }
                        }
                    },
                    required: ["name", "marks"]
                }
            }
        },
        required: ["courseId", "studentReports"]
    };

    const isValid = validateJson(exampleCourseAttendance, schema);

    if (!isValid) {
        console.error("Validation errors for exampleCourseAttendance:", validateJson.errors);
    }

    expect(isValid).toBe(true); // Test will fail if the data is invalid
});

// Test for JsonExamples (exampleOf18Students)
test("Validate exampleOf18Students", () => {
    exampleOf18Students.forEach((student, index) => {
        const isValid = validateJson({ preferredName: student, netpass: `netpass${index}` }, StudentSchema);

        if (!isValid) {
            console.error(`Validation errors for student at index ${index}:`, validateJson.errors);
        }

        expect(isValid).toBe(true); // Test will fail if any record is invalid
    });
});

// Test for SavedGroups
test("Validate savedGroupsExample", () => {
    const savedGroupsExample = [
        {
            name: "Group 1",
            groups: [["Alice", "Bob"], ["Charlie", "David"]]
        },
        {
            name: "Group 2",
            groups: [["Eve", "Frank"], ["Grace", "Heidi"]]
        }
    ];

    const isValid = validateJson(savedGroupsExample, SavedGroupsSchema);

    if (!isValid) {
        console.error("Validation errors for savedGroupsExample:", validateJson.errors);
    }

    expect(isValid).toBe(true); // Test will fail if the data is invalid
});