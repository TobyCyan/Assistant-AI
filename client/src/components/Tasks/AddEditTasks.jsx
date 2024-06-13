import React, { useState, useEffect } from 'react';
import { useTokenContext } from '../TokenContext/TokenContext';
import RenderError from '../RenderError/RenderError';

// To receive the following 1) Task Data (if edit) 2) Type - add or edit - need to load
const AddEditTasks = ({
    taskId, 
    editTitle,
    editDescription,
    editCategory,
    editDeadline,
    editPriority,
    editReminder,
    submitType
}) => {
    const {tokenStatus, userInfo, tasksInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = tasksInfo

    const [title, setTitle] = useState(editTitle ? editTitle : '');
    const [description, setDescription] = useState(editDescription ? editDescription : '');
    const [category, setCategory] = useState(editCategory ? editCategory : '');
    const [deadline, setDeadline] = useState(editDeadline ? editDeadline : '');
    const [priority, setPriority] = useState(editPriority ? editPriority : '');
    const [reminder, setReminder] = useState(editReminder ? editReminder : '')
    const[error, setError] = useState('');

    //Add Task API Call
    const addNewTask = async () => {
        const newTask = {
            userId: userData.userId,
            title: title,
            description: description,
            category: category,
            deadline: deadline,
            priority: priority,
            reminder: null
        }
        const dataToPost = {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: {
                'Content-Type': 'application/json'
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
            setReminder('')
            setTasks([task.newTask, ...tasks]);
            onClose()
        })
    }

    const editTasks = (taskId) => {
        const editedTask = {
            userId: userData.userId,
            taskId: taskId,
            title: title,
            description: description,
            category: category,
            deadline: deadline,
            priority: priority,
            reminder: null
        }
        const dataToPost = {
            method: 'POST',
            body: JSON.stringify(editedTask),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        // POST Request to Add Task.
        fetch('http://localhost:5001/EditTask', dataToPost)
        .then(res => {
            if (res.ok) {
                console.log('Task Successfully Edited!')
                return res.json()
            } else {
                console.error(err => 'Edit Task Failed!', err)
            }
        })
        .then(task => {
            setTasks([task.editTask, ...tasks]);
        })
    }

    const handleSave = (e) => {
        e.preventDefault();
        if(title == '') {
            setError('noTaskTitle');
            return;
        }

        if(category == '') {
            setError('noTaskCategory');
            return;
        }

        if(deadline == '') {
            setError('noTaskDeadline');
            return;
        }

        if(priority == '') {
            setError("noTaskPriority");
            return;
        }

        setError('')

        if (submitType == 'add') {
            addNewTask()
        } else if (submitType == 'edit') {
            editTasks(taskId)
        }
    }

    // Add / Edit Task Layout
    return (
        <div className="addEditTaskContainer">

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
                    placeholder="description"
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

            <button className="saveTask" onClick={e => handleSave(e)}>
                Save
            </button>
        </div>
    )
}

export default AddEditTasks;