import { render, screen } from "@testing-library/react";
import SavedGroups from "../../main/js/SavedGroups";

describe('SavedGroups', () => {
    test('renders SavedGroups and fetches groups', () => {
        console.log = jest.fn(); // Mock console.log

        render(<SavedGroups />);

        // Check for the console log message
        expect(console.log).toHaveBeenCalledWith("Fetched saved groups");
    });

    test('renders SavedGroups with no groups', () => {
        render(<SavedGroups />);

        const noGroupsMessage = screen.getByText("Saved Groups");
        expect(noGroupsMessage).toBeInTheDocument();
    });
});