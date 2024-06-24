import React, { useEffect, useState } from 'react';
import '../../index.css';
import { useTokenContext } from '../TokenContext/TokenContext';
import {getDDMM, getDDMMYY} from "../../utilities/utilities.js";


// To Add onComplete, onDelete
const Tasks = ({taskId, title, deadline, onEdit, onComplete, onDelete}) => {
    const { tokenStatus, userInfo, tasksInfo } = useTokenContext()
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = tasksInfo
    const [isToEdit, setIsToEdit] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [pointsToBeDeducted, setPointsToBeDeducted] = useState(0)


    // Reverses the Completion Status of the Task and Deducts the Points from the User.
    /*
    function onInComplete() {
        const dataToPost = {
            method: 'POST', 
            body: JSON.stringify({taskId, userId, pointsToBeDeducted}), 
            headers: {
            'Content-Type': 'application/json'
            }
        }
        fetch('http://localhost:5001/InCompleteTask', dataToPost)
        .then(res => {
            if (res.ok) {
                console.log('Task InCompleted!')
                setIsComplete(false)
                return
            }
        })
        .catch(err => console.error('Task Could not be InCompleted', err))

    }
    */

    // Deletes the Current Task from the Task List.
    /*
    function onDelete(index) {
        setTasks([...tasks.slice(0, index), ...tasks.slice(index + 1)]);
        
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
    */

    return (
        <li>
            <div key={taskId} className="task">
                <div className="taskTitle">
                    <span style={{fontWeight: 'bold'}}>{getDDMM(deadline)}</span> {title}
                </div>
                <div className="taskMsg"></div>
                <div className="taskActions">
                    <button onClick={onEdit} className="taskButton">Edit</button>
                    <button onClick={onComplete} className="taskButton">C</button>
                    <button onClick={onDelete} className="taskButton">X</button>
                </div>
            </div>
        </li>
    );
}

export default Tasks;