import { useEffect, useState } from "react";
import { Container, Row, ListGroup, ListGroupItem } from "react-bootstrap";
import axios from "axios"; // Uncommented to enable API calls

export const SavedGroups = () => {
    const [savedGroups, setSavedGroups] = useState([]);

    useEffect(() => {
        const fetchSavedGroups = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/groups");
                console.log("Fetched saved groups:", response.data); // Debugging log
                setSavedGroups(response.data);
            } catch (error) {
                console.error("Error fetching saved groups:", error);
                setSavedGroups([]); // Fallback to an empty array
            }
        };

        fetchSavedGroups();
    }, []);

    return (
        <Container className="border rounded m-2">
            <Row>
                <h6>Saved Groups</h6>
            </Row>
            <Row>
                <ListGroup className="m-2">
                    {Array.isArray(savedGroups) && savedGroups.length > 0 ? (
                        savedGroups.map((group, index) => (
                            <ListGroupItem key={index}>
                                <strong>{group.name}</strong>
                                <ul>
                                    {group.studentIds.map((studentId, subIndex) => (
                                        <li key={subIndex}>{studentId}</li>
                                    ))}
                                </ul>
                            </ListGroupItem>
                        ))
                    ) : (
                        <p>No saved groups available.</p>
                    )}
                </ListGroup>
            </Row>
        </Container>
    );
};

export default SavedGroups;