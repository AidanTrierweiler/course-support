import { useEffect, useState } from "react";
import { Container, Row, ListGroup, ListGroupItem } from "react-bootstrap";
// import axios from "axios"; // Uncomment this when the server is set up

export const SavedGroups = () => {
    const [savedGroups, setSavedGroups] = useState([]);

    useEffect(() => {
        const fetchSavedGroups = async () => {
            try {
                // Uncomment and implement the GET request when the server is set up
                // const response = await axios.get("http://localhost:8080/api/groups");
                // setSavedGroups(response.data);
                console.log("Fetched saved groups"); // Placeholder for success message
            } catch (error) {
                console.error("Error fetching saved groups:", error);
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
                    {savedGroups.map((group, index) => (
                        <ListGroupItem key={index}> {group.map(student => student + ", ")} </ListGroupItem>
                    ))}
                </ListGroup>
            </Row>
        </Container>
    );
};

export default SavedGroups;