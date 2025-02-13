// To run tests: npm test

import {selectRandomOneFromList} from "../../main/js/SingleStudentSelector"

import {exampleOf18Students} from "./examples/JsonExamples"


describe('SingleStudentSelector', () => {
    test('selectRandomOneFromList', () => {
        //make a set of 10 selected students out of 18
        const selectedSet = new Set();
        for (let i=0; i<10; i++){
            selectedSet.add(selectRandomOneFromList(exampleOf18Students));
        }

        //make sure all included values were in the original list
        for (let item of selectedSet){
            expect(exampleOf18Students.includes(item)).toBeTruthy();
        }
        //make sure there are atleast 4 unique values (highly unlikely to be less, although theoretically possible)
        expect(selectedSet.size).toBeGreaterThan(3);
    });
});

