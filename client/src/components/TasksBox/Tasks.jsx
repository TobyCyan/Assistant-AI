import React, { useEffect, useState } from 'react';
import '../../index.css';
import {getDDMM} from "../../utilities/utilities.js";


// To Add onComplete, onDelete
const Tasks = ({taskId, title, deadline, onEdit, onComplete, onDelete}) => {
    return (
        <li>
            <div key={taskId} className="task">
                <div className="taskInnerBox">
                    <div className="taskTitle">
                        <span style={{fontWeight: 'bold'}}>{getDDMM(deadline)}</span> {title}
                    </div>
                    <div className="taskMsg"></div>
                    <div className="taskActions">
                        <button onClick={onEdit} className="taskEditButton">Edit</button>
                        <button onClick={onDelete} className="taskCrossButton"></button>
                        <button onClick={onComplete} className="taskTickButton"></button>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default Tasks;