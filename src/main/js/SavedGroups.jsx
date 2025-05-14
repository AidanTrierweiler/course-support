import { useEffect, useState } from "react";
import { Dropdown, DropdownButton, ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import axios from "axios";

export const SavedGroups = () => {
    const [savedGroups, setSavedGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Fetch all saved groups on component mount
    useEffect(() => {
        const fetchSavedGroups = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/groups");
                setSavedGroups(response.data);
            } catch (error) {
                console.error("Error fetching saved groups:", error);
            }
        };

        fetchSavedGroups();
    }, []);

    // Handle group selection and sanitize subgroups if necessary
    const handleSelectGroup = async (groupName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/groups/by-name/${groupName}`);
            const groupData = response.data;

            // Check if subgroups is a string
            if (typeof groupData.subgroups === "string") {
                try {
                    // Attempt to parse the string as JSON
                    groupData.subgroups = JSON.parse(groupData.subgroups);
                } catch (error) {
                    // If parsing fails, keep it as a plain string
                    console.warn("Subgroups is not valid JSON, treating it as a plain string:", groupData.subgroups);
                }
            }

            setSelectedGroup(groupData);
        } catch (error) {
            console.error("Error fetching selected group:", error);
            setSelectedGroup(null); // Clear the selected group if there's an error
        }
    };

    // Helper to check if a string is a date in YYYY-MM-DD format
    const isDateString = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str);

    // Sort savedGroups: custom names first, then dates (most recent first)
    const sortedGroups = [...savedGroups].sort((a, b) => {
        const aIsDate = isDateString(a.name);
        const bIsDate = isDateString(b.name);

        if (aIsDate && !bIsDate) return 1; // b (custom) before a (date)
        if (!aIsDate && bIsDate) return -1; // a (custom) before b (date)
        if (aIsDate && bIsDate) {
            // Both are dates, sort descending
            return b.name.localeCompare(a.name);
        }
        // Both are custom names, keep original order or sort alphabetically if you prefer
        return 0;
    });

    return (
        <Row>
            <Col sm={4}>
                <DropdownButton
                    id="saved-groups-dropdown"
                    title={selectedGroup ? selectedGroup.name : "Select a Group"}
                    onSelect={handleSelectGroup}
                >
                    {sortedGroups.map((group, index) => (
                        <Dropdown.Item key={index} eventKey={group.name}>
                            {group.name}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </Col>
            <Col sm={8}>
                {selectedGroup && selectedGroup.subgroups && (
                    <div>
                        <h6 className="mt-3">Subgroups for {selectedGroup.name}</h6>
                        {Array.isArray(selectedGroup.subgroups) ? (
                            <ListGroup className="m-2">
                                {selectedGroup.subgroups.map((subgroup, index) => (
                                    <ListGroupItem key={index}>{subgroup.join(", ")}</ListGroupItem>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>{selectedGroup.subgroups}</p> // Display the string directly
                        )}
                    </div>
                )}
            </Col>
        </Row>
    );
};

export default SavedGroups;