import React, {useState} from 'react';
import RenderError from "../RenderError/RenderError.jsx";
import {useTokenContext} from "../TokenContext/TokenContext.jsx";
import {getTodayYYYYMMDD, addDays} from "../../utilities/utilities.js";

const AddRecurringTasks = ({type, recurringTask, onClose, getAllTasks}) => {
    const {tokenStatus} = useTokenContext()
    const [token, setToken] = tokenStatus

    /**
     * The current task title and setter function to update it.
     * @type {[string, function]}
     */
    const [title, setTitle] = useState(recurringTask?.title || '');

    /**
     * The current task description and setter function to update it.
     * @type {[string, function]}
     */
    const [description, setDescription] = useState(recurringTask?.description  || '');

    /**
     * The current task category and setter function to update it.
     * @type {[string, function]}
     */
    const [category, setCategory] = useState(recurringTask?.category || '');

    const computeDeadline = () => {
        if (recurringTask && recurringTask.nextCreation && recurringTask.creationToDeadline) {
            const nextCreation = new Date(recurringTask.nextCreation);
            // Create a new date object for the deadline
            const deadlineDate = new Date(nextCreation);
            deadlineDate.setDate(nextCreation.getDate() + recurringTask.creationToDeadline);
            return deadlineDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
        return ''; // Default to empty string if no valid recurringTask
    };

    /**
     * The current task deadline and setter function to update it.
     * @type {[string, function]}
     */
    const [deadline, setDeadline] = useState(recurringTask ? computeDeadline : '');

    /**
     * The current task priority and setter function to update it.
     * @type {[string, function]}
     */
    const [priority, setPriority] = useState(recurringTask?.priority || '');

    const [interval, setInterval] = useState(recurringTask?.interval || '')

    const [creationDays, setCreationDays] = useState(recurringTask?.creationToDeadline || '')

    const [reminderDays, setReminderDays] = useState(recurringTask?.reminderToDeadline || '')

    const [error, setError] = useState('')

    /**
     * The Express API URL for this React app.
     * @type {string}
     */
    const expressApiUrl = import.meta.env.VITE_EXPRESS_API_URL

    /**
     * POST Request to Add Task.
     * @async
     * @returns {Promise<void>} A promise that adds the user task.
     * @throws {Error} Throws an error if adding task fails.
     */
    const addNewRecurringTask = async () => {
        const parsedInterval = parseInt(interval, 10)
        const creationToDeadline = parseInt(creationDays, 10)
        const reminderToDeadline = parseInt(reminderDays, 10)

        const deadlineDate = new Date(deadline)
        const nextCreation = addDays(deadlineDate, -1 * creationToDeadline)

        console.log(nextCreation)

        // console.log(reminderTime)
        const newTask = {
            title,
            description,
            category,
            deadline,
            priority,
            interval: parsedInterval,
            creationToDeadline,
            reminderToDeadline,
            lastCreated: null,
            nextCreation,
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

        fetch(`${expressApiUrl}AddRecTask`, dataToPost)
            .then(res => {
                if (res.ok) {
                    console.log('Task Successfully Added!')
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
                setInterval('')
                setCreationDays('')
                setReminderDays('')
                getAllTasks()
                onClose()
            })
            .catch(err => {
                console.error('Error Adding Task: ', err.message)
            })
    }

    /*
        Logic:
        It will just create the next task also
        1. Interval change - just update interval
        2. Deadline change - just update deadline
        3. CreationToDeadline - just update
        4. ReminderToDeadline - just update
        5. nextCreation will be today and from there ->

        Error Handling
        1. Interval cannot be <= 0
        2. ReminderToDeadline cannot be > Creation
        3. Deadline cannot be backdated
     */

    const editNewRecurringTask = async () => {
        const parsedInterval = parseInt(interval, 10)
        const creationToDeadline = parseInt(creationDays, 10)
        const reminderToDeadline = parseInt(reminderDays, 10)

        const deadlineDate = new Date(deadline)
        const nextCreation = addDays(deadlineDate, -1 * creationToDeadline)

        // console.log(reminderTime)
        const editedTask = {
            taskId: recurringTask.id,
            title,
            description,
            category,
            deadline,
            priority,
            interval: parsedInterval,
            creationToDeadline,
            reminderToDeadline,
            nextCreation,
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

        fetch(`${expressApiUrl}EditRecTask`, dataToPost)
            .then(res => {
                if (res.ok) {
                    console.log('Task Successfully Edited!')
                    return res.json()
                } else {
                    console.error(err => 'Edit Task Failed!', err)
                }
            })
            .then(task => {
                setTitle('')
                setDescription('')
                setCategory('')
                setDeadline('')
                setPriority('')
                setInterval('')
                setCreationDays('')
                setReminderDays('')
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

        if(!interval) {
            setError('noTaskInterval')
            return
        }

        if(!creationDays){
            setError('noTaskCreation')
            return
        }

        if(!reminderDays){
            setError('noReminder')
            return
        }

        /**
         * @type {Date} Current date.
         */
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() - 1)
        currentDate.setHours(23, 59, 59)

        /**
         * @type {Date} Task deadline date.
         */
        const deadlineObj = new Date(deadline)

        if(deadlineObj < currentDate) {
            setError('deadlinePast')
            console.log(currentDate)
            console.log(deadlineObj)
            return
        }

        const intInterval = parseInt(interval,10)
        const intCreationDays = parseInt(creationDays,10)
        const intReminderDays = parseInt(reminderDays,10)

        if(intInterval <= 0) {
            setError('negativeInterval')
            return
        }

        if(intCreationDays < 0) {
            setError('negativeCreation')
            return
        }

        if(intReminderDays < 0) {
            setError('negativeReminder')
            return
        }

        if(intReminderDays > intCreationDays) {
            setError('reminderBeforeCreation')
            return
        }

        setError('')

        if (type === "add") {
            addNewRecurringTask()
        } else {
            editNewRecurringTask()
        }
    }

    return (
        <div className="addRecurringTasksContainer">
            <button className="closeAddEditModalBtn" onClick={onClose}></button>
            <div className="titleBox">
                <label htmlFor="recTitleInput">Title</label>
                <input
                    type="text"
                    id="recTitleInput"
                    className="titleInput"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>
            {RenderError.renderNoTaskTitleError(error)}

            <div className="descriptionBox">
                <label htmlFor="recDescriptionInput">Description</label>
                <textarea
                    id="recDescriptionInput"
                    className="descriptionInput"
                    placeholder="Description"
                    rows={12}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>

            <div className="categoryBox">
                <label htmlFor="recCategoryInput">Category</label>
                <input
                    type="text"
                    id="recCategoryInput"
                    className="categoryInput"
                    placeholder="Category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                />
            </div>
            {RenderError.renderNoTaskCategoryError(error)}

            <div className="priorityAndDeadlineBox">
                <div className="priorityBox">
                    <label htmlFor="recPriority">Priority</label>
                    <select id="recPriority" value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="">--Please Choose--</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div className="deadlineBox">
                    <label htmlFor="recDeadlineInput">Next Deadline:</label>
                    <input id="recDeadlineInput" className="deadlineInput" type="date" value={deadline}
                           onChange={e => setDeadline(e.target.value)}/>
                </div>

                <div className="intervalBox">
                    <label htmlFor="intervalInput">Interval (Days):</label>
                    <input id="intervalInput" className="intervalInput" type="number" value={interval}
                           onChange={e => setInterval(e.target.value)}/>
                </div>
            </div>

            {RenderError.renderPriorityOrDateError(error)}

            <div className="creationAndReminderBox">
                <div className="beforeDeadline">
                    Before Deadline (Days):
                </div>

                <div className="creationNumberBox">
                    <label htmlFor="creationInput">Task Creation: </label>
                    <input id="creationInput" className="creationInput" type="number" value={creationDays}
                           onChange={e => setCreationDays(e.target.value)}/>
                </div>

                <div className="reminderNumberBox">
                    <label htmlFor="reminderNumberInput">Reminder:</label>
                    <input id="reminderNumberInput" className="reminderNumberInput" type="number" value={reminderDays}
                           onChange={e => setReminderDays(e.target.value)}/>
                </div>

            </div>

            {RenderError.renderCreationOrReminderError(error)}

            <button className="saveTaskBtn" onClick={handleSave}>
                {type === 'edit' ? 'UPDATE' : 'ADD'}
            </button>
        </div>
    );
}

export default AddRecurringTasks;