import { render, fireEvent, screen } from "@testing-library/react";
import SingleStudentSelector, { selectRandomOneFromList } from "../../main/js/SingleStudentSelector";
import { exampleOf18Students } from "./examples/JsonExamples";

describe("SingleStudentSelector", () => {
    test("selectRandomOneFromList", () => {
        const selectedSet = new Set();
        for (let i = 0; i < 10; i++) {
            selectedSet.add(selectRandomOneFromList(exampleOf18Students));
        }
        for (let item of selectedSet) {
            expect(exampleOf18Students.includes(item)).toBeTruthy();
        }
        expect(selectedSet.size).toBeGreaterThan(3);
    });

    test("selects students in queue order", () => {
        render(<SingleStudentSelector studentsPresent={exampleOf18Students} selectionMethod="queue" />);
        
        const chooseButton = screen.getByText("Choose Next");

        fireEvent.click(chooseButton);
        const firstStudent = screen.getByText(/, your turn!/).textContent.split(",")[0];

        fireEvent.click(chooseButton);
        const secondStudent = screen.getByText(/, your turn!/).textContent.split(",")[0];

        expect(firstStudent).not.toBe(secondStudent);
        expect(exampleOf18Students.includes(firstStudent)).toBeTruthy();
        expect(exampleOf18Students.includes(secondStudent)).toBeTruthy();
    });

    test("queue reshuffles when empty", () => {
        render(<SingleStudentSelector studentsPresent={["Alice", "Bob"]} selectionMethod="queue" />);
        
        const chooseButton = screen.getByText("Choose Next");

        fireEvent.click(chooseButton);
        const firstRound = screen.getByText(/, your turn!/).textContent.split(",")[0];

        fireEvent.click(chooseButton);
        const secondRound = screen.getByText(/, your turn!/).textContent.split(",")[0];

        fireEvent.click(chooseButton);
        const thirdRound = screen.getByText(/, your turn!/).textContent.split(",")[0];

        expect(new Set([firstRound, secondRound, thirdRound]).size).toBeGreaterThan(1);
    });
});
