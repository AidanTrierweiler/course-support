import React from 'react';

import {exampleOf18Students} from "./examples/JsonExamples"
import SingleStudentSelector from '../../main/js/SingleStudentSelector';

export const SingleStudentSelectorDemo = (props) => {
    return (
        <div>
            <h3>Random Selection Method</h3>
            <SingleStudentSelector studentsPresent={exampleOf18Students} selectionMethod="random" />
            <h3>Queue Selection Method</h3>
            <SingleStudentSelector studentsPresent={exampleOf18Students} selectionMethod="queue" />
        </div>
    );
};

export default SingleStudentSelectorDemo;