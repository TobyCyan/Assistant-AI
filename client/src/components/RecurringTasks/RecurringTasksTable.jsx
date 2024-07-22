import React from 'react';
import RecurringTasks from "./RecurringTasks.jsx";

const RecurringTasksTable = ({ recurringTasks, onEdit, onDelete }) => {
    return (
        <div className="recurringTasksTable">
            <div className="recTableHeader">
                <div className="recTableColumn">Title</div>
                <div className="recTableColumn">Category</div>
                <div className="recTableColumn">Priority</div>
                <div className="recTableColumn">Last Created</div>
                <div className="recTableColumn">Last Deadline</div>
                <div className="recTableColumn">Next Creation</div>
                <div className="recTableColumn">Next Deadline</div>
                <div className="recTableColumn">Intervals</div>
                <div className="recTableColumn">Reminder Before Deadline</div>
                <div className="recTableColumn recTableActions">Edit</div>
                <div className="recTableColumn recTableActions">Delete</div>
            </div>
            <div className="recTableBody">
                {recurringTasks.map((recTask, index) => (
                    <RecurringTasks key={index} recurringTask={recTask} onEdit={() => onEdit(recTask)} onDelete={() => onDelete(recTask)}/>
                ))}
            </div>
        </div>
    );
};

export default RecurringTasksTable;