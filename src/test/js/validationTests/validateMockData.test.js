import { validateJson } from "../../../utils/validatejson.js";
import AttendanceMarkSchema from "../schemas/attendanceMark.schema.json";
import attendanceMarksExample from "../examples/AttendanceMarksExample";

test("Validate attendanceMarksExample", () => {
    attendanceMarksExample.forEach((attendanceMark, index) => {
        const isValid = validateJson(attendanceMark, AttendanceMarkSchema);

        if (!isValid) {
            console.error(`Validation errors for record at index ${index}:`, validateJson.errors);
        }

        expect(isValid).toBe(true); // Test will fail if any record is invalid
    });
});