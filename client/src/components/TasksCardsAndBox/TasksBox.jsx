import React, {useEffect, ReactNode} from 'react';
import "../../index.css"
import Tasks from "./Tasks.jsx";

/**
 * A React component that maps the list of current tasks to their information and displays them in a box container.
 * @component
 * @param {string} title The current task title.
 * @param {Array<Object>} tasksToShow Array of tasks to show.
 * @param {function} onEdit Function to edit the current task.
 * @param {function} onDelete Function to delete the current task.
 * @param {function} onComplete Function to complete the current task.
 * @returns {ReactNode} A React element that renders the task box that shows the list of tasks.
 */
const TasksBox = ({title, tasksToShow, onEdit, onDelete, onComplete}) => {

    useEffect(() => {
        console.log('tasksToShow: ' + tasksToShow)
    },[])

    /** 
     * ? checks whether tasks exists.
     */
    const tasks = tasksToShow?.map((task, index) => (<Tasks 
        key={index}
        taskId = {task.id}
        title={task.title}
        deadline = {task.deadline}
        priority = {task.priority}
        category = {task.category}
        onEdit={() => onEdit(task)}
        onComplete={() => onComplete(task)}
        onDelete={() => onDelete(task)}
    />))

    return (
        <div className="tasksContainer">
            <div className="tasksBoxTitleBox">
                <h3>{title} ({tasks.length})</h3>
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