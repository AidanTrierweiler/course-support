import { buildGroups } from "../../main/js/GroupBuilder";
import { exampleOf18Students } from "./examples/JsonExamples";

describe('GroupBuilder', () => {
    test('buildGroupEven', () => {
        const groups = buildGroups(exampleOf18Students, 3);
        
        expect(groups.length).toStrictEqual(6);
        
        let studentsNotAssigned = Array.from(exampleOf18Students);
        for(let group of groups){
            expect(group.length).toStrictEqual(3);
            for(let student of group){
                expect(studentsNotAssigned.includes(student)).toBeTruthy();
                studentsNotAssigned = studentsNotAssigned.filter(item => item !== student)
            }
        }
        expect(studentsNotAssigned).toStrictEqual([]);
    });

    test('buildGroupUneven', () => {
        const groups = buildGroups(exampleOf18Students.slice(0, -1), 3);
        
        expect(groups.length).toStrictEqual(6);
        
        let studentsNotAssigned = Array.from(exampleOf18Students.slice(0, -1));
        //last group has one less
        expect(groups[groups.length-1].length).toStrictEqual(2);
        for(let student of groups[groups.length-1]){
            expect(studentsNotAssigned.includes(student)).toBeTruthy();
            studentsNotAssigned = studentsNotAssigned.filter(item => item !== student);
        }
        for(let group of groups.slice(0,groups.length-1)){
            expect(group.length).toStrictEqual(3);
            for(let student of group){
                expect(studentsNotAssigned.includes(student)).toBeTruthy();
                studentsNotAssigned = studentsNotAssigned.filter(item => item !== student);
            }
        }
        expect(studentsNotAssigned).toStrictEqual([]);

        //less thorough check, just make sure the others have the right number in the last groups
        const otherGroups = buildGroups(exampleOf18Students.slice(0, -2), 3);
        expect(otherGroups[otherGroups.length-3].length).toStrictEqual(3);
        expect(otherGroups[otherGroups.length-2].length).toStrictEqual(2);
        expect(otherGroups[otherGroups.length-1].length).toStrictEqual(2);
    });
    
});