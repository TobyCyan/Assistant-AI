import React, {useEffect, useState, ReactNode} from 'react';
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
const TasksBox = ({title, tasks, tasksToShow, onEdit, onDelete, onComplete}) => {
    const [taskList, setTaskList] = useState([])
    useEffect(() => {
        console.log('tasksToShow: ' + tasksToShow)
    },[])

    /**
     * @function useEffect
     * @description Maps each task onto their details to convert into a Task component.
     */
    useEffect(() => {
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

        setTaskList(tasks)

    }, [tasks])

    return (
        <div className="tasksContainer">
            <div className="tasksBoxTitleBox">
                <h3>{title} ({taskList.length})</h3>
            </div>
            <div className="tasksBox">
                <ul>
                    {taskList}
                </ul>
            </div>
        </div>
    );
}

export default TasksBox;