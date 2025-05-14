import { useState, useEffect } from "react";
import { Container, Row, Button, Col, ListGroup, ListGroupItem } from "react-bootstrap"; // Removed Form
import Select from "react-select";
import axios from "axios";

export const buildGroups = (student_list, group_size) => {
    let list_to_group = student_list.slice();
    const groups = [];
    let current_group = [];
    groups.push(current_group);
    while (list_to_group.length !== 0) {
        if (current_group.length >= group_size) {
            current_group = [];
            groups.push(current_group);
        }
        const ridx = Math.floor(Math.random() * list_to_group.length);
        const student = list_to_group[ridx];
        list_to_group = list_to_group.filter(item => item !== student);
        current_group.push(student);
    }
    return groups;
};

export const GroupBuilder = (props) => {
    const [groupSize, setGroupSize] = useState(props.defaultGroupSize);
    const [groups, setGroups] = useState([]);
    const [manualGroup, setManualGroup] = useState([]);
    const [remainingStudents, setRemainingStudents] = useState(props.studentsPresent);

    // Update remainingStudents if studentsPresent changes (when course changes)
    useEffect(() => {
        setRemainingStudents(props.studentsPresent);
        setGroups([]);
        setManualGroup([]);
    }, [props.studentsPresent]);

    const onGroupSizeChange = (e) => {
        setGroupSize(e.target.value);
    };

    const onCreateGroupClick = () => {
        setGroups(buildGroups(remainingStudents, groupSize));
    };

    const onSaveGroupsClick = async () => {
        const currentDate = new Date().toISOString().split("T")[0];
        const groupName = prompt(`Enter a name for the group (default: ${currentDate}):`, currentDate);

        if (groupName) {
            const groupData = {
                name: String(groupName),
                subgroups: JSON.stringify(groups),
                courseId: props.courseId, // Always use the courseId from props
            };

            try {
                const response = await axios.post("http://localhost:8080/api/groups", groupData);
                console.log("Group and subgroups saved to the back end:", response.data);
            } catch (error) {
                console.error("Error saving group and subgroups:", error);
            }
        }
    };

    const onFinalizeManualGroup = () => {
        if (manualGroup.length > 0) {
            setGroups([...groups, manualGroup]);
            setManualGroup([]); // Clear the manual group after finalizing
        }
    };

    const onClearManualGroup = () => {
        setRemainingStudents([...remainingStudents, ...manualGroup]);
        setManualGroup([]);
    };

    const onManualGroupChange = (selectedStudents) => {
        const selectedStudentNames = selectedStudents.map((option) => option.value);
        setManualGroup(selectedStudentNames);
        setRemainingStudents(remainingStudents.filter((s) => !selectedStudentNames.includes(s)));
    };

    return (
        <Container className="border rounded m-2">
            <Row>
                <label className="px-2">
                    <h6>Make Random Groups: </h6>
                </label>
            </Row>
            <Row>
                <Col>
                    <h6>Random Group Creation</h6>
                    <Row>
                        <label className="px-2">Max members: </label>
                        <input
                            onChange={onGroupSizeChange}
                            type="range"
                            name="Number In Group"
                            id="groupSizeSlider"
                            min="2"
                            max="5"
                            step="1"
                            value={groupSize}
                        />
                        <output className="px-2">
                            <h4>{groupSize}</h4>
                        </output>
                    </Row>
                    <Button className="m-2" onClick={onCreateGroupClick}>
                        Create Random Groups
                    </Button>
                </Col>
                <Col>
                    <h6>Manual Group Creation</h6>
                    <Select
                        isMulti
                        options={remainingStudents.concat(manualGroup).map((student) => ({
                            value: student,
                            label: props.studentInfo?.[student] || student // Show preferred name
                        }))}
                        value={manualGroup.map((student) => ({
                            value: student,
                            label: props.studentInfo?.[student] || student
                        }))}
                        onChange={onManualGroupChange}
                        placeholder="Select students to add to the group"
                    />
                    <h6 className="mt-3">Current Manual Group</h6>
                    <ListGroup className="m-2">
                        {manualGroup.map((student, index) => (
                            <ListGroupItem key={index}>
                                {props.studentInfo?.[student] || student}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                    <Button
                        className="m-2 btn-success"
                        onClick={onFinalizeManualGroup}
                        disabled={manualGroup.length === 0}
                    >
                        Finalize Group
                    </Button>
                    <Button
                        className="m-2 btn-danger"
                        onClick={onClearManualGroup}
                        disabled={manualGroup.length === 0}
                    >
                        Clear Manual Group
                    </Button>
                </Col>
                <Col>
                    <h6>Current Groups</h6>
                    <ListGroup className="m-2">
                        {groups.map((group, index) => (
                            <ListGroupItem key={index}>
                                Group {index + 1}: {group.map(s => props.studentInfo?.[s] || s).join(", ")}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
            <Row>
                <Button className="m-2 btn-primary" onClick={onSaveGroupsClick}>
                    Save All Groups
                </Button>
            </Row>
        </Container>
    );
};

export default GroupBuilder;

