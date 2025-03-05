import React, { useState } from 'react';
import { exampleOf18Students } from "./examples/JsonExamples";
import GroupBuilder from '../../main/js/GroupBuilder';
import SavedGroups from '../../main/js/SavedGroups';

export const SavedGroupsDemo = (props) => {
    const [savedGroups, setSavedGroups] = useState([]);

    const handleSaveGroups = (group) => {
        setSavedGroups([...savedGroups, group]);
    };

    return (
        <div>
            <h3>Group Builder and Saved Groups Demo</h3>
            <GroupBuilder studentsPresent={exampleOf18Students} defaultGroupSize={3} onSaveGroups={handleSaveGroups} />
            <SavedGroups savedGroups={savedGroups} />
        </div>
    );
};

export default SavedGroupsDemo;