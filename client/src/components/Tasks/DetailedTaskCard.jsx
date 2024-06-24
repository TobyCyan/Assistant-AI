import React from 'react';

const DetailedTaskCard = ({taskData, onEdit, onComplete, onDelete}) => {
    /*
    return (
        <div className="taskCardBox">
            <div className="taskCardHeader">
                <div className="taskCardTitle">Title</div>
                <div className="taskCardRightHeader">
                    <div className="taskCardDeadline">Deadline Date</div>
                    <button className="taskCardDeleteBtn">X</button>
                </div>
            </div>
            <div className="taskCardSecondHeader">
                <div className="taskCardCategory">Category</div>
                <div className="taskCardPriority">Low</div>
            </div>
            <div className="taskCardContent">
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
                This is a filler line. This is a filler line. This is a filler line. This is a filler line.
            </div>
            <div className="taskCardFooter">
                <div className="taskReminder">Reminder Date</div>
                <button className="taskCardEditBtn">Edit</button>
            </div>
        </div>


    );

     */

    return (
        <div className="taskCardBox">
            <div className="taskCardHeader">
                <div className="taskCardTitle">{taskData.title}</div>
                <div className="taskCardRightHeader">
                    <div className="taskCardDeadline">{taskData.deadline.substring(0,10)}</div>
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
                <div className="taskReminder">{taskData.reminder.substring(5, 10) || "NO REMINDER YET"}</div>
                <button className="taskCardEditBtn" onClick={onEdit}>Edit</button>
                <button className="taskCardCompleteBtn" onClick={onComplete}>Complete</button>
            </div>
        </div>


    );

}

export default DetailedTaskCard;