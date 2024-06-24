import React from 'react';

const DetailedTaskCard = ({taskData, onEdit, onComplete, onUncomplete, onDelete}) => {
    return (
        <div className="taskCardBox">
            <div className="taskCardHeader">
                <div className="taskCardTitle">{taskData.title}</div>
                <div className="taskCardRightHeader">
                    <div className="taskCardDeadline">{taskData.deadline.substring(5,10).replace('-', '/')}/{taskData.deadline.substring(2, 4)}</div>
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
                <div className="taskReminder">{taskData.reminder.substring(5, 10).replace('-', '/') || "NO REMINDER YET"}</div>
                <button className="taskCardEditBtn" onClick={onEdit}>Edit</button>
                <button className="taskCardCompleteBtn" onClick={taskData.completed ? onUncomplete : onComplete}>{taskData.completed ? "Uncomplete" : "Complete" }</button>
            </div>
        </div>


    );

}

export default DetailedTaskCard;