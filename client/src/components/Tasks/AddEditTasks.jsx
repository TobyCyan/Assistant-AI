import React, {useState} from 'react';

// To receive the following 1) Task Data (if edit) 2) Type - add or edit - need to load
const AddEditTasks = () => {
    const[title, setTitle] = useState("");
    const[description, setDescription] = useState("");
    const[category, setCategory] = useState("");
    const[deadline, setDeadline] = useState("");
    const[priority, setPriority] = useState("");
    const[error, setError] = useState("");

    //Add Task API Call
    const addNewTask = async () => {
        //POST
    }

    //Edit Task API Call
    const editTask = async () => {
        //PUT
    }

    const handleAddTask=() => {
        if(!title) {
            setError("Please enter a title");
            return;
        }

        if(!category) {
            setError("Please enter a category");
            return;
        }

        if(!deadline) {
            setError("Please enter a deadline");
            return;
        }

        if(!priority) {
            setError("Please enter a priority level");
            return;
        }

        setError("");

        //Add or Edit
    }

    const onClose = () => {
        //Close Modal
    }

    // Add / Edit Task Layout
    return(
        <div className="addEditTaskContainer">
            <button className="taskCloseButton">
                Close
            </button>

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

            <div className="priorityBox">
                <label>Priority</label>
                <select id="priority" value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="">--Please Choose--</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            <div className="deadlineBox">
                <label>Deadline:</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}/>
            </div>

            <button className="saveTask" onClick={handleAddTask}>
                Save
            </button>
        </div>
    )
}

export default AddEditTasks;