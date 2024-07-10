import React, {useState, useEffect} from "react";
import {getTimeDifference} from "./Tasks";
import TasksBox from "./TasksBox";

// Task is Overdue if Difference between Current Time and Deadline is Negative.
const isTaskOverDue = (task) => {
    const difference = getTimeDifference(task)
    return difference < 0 
}

export const OverDueTasks = ({tasks, setTasks, tasksToEdit, setTasksToEdit}) => {
    const [tasksToShow, setTasksToShow] = useState([])

    useEffect(() => {
        const tasksToShow = tasks.filter((task) => isTaskOverDue(task))
        setTasksToShow(tasksToShow)
    }, [tasks])

    return (
        <>
        <TasksBox 
            key="Overdue" 
            title="Overdue" 
            tasksToShow={tasksToShow} 
            setTasks={setTasks} 
            tasksToEdit={tasksToEdit} 
            setTasksToEdit={setTasksToEdit}
        />
        </>
    )

}