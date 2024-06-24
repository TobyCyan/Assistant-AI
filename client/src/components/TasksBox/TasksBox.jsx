import React, { useEffect } from 'react';
import "../../index.css"
import Tasks from "./Tasks.jsx";

// Receives an Array,
const TasksBox = ({title, tasksToShow, onEdit, onDelete, onComplete}) => {

    useEffect(() => {
        console.log('tasksToShow: ' + tasksToShow)
    },[])

    // Check whether tasks exists first
    const tasks = tasksToShow?.map((task, index) => (<Tasks 
        key={index}
        taskId = {task.id}
        title={task.title}
        deadline = {task.deadline}
        onEdit={() => onEdit(task)}
        onComplete={() => onComplete(task)}
        onDelete={() => onDelete(task)}
    />))

    return (
        <div className="tasksContainer">
            <div className="tasksTitleBox">
                <h3>{title}</h3>
            </div>
            <div className="tasksBox">
                <ul>
                    {tasks}
                </ul>
            </div>
        </div>
    );
}

export default TasksBox;