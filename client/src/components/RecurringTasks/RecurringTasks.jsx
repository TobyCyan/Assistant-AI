import React from "react";
import { addDays, getDDMM } from "../../utilities/utilities.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";

function RecurringTasks({recurringTask, onEdit, onDelete}) {
    const{lastCreated, nextCreation, creationToDeadline, interval, reminderToDeadline} = recurringTask
    const lastCreatedDate = lastCreated ? new Date(lastCreated) : null
    const lastCreation = lastCreated ? getDDMM(lastCreatedDate.toLocaleDateString("en-CA")) : "NA"
    const latestDeadline = lastCreated ? getDDMM(addDays(lastCreatedDate, creationToDeadline).toLocaleDateString("en-CA")) : "NA"
    const nextCreationDate = new Date(nextCreation)
    const nextCreationString = getDDMM(nextCreationDate.toLocaleDateString("en-CA"))
    const nextDeadline = getDDMM(addDays(nextCreationDate, creationToDeadline).toLocaleDateString("en-CA"))


    return (
        <div className="recTableRow">
            <div className="recTableColumn">{recurringTask?.title}</div>
            <div className="recTableColumn">{recurringTask?.category}</div>
            <div className="recTableColumn">{recurringTask?.priority}</div>
            <div className="recTableColumn">{lastCreation}</div>
            <div className="recTableColumn">{latestDeadline}</div>
            <div className="recTableColumn">{nextCreationString}</div>
            <div className="recTableColumn">{nextDeadline}</div>
            <div className="recTableColumn">{interval}</div>
            <div className="recTableColumn">{reminderToDeadline}</div>
            <div className="recTableColumn recTableActions">
                <button onClick={onEdit} className="editBtn">
                    <FontAwesomeIcon icon={faEdit} className="editIcon"/>
                </button>
                <button className="recTaskDeleteButton" onClick={onDelete}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
            </div>
        </div>
    )
}

export default RecurringTasks