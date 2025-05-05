import { useEffect, useState } from "react";
import { Dropdown, DropdownButton, ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import axios from "axios";

export const SavedGroups = () => {
    const [savedGroups, setSavedGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        const fetchSavedGroups = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/groups");
                const sortedGroups = response.data.sort((a, b) => {
                    const isADate = !isNaN(Date.parse(a.name));
                    const isBDate = !isNaN(Date.parse(b.name));

                    if (!isADate && isBDate) return -1; // Non-date names come first
                    if (isADate && !isBDate) return 1; // Date names come after non-date names
                    if (isADate && isBDate) {
                        // Sort date names by most recent first
                        return new Date(b.name) - new Date(a.name);
                    }
                    return a.name.localeCompare(b.name); // Alphabetical for non-date names
                });
                setSavedGroups(sortedGroups);
            } catch (error) {
                console.error("Error fetching saved groups:", error);
            }
        };

        fetchSavedGroups();
    }, []);

    const handleSelectGroup = (groupName) => {
        const group = savedGroups.find((g) => g.name === groupName);
        setSelectedGroup(group || null); // Ensure selectedGroup is null if no match is found
    };

    return (
        <Row>
            <Col sm={4}>
                <DropdownButton
                    id="saved-groups-dropdown"
                    title={selectedGroup ? selectedGroup.name : "Select a Group"}
                    onSelect={handleSelectGroup}
                >
                    {savedGroups.map((group, index) => (
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
                        <ListGroup className="m-2">
                            {selectedGroup.subgroups.map((subgroup, index) => (
                                <ListGroupItem key={index}>{subgroup.join(", ")}</ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                )}
            </Col>
        </Row>
    );
};

export default SavedGroups;