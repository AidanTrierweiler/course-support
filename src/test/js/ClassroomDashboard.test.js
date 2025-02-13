// To run tests: npm test

import {presentListFromRosterMap} from "../../main/js/ClassroomDashboard"
import {testRoster} from "./examples/InternalObjectExamples"

describe('ClassroomDashboard', () => {
    test('presentListFromRosterMap', () => {
        expect(presentListFromRosterMap(testRoster)).toStrictEqual(["a", "c", "f", "g"]);
        expect(presentListFromRosterMap(new Map())).toStrictEqual([]);
    });
});