import React, {ReactNode} from 'react';
import '../../index.css';
import {getDDMM} from "../../utilities/utilities.js";


/**
 * A React component to add, complete and delete task while displaying all the task information.
 * @component
 * @param {number} taskId The current task id.
 * @param {title} string The current task title.
 * @param {deadline} string The current task deadline.
 * @param {priority} string The current task priority.
 * @param {category} string The current task category.
 * @param {function} onEdit Function to edit the current task.
 * @param {function} onComplete Function to complete the current task.
 * @param {function} onDelete Function to delete the current task.
 * @returns {ReactNode} A React element that renders the information of the current task.
 */
const Tasks = ({taskId, title, deadline, priority, category, onEdit, onComplete, onDelete}) => {
    return (
        <li>
            <div key={taskId} className="task">
                <div className="taskInnerBox">
                    <div className="titleAndPriorityBox">
                        <div className="taskTitle">
                            <span style={{fontWeight: 'bold'}}>{getDDMM(deadline)}</span> {title}
                        </div>
                        <div className="taskPriorityAndCategory">
                            {priority} | {category}
                        </div>
                    </div>

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