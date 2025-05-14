import { useEffect, useState } from "react";
import { Dropdown, DropdownButton, ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import axios from "axios";

export const SavedGroups = ({ courseId }) => {
    const [savedGroups, setSavedGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Fetch all saved groups when courseId changes
    useEffect(() => {
        if (!courseId) {
            setSavedGroups([]);
            setSelectedGroup(null);
            return;
        }
        const fetchSavedGroups = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/groups?courseId=${courseId}`);
                setSavedGroups(response.data);
            } catch (error) {
                console.error("Error fetching saved groups:", error);
            }
        };

        fetchSavedGroups();
    }, [courseId]);

    // Handle group selection and sanitize subgroups if necessary
    const handleSelectGroup = async (groupName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/groups/by-name/${groupName}`);
            const groupData = response.data;

            // Check if subgroups is a string
            if (typeof groupData.subgroups === "string") {
                try {
                    groupData.subgroups = JSON.parse(groupData.subgroups);
                } catch (error) {
                    console.warn("Subgroups is not valid JSON, treating it as a plain string:", groupData.subgroups);
                }
            }

            setSelectedGroup(groupData);
        } catch (error) {
            console.error("Error fetching selected group:", error);
            setSelectedGroup(null);
        }
    };

    // Helper to check if a string is a date in YYYY-MM-DD format
    const isDateString = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str);

    // Sort savedGroups: custom names first, then dates (most recent first)
    const sortedGroups = [...savedGroups].sort((a, b) => {
        const aIsDate = isDateString(a.name);
        const bIsDate = isDateString(b.name);

        if (aIsDate && !bIsDate) return 1;
        if (!aIsDate && bIsDate) return -1;
        if (aIsDate && bIsDate) {
            return b.name.localeCompare(a.name);
        }
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
                            <p>{selectedGroup.subgroups}</p>
                        )}
                    </div>
                )}
            </Col>
        </Row>
    );
};

export default SavedGroups;