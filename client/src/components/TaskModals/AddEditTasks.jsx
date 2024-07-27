import React, { useState, ReactNode } from 'react';
import  { useTokenContext } from '../TokenContext/TokenContext';
import RenderError from '../RenderError/RenderError';
import {getTodayYYYYMMDD} from "../../utilities/utilities.js";

/**
 * A React component to add or edit tasks.
 * @component
 * @param {Object} taskData The data of the current task.
 * @param {string} type The type of operation - add or edit.
 * @param {function} getAllTasks fetch request to get all user tasks.
 * @param {function} onClose Function to close the modal.
 * @returns {ReactNode} A React element that renders the AddEditTasks modal.
 */
const AddEditTasks = ({taskData, type, getAllTasks, onClose}) => {
    const {tokenStatus} = useTokenContext()
    const [token, setToken] = tokenStatus

    /**
     * The current task title and setter function to update it.
     * @type {[string, function]}
     */
    const [title, setTitle] = useState(taskData?.title || '');

    /**
     * The current task description and setter function to update it.
     * @type {[string, function]}
     */
    const [description, setDescription] = useState(taskData?.description  || '');

    /**
     * The current task category and setter function to update it.
     * @type {[string, function]}
     */
    const [category, setCategory] = useState(taskData?.category || '');

    /**
     * The current task deadline and setter function to update it.
     * @type {[string, function]}
     */
    const [deadline, setDeadline] = useState(taskData?.deadline?.substring(0, 10) || '');

    /**
     * The current task priority and setter function to update it.
     * @type {[string, function]}
     */
    const [priority, setPriority] = useState(taskData?.priority || '');

    /**
     * The current task reminder date and setter function to update it.
     * @type {[string, function]}
     */
    const [reminderDate, setReminderDate] = useState(taskData?.reminder?.substring(0,10) || '');
    // const [reminderTime, setReminderTime] = useState(taskData?.reminder.substring(11,16) || '');

    const [recurring, setRecurring] = useState(taskData?.recurring || false)

    const [startDate, setStartDate] = useState(taskData?.startDate || getTodayYYYYMMDD())

    const [interval, setInterval] = useState(taskData?.interval || '')

    /**
     * The Express API URL for this React app.
     * @type {string}
     */
    const expressApiUrl = import.meta.env.VITE_EXPRESS_API_URL

    /**
     * The current task error and setter function to update it.
     * @type {[string, function]}
     */
    const[error, setError] = useState('');

    const handleCheckboxChange = (event) => {
        setRecurring(event.target.checked);
        if (!event.target.checked) {
            setStartDate(getTodayYYYYMMDD());
            setInterval('');
        }
    }

    /**
     * POST Request to Add Task.
     * @async
     * @returns {Promise<void>} A promise that adds the user task.
     * @throws {Error} Throws an error if adding task fails.
     */
    const addNewTask = async () => {
        // console.log(reminderTime)
        const newTask = {
            title,
            description,
            category,
            deadline,
            priority,
            reminder: reminderDate,
            completed: false,
            points: 0,
        }

        /**
         * Data to post and make the API call.
         * @type {Object}
         */
        const dataToPost = {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(`${expressApiUrl}AddTask`, dataToPost)
        .then(res => {
            if (res.ok) {
                // console.log('Task Successfully Added!')
                return res.json()
            } else {
                console.error(err => 'Add Task Failed!', err)
            }
        })
        .then(task => {
            setTitle('')
            setDescription('')
            setCategory('')
            setDeadline('')
            setPriority('')
            setReminderDate('')
            getAllTasks()
            onClose()
        })
        .catch(err => {
            console.error('Error Adding Task: ', err.message)
        })
    }

    /**
     * POST Request to Edit Task.
     * @async
     * @returns {Promise<void>} A promise that edits the user task.
     * @throws {Error} Throws an error if editing task fails.
     */
    const editTask = async () => {

        /**
         * Data of the edited task.
         * @type {Object}
         */
        const editedTask = {
            taskId: taskData.id,
            title,
            description,
            category,
            deadline,
            priority,
            reminder: reminderDate,
            completed: taskData.completed,
            points: taskData.points,
        }

        /**
         * Data to post and make the API call.
         * @type {Object}
         */
        const dataToPost = {
            method: 'PUT',
            body: JSON.stringify(editedTask),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        await fetch(`${expressApiUrl}EditTask`, dataToPost)
            .then(res => {
                if (res.ok) {
                    // console.log('Task Successfully Edited!')
                    return res.json()
                } else {
                    console.error(err => 'Edit Task Failed!', err)
                }
            })
            .then(task => {
                getAllTasks()
                onClose()
            })
            .catch(err => {
                console.error('Error Editing Task: ', err.message)
            })
    }

    /**
     * Handles saving the new task or edited task.
     */
    const handleSave = () => {
        if(!title) {
            setError('noTaskTitle');
            return;
        }

        if(!category) {
            setError('noTaskCategory');
            return;
        }

        if(!priority) {
            setError("noTaskPriority");
            return;
        }

        if(!deadline) {
            setError('noTaskDeadline');
            return;
        }

        if(!reminderDate) {
            setError('noTaskReminder')
            return
        }

        /**
         * @type {Date} Current date.
         */
        const currentDate = new Date()

        /**
         * @type {Date} Task deadline date.
         */
        const deadlineObj = new Date(deadline)

        /**
         * @type {Date} Task reminder date.
         */
        const reminderObj = new Date(reminderDate)

        if(deadlineObj < currentDate) {
            setError('deadlinePast')
            return
        }

        if(reminderObj < currentDate) {
            setError('reminderPast')
            return
        }

        if(reminderObj > deadlineObj) {
            setError('reminderBeforeDeadline')
            return
        }

        setError('')

        if (type === "add") {
            addNewTask()
        } else {
            editTask()
        }
    }

    // To be added
    /*
                <div className="recurringDetailsBox">
                <div className="recurringCheckBox">
                    <label htmlFor="recurringInput">Recurring</label>
                    <input id="recurringInput" type="checkbox" className="recurringInput" value={recurring} onChange={handleCheckboxChange}/>
                </div>

                {recurring && (
                    <div className="recurringDateBox">
                    <label htmlFor="recurringDateInput">Start Date:</label>
                    <input id="recurringDateInput" className="recurringDateInput" type="date" value={startDate}
                           onChange={e => setDeadline(e.target.value)}/>
                </div>)}

                {recurring && (<div className="recurringIntervalBox">
                    <label htmlFor="intervalInput">Interval (Days):</label>
                    <input id="intervalInput" className="intervalInput" type="number" value={interval}
                           onChange={e => setDeadline(e.target.value)}/>
                </div>)}
            </div>
     */

    return (
        <div className="addEditTaskContainer">
            <button className="closeAddEditModalBtn" onClick={onClose}></button>
            <div className="titleBox" >
                <label htmlFor="titleInput">Title</label>
                <input
                    type="text"
                    id="titleInput"
                    className="titleInput"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>
            {RenderError.renderNoTaskTitleError(error)}

            <div className="descriptionBox">
                <label htmlFor="descriptionInput">Description</label>
                <textarea
                    type="text"
                    id="descriptionInput"
                    className="descriptionInput"
                    placeholder="Description"
                    rows={12}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>

            {RenderError.renderNoTaskCategoryError(error)}
            <div className="categoryBox">
                <label htmlFor="categoryInput">Category</label>
                <input
                    type="text"
                    id="categoryInput"
                    className="categoryInput"
                    placeholder="Category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                />
            </div>

            <div className="priorityAndDatesBox">
                <div className="priorityBox">
                    <label htmlFor="priority">Priority</label>
                    <select id="priority" value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="">--Please Choose--</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div className="deadlineBox">
                    <label htmlFor="deadlineInput">Deadline:</label>
                    <input id="deadlineInput" className="deadlineInput" type="date" value={deadline}
                           onChange={e => setDeadline(e.target.value)}/>
                </div>

                <div className="reminderBox">
                    <label htmlFor="reminderInput">Reminder Date:</label>
                    <input id="reminderInput" className="reminderInput" type="date" value={reminderDate}
                           onChange={e => setReminderDate(e.target.value)}/>
                </div>
            </div>

            {RenderError.renderPriorityOrDateError(error)}

            <button className="saveTaskBtn" onClick={handleSave}>
                {type === 'edit' ? 'UPDATE' : 'ADD'}
            </button>
        </div>
    )
}

export default AddEditTasks;