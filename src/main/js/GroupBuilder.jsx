import { useState } from "react";
import { Container, Row, Button, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import axios from "axios"; // Add this import for API calls

export const buildGroups = (student_list, group_size) => {
    let list_to_group = student_list.slice();
    const groups = [];
    let current_group = [];
    groups.push(current_group);
    while (list_to_group.length !== 0){
        if(current_group.length >= group_size){
            current_group = [];
            groups.push(current_group);
        }
        const ridx = Math.floor(Math.random() * list_to_group.length);
        const student = list_to_group[ridx];
        list_to_group = list_to_group.filter(item=>(item !== student));
        current_group.push(student);
    }    
    //last group will end up with an arbitrary amount of people
    //take one from each group second to last down and add to last, until last has enough
    let index_of_group_to_remove_from = groups.length-2;
    while (groups[groups.length-1].length < group_size-1 && index_of_group_to_remove_from >= 0){
        const groupToRemoveFrom = groups[index_of_group_to_remove_from];
        groups[groups.length-1].push(groupToRemoveFrom.pop());
        index_of_group_to_remove_from -= 1;
    }
    return groups;
};

const GroupBuilderControlPanel = (props) => {
    return (
        <Container > 
            <Row>
                <label className="px-2">Max members: </label>
                <input onChange={props.onGroupSizeChange} type="range" name="Number In Group" id="groupSizeSlider" min="2" max="5" step="1" value={props.groupSize} />
                <output className="px-2"><h4>{props.groupSize}</h4></output>
            </Row>
            <Button onClick={props.onCreateGroupClick}> Create Group </Button>
            <Button onClick={props.onSaveGroupsClick}> Save Groups </Button>
        </Container>
    );
};

export const GroupBuilder = (props) => {
    const [groupSize, setGroupSize] = useState(props.defaultGroupSize);
    const [groups, setGroups] = useState([]);

    const onGroupSizeChange = (e) => {
        setGroupSize(e.target.value);
    };

    const onCreateGroupClick = (e) => {
        setGroups(buildGroups(props.studentsPresent, groupSize));
    };

    const onSaveGroupsClick = async () => {
        const groupName = prompt("Enter a name for the group:");
        if (groupName) {
            const groupData = { name: groupName, groups };
            try {
                const response = await axios.post("http://localhost:8080/api/groups", groupData);
                console.log("Group saved to the back end:", response.data);
            } catch (error) {
                console.error("Error saving group:", error);
            }
        }
    };

    return (
        <Container className="border rounded m-2">
            <Row>
                <label className="px-2"><h6>Make Random Groups: </h6></label>
            </Row>
            <Row>
                <Col>
                    <GroupBuilderControlPanel
                        groupSize={groupSize}
                        onGroupSizeChange={onGroupSizeChange}
                        onCreateGroupClick={onCreateGroupClick}
                        onSaveGroupsClick={onSaveGroupsClick}
                    />
                </Col>
                <Col>
                    <ListGroup className="m-2">
                        {groups.map((group, index) => (
                            <ListGroupItem key={index} role="listitem">
                                {group.map(student => student + ", ")}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default GroupBuilder;

