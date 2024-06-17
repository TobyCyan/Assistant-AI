import React, { useEffect, useState } from "react";
import TasksBox from "./TasksBox";
import { TaskPriorityQueue } from "../../Data Structures/TaskPriorityQueue";


const PriorityTasks = ({tasksToSort, setTasks, tasksToEdit, setTasksToEdit}) => {
    const [tasksToShow, setTasksToShow] = useState([])
    const [pq, setPQ] = useState([])
    
    useEffect(() => {
        let pq = new TaskPriorityQueue()
        tasksToSort?.forEach(task => {
            pq.pushItem(task, task.priority)
            console.log('PQ is Array? ' + Array.isArray(pq.queue))
        
        });
        setPQ(pq.queue)
    }, [tasksToSort])

    useEffect(() => {
        console.log(pq) // not empty
        const tasksToShow = pq.map((item, index) => (item['task']))
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

export default PriorityTasks