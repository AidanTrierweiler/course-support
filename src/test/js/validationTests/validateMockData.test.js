import { validateJson } from "../../../utils/validatejson.js";
import AttendanceMarkSchema from "../schemas/attendanceMark.schema.json";
import attendanceMarksExample from "../examples/AttendanceMarksExample";

test("Validate attendanceMarksExample", () => {
    const isValid = validateJson(attendanceMarksExample, AttendanceMarkSchema);
    expect(isValid).toBe(true); // Test will fail if the data is invalid
});