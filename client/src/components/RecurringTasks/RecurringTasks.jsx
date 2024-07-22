import React from 'react';
import {addDays, getDDMM} from "../../utilities/utilities.js";

function RecurringTasks({recurringTask, onEdit, onDelete}) {
    const{lastCreated, creationToDeadline, interval, reminderToDeadline} = recurringTask
    const lastCreatedDate = new Date(lastCreated)
    const lastCreation = getDDMM(lastCreatedDate.toLocaleDateString('en-CA'))
    const nextCreation = getDDMM(addDays(lastCreatedDate, interval).toLocaleDateString('en-CA'))
    const latestDeadline = getDDMM(addDays(lastCreatedDate, creationToDeadline).toLocaleDateString('en-CA'))
    const nextDeadline = getDDMM(addDays(lastCreatedDate, interval + creationToDeadline).toLocaleDateString('en-CA'))

    return (
        <div className="recTableRow">
            <div className="recTableColumn">{recurringTask?.title}</div>
            <div className="recTableColumn">{recurringTask?.category}</div>
            <div className="recTableColumn">{recurringTask?.priority}</div>
            <div className="recTableColumn">{lastCreation}</div>
            <div className="recTableColumn">{nextCreation}</div>
            <div className="recTableColumn">{latestDeadline}</div>
            <div className="recTableColumn">{nextDeadline}</div>
            <div className="recTableColumn">{interval}</div>
            <div className="recTableColumn">{reminderToDeadline}</div>
            <div className="recTableColumn recTableActions"><button onClick={onEdit}>Edit</button></div>
            <div className="recTableColumn recTableActions"><button className="recTaskDeleteButton" onClick={onDelete}></button></div>
        </div>
    );
}

export default RecurringTasks;