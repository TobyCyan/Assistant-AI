import React, { useEffect, useState } from 'react';
import '../../index.css'
import { useTokenContext } from '../TokenContext/TokenContext';

// To Add onComplete, onDelete
const Tasks = ({index, taskId, title, message, tasksToEdit, setTasksToEdit}) => {
    const { tokenStatus, userInfo, tasksInfo } = useTokenContext()
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = tasksInfo

    const [isToEdit, setIsToEdit] = useState(false)

    useEffect(() => {
        if (isToEdit) {
            setTasksToEdit([...tasksToEdit, tasks[index]])
        } else {
            const filteredTasks = tasksToEdit?.filter(x => x.id != taskId)
            setTasksToEdit(filteredTasks)
        }
    }, [isToEdit])
    
    function onComplete() {
        // POST Request to Update User Points.
    }

    function onDelete(index) {
        setTasks([...tasks.slice(0, index), ...tasks.slice(index + 1)]);
        
        const userId = userData.userId
        // POST Request to Delete Task by id from db.
        const dataToPost = {
            method: 'POST', 
            body: JSON.stringify({taskId, userId}), 
            headers: {
            'Content-Type': 'application/json'
            }
        }
        fetch('http://localhost:5001/DeleteTask', dataToPost)
        .then(res => {
            if (res.ok) {
                console.log('Task Successfully Deleted!')
                return
            }
        })
        .catch(err => console.error('Task Deletion Failed', err))
    }

    return (
        <li>
            <div key={index} className="task">
                <div className="taskTitle">{title}</div>
                <div className="taskMsg">{message}</div>
                <div className="taskActions">
                    <button onClick={() => {onComplete}} className="taskButton">Tick</button>
                    <button onClick={() => {onDelete(index)}} className="taskButton">Cross</button>
                </div>
                <input type="checkbox" value={isToEdit} onChange={() => setIsToEdit(!isToEdit)}/>
            </div>
        </li>
    );
}

export default Tasks;