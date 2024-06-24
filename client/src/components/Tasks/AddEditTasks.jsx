import React, { useState, useEffect } from 'react';
import { useTokenContext } from '../TokenContext/TokenContext';
import RenderError from '../RenderError/RenderError';

// To receive the following 1) Task Data (if edit) 2) Type - add or edit - need to load
const AddEditTasks = ({taskData, type, getAllTasks, onClose}) => {
    const {tokenStatus, userInfo, tasksInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = tasksInfo

    const [title, setTitle] = useState(taskData?.title || '');
    const [description, setDescription] = useState(taskData?.description  || '');
    const [category, setCategory] = useState(taskData?.category || '');
    const [deadline, setDeadline] = useState(taskData?.deadline.substring(0, 10) || '');
    const [priority, setPriority] = useState(taskData?.priority || '');
    const [reminderDate, setReminderDate] = useState(taskData?.reminder.substring(0,10) || '');
    // const [reminderTime, setReminderTime] = useState(taskData?.reminder.substring(11,16) || '');
    const[error, setError] = useState('');

    //Add Task API Call
    const addNewTask = async () => {
        console.log(reminderDate)
        // console.log(reminderTime)
        const newTask = {
            title: title,
            description: description,
            category: category,
            deadline: deadline,
            priority: priority,
            reminder: reminderDate,
            //reminder: `${reminderDate}T${reminderTime}:00`,
            completed: false,
            points: 0,
        }
        const dataToPost = {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        // POST Request to Add Task.
        fetch('http://localhost:5001/AddTask', dataToPost)
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
            setReminderDate('')
            //setReminderTime('')
            getAllTasks()
            onClose()
        })
    }

    const editTask = async () => {
        const editedTask = {
            taskId: taskData.id,
            title: title,
            description: description,
            category: category,
            deadline: deadline,
            priority: priority,
            reminder: reminderDate,
            //reminder: `${reminderDate}T${reminderTime}:00`,
            completed: taskData.completed,
            points: taskData.points,
        }
        console.log(deadline)
        const dataToPost = {
            method: 'PUT',
            body: JSON.stringify(editedTask),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        // POST Request to Add Task.
        await fetch('http://localhost:5001/EditTask', dataToPost)
        .then(res => {
            if (res.ok) {
                console.log('Task Successfully Edited!')
                return res.json()
            } else {
                console.error(err => 'Edit Task Failed!', err)
            }
        })
        .then(task => {
            getAllTasks()
            onClose()
        })
    }

    const handleSave = () => {
        if(!title) {
            setError('noTaskTitle');
            return;
        }

        if(!category) {
            setError('noTaskCategory');
            return;
        }

        if(!deadline) {
            setError('noTaskDeadline');
            return;
        }

        if(!priority) {
            setError("noTaskPriority");
            return;
        }

        setError('')

        if (type === "add") {
            addNewTask()
        } else {
            editTask()
        }
    }

    // Add / Edit Task Layout
    return (
        <div className="addEditTaskContainer">
            <button className="closeAddEditModalBtn" onClick={onClose}>Close</button>

            {RenderError.renderNoTaskTitleError(error)}
            <div className="titleBox">
                <label>Title</label>
                <input
                    type="text"
                    className="titleInput"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>

            <div className="descriptionBox">
                <label>Description</label>
                <textarea
                    type="text"
                    className="descriptionInput"
                    placeholder="Description"
                    rows={12}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>

            {RenderError.renderNoTaskCategoryError(error)}
            <div className="categoryBox">
                <label>Category</label>
                <input
                    type="text"
                    className="titleInput"
                    placeholder="Category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                />
            </div>

            {RenderError.renderNoTaskPriorityError(error)}
            <div className="priorityBox">
                <label>Priority</label>
                <select id="priority" value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="">--Please Choose--</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            {RenderError.renderNoTaskDeadlineError(error)}
            <div className="deadlineBox">
                <label>Deadline:</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}/>
            </div>

            {RenderError.renderNoTaskDeadlineError(error)}
            <div className="reminderBox">
                <label>Reminder Date:</label>
                <input type="date" value={reminderDate} onChange={e => setReminderDate(e.target.value)}/>
            </div>

            <button className="saveTask" onClick={handleSave}>
                {type === 'edit' ? 'Save' : 'Add'}
            </button>
        </div>
    )

    /*
        Reminder Time Component to be added back later
                {RenderError.renderNoTaskDeadlineError(error)}
            <div className="deadlineBox">
                <label>Reminder Time:</label>
                <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)}/>
            </div>
     */
}

export default AddEditTasks;