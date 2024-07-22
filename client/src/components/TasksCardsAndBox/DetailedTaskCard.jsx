import React, {ReactNode} from 'react';
import {getDDMM, getDDMMYY} from '../../utilities/utilities.js'

/**
 * A React component of the detailed task card.
 * @component
 * @param {Object} taskData The data of the current task.
 * @param {function} onEdit Function to edit the task.
 * @param {function} onComplete Function to complete the task.
 * @param {function} onUncomplete Function to uncomplete the task.
 * @param {function} onDelete Function to delete the task.
 * @returns {ReactNode} A React element that renders a detailed card of the task.
 */
const DetailedTaskCard = ({taskData, onEdit, onComplete, onUncomplete, onDelete}) => {


    return (
        <div className="taskCardBox">
            <div className="taskCardHeader">
                <div className="taskCardTitle">{taskData.title}</div>
                <div className="taskCardRightHeader">
                    <div className="taskCardDeadline">{getDDMMYY(taskData.deadline)}</div>
                    <button className="taskCardDeleteBtn" onClick={onDelete}>X</button>
                </div>
            </div>
            <div className="taskCardSecondHeader">
                <div className="taskCardCategory">{taskData.category}</div>
                <div className="taskCardPriority">{taskData.priority}</div>
            </div>
            <div className="taskCardDescription">
                {taskData.description}
            </div>
            <div className="taskCardFooter">
                <div className="taskReminder">{getDDMM(taskData.reminder) || "NO REMINDER YET"}</div>
                {!taskData.completed && (<button className="taskCardEditBtn" onClick={onEdit}>Edit</button>)}
                <button className="taskCardCompleteBtn" onClick={taskData.completed ? onUncomplete : onComplete}>{taskData.completed ? "Uncomplete" : "Complete" }</button>
            </div>
        </div>
    );

}

export default DetailedTaskCard;