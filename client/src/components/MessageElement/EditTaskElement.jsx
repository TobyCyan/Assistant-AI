import React, { ReactNode, useEffect, useState } from "react";
import { getYYYYMMDD } from "../../utilities/utilities";

/**
 * A React component that displays the list of task properties that the user can edit on.
 * @component
 * @param {function} applyConfirmation The function to apply user's confirmation.
 * @param {Object} taskToEdit The task to edit.
 * @param {function} setTitle The setter function to set the title.
 * @param {function} setDescription The setter function to set the description.
 * @param {function} setCategory The setter function to set the category.
 * @param {function} setDeadline The setter function to set the deadline.
 * @param {function} setPriority The setter function to set the priority.
 * @param {function} setReminderDate The setter function to set the reminder date.
 * @returns {ReactNode} A React element that renders the edit task element.
 */
const EditTaskElement = ({applyConfirmation, taskToEdit}) => {
    /**
     * The current task title and setter function to update it.
     * @type {[string, function]}
     */
    const [title, setTitle] = useState(taskToEdit?.title || '');

    /**
     * The current task description and setter function to update it.
     * @type {[string, function]}
     */
    const [description, setDescription] = useState(taskToEdit?.description || '');

    /**
     * The current task category and setter function to update it.
     * @type {[string, function]}
     */
    const [category, setCategory] = useState(taskToEdit?.category || '');

    /**
     * The current task deadline and setter function to update it.
     * @type {[string, function]}
     */
    const [deadline, setDeadline] = useState(taskToEdit?.deadline || '');

    /**
     * The current task priority and setter function to update it.
     * @type {[string, function]}
     */
    const [priority, setPriority] = useState(taskToEdit?.priority || '');

    /**
     * The current task reminder date and setter function to update it.
     * @type {[string, function]}
     */
    const [reminder, setReminder] = useState(taskToEdit?.reminder || '');
    
    /**
     * Sets the title on input change.
     * @param {Event} e The change event.
     */
    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    /**
     * Sets the description on input change.
     * @param {Event} e The change event.
     */
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    /**
     * Sets the category on input change.
     * @param {Event} e The change event.
     */
    const handleCategoryChange = (e) => {
        setCategory(e.target.value)
    }

    /**
     * Sets the deadline on input change.
     * @param {Event} e The change event.
     */
    const handleDeadlineChange = (e) => {
        setDeadline(e.target.value)
    }

    /**
     * Sets the priority on input change.
     * @param {Event} e The change event.
     */
    const handlePriorityChange = (e) => {
        setPriority(e.target.value)
    }

    /**
     * Sets the reminder on input change.
     * @param {Event} e The change event.
     */
    const handleReminderChange = (e) => {
        setReminder(e.target.value)
    }

    /**
     * Submits the edited task data to apply confirmation.
     * @param {Event} e The click event.
     */
    const handleConfirmEdit = (e) => {
        /**
        * Data of the edited task.
        * @type {Object}
        */
        const editedTaskData = {
            taskId: taskToEdit.id,
            title: title,
            description: description,
            category: category,
            deadline: deadline,
            priority: priority,
            reminder: reminder,
            completed: taskToEdit.completed,
            points: taskToEdit.points,
        }
        applyConfirmation('confirm', editedTaskData)
        return
    }

    return (
        
            <div>
                Title: <input type="text" value={title} className="inputField" onChange={handleTitleChange}/> <br/>
                Description: <input type="text" value={description} className="inputField" onChange={handleDescriptionChange}/> <br/>
                Category: <input type="text" value={category} className="inputField" onChange={handleCategoryChange}/> <br/>
                Deadline: <input type="date" value={getYYYYMMDD(deadline)} className="inputField" onChange={handleDeadlineChange}/> <br/>
                Priority: <select value={priority} className="inputField" onChange={handlePriorityChange}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select> <br/>
                Reminder: <input type="date" value={getYYYYMMDD(reminder)} className="inputField" onChange={handleReminderChange}/> <br/>

                <button className="confirmEditButton" onClick={handleConfirmEdit}>Confirm</button>
            </div>
        
    )
}

export default EditTaskElement