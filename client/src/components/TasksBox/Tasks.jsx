import React from 'react';
import '../../index.css'

// To Add onComplete, onDelete
const Tasks = ({title, message}) => {
    return (
        <li>
            <div className="task">
                <div className="taskTitle">{title}</div>
                <div className="taskActions">
                    <button onClick={() => {}} className="taskButton">Tick</button>
                    <button onClick={() => {}} className="taskButton">Cross</button>
                </div>
            </div>
        </li>
    );
}

export default Tasks;