import React, { useEffect, useState } from "react";
import TasksBox from "./TasksBox";
import { TaskPriorityQueue } from "../../Data Structures/TaskPriorityQueue";


export const PriorityTasks = ({tasksToSort, setTasks, tasksToEdit, setTasksToEdit}) => {
    const [tasksToShow, setTasksToShow] = useState([])
    const [pq, setPQ] = useState([])
    
    useEffect(() => {
        let pq = new TaskPriorityQueue()
        tasksToSort?.forEach(task => {
            pq.pushItem(task, task.priority)   
        });

        setPQ(pq.queue)
    }, [tasksToSort])

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