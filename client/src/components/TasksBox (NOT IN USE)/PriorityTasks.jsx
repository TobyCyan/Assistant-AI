import React, { useEffect, useState, ReactNode } from "react";
import TasksBox from "./TasksBox";
import { TaskPriorityQueue } from "../../Data Structures/TaskPriorityQueue";

/**
 * A React component that creates a custom priority queue, pushes all current tasks into it, sorts by the task priority and displays them.
 * @component
 * @param {Array<Object>} tasksToSort Array of tasks to sort by priority.
 * @param {function} setTasks Function to set the current list of tasks.
 * @param {Array<Object>} tasksToEdit Array of tasks to be edited.
 * @param {function} setTasksToEdit Function to set the current list of tasks to be edited.
 * @returns {ReactNode} A React element to render the tasks sorted by priority. 
 */
export const PriorityTasks = ({tasksToSort, setTasks, tasksToEdit, setTasksToEdit}) => {
    /**
     * @description Current list of tasks to show and setter function to update it.
     * @type {[Array<Object>, function]}
     */
    const [tasksToShow, setTasksToShow] = useState([])

    /**
     * @description The custom priority queue and setter function to update it.
     * @type {[TaskPriorityQueue, function]}
     */
    const [pq, setPQ] = useState([])
    
    /**
     * @function useEffect
     * @description Creates a new priority queue and pushes all the current user tasks into it, then updates the pq.
     */
    useEffect(() => {
        let pq = new TaskPriorityQueue()
        tasksToSort?.forEach(task => {
            pq.pushItem(task, task.priority)   
        });

        setPQ(pq.queue)
    }, [tasksToSort])

    /**
     * @function useEffect
     * @description Maps the sorted tasks in the priority queue to its task and sets the task to show to the list of sorted tasks. 
     */
    useEffect(() => {
        const tasksToShow = pq.map((item) => (item['task']))
        setTasksToShow(tasksToShow)
    }, [pq])

    return (
        <>
        <TasksBox 
            key="Priority" 
            title="Priority" 
            tasksToShow={tasksToShow} 
            setTasks={setTasks} 
            tasksToEdit={tasksToEdit} 
            setTasksToEdit={setTasksToEdit}
        />
        </>
    )

}