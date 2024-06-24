import React, { useEffect, useState } from 'react';
import '../../index.css';
import { useTokenContext } from '../TokenContext/TokenContext';

// Round up or down the given num.
export const roundNum = (num) => {
    const numCeil = Math.ceil(num)
    const numFloor = Math.floor(num)
    const decimalNum = num - numFloor
    return decimalNum >= 0.5 ? numCeil : numFloor
}

export const calculatePriorityPoints = (priority, hours) => {
    const priorityMap = {
        High: 3,
        Medium: 2,
        Low: 1
    }
    return priorityMap[priority] + roundNum(hours / 24)
}

// To Add onComplete, onDelete
const Tasks = ({taskId, title, deadline, message, onEdit, onComplete, onDelete}) => {
    const { tokenStatus, userInfo, tasksInfo } = useTokenContext()
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = tasksInfo

    const [isToEdit, setIsToEdit] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [pointsToBeDeducted, setPointsToBeDeducted] = useState(0)

    // Keeps Track of the Selected Tasks to Edit and Puts Them in a List.
    /*
    useEffect(() => {
        if (isToEdit) {
            setTasksToEdit([...tasksToEdit, tasks[index]])
        } else {
            const filteredTasks = tasksToEdit?.filter(x => x.id != taskId)
            setTasksToEdit(filteredTasks)
        }
    }, [isToEdit])
    */

    // Calculate Points Earned from Completing the Task.
    // Not Final
    function calculateTaskPoints() {
        //const task = tasks[key]
        const priority = task.priority
        const deadlineDate = new Date(task.deadline)

        const currDate = new Date()
        const currTime = currDate.getTime()
        const deadlineTime = deadlineDate.getTime()
        const difference = deadlineTime - currTime
        const differenceInHours = difference / 1000 / 60 / 60
        const priorityPoints = calculatePriorityPoints(priority, differenceInHours)

        return differenceInHours < 0 ? 1 : priorityPoints + roundNum(differenceInHours * 0.25)
    }

    // Completes the Task and Updates the User's Points.
    function onComplete() {
        // POST Request to Update User Points.
        const points = calculateTaskPoints()
        setPointsToBeDeducted(points)
        const dataToPost = {
            method: 'POST', 
            body: JSON.stringify({taskId, userId, points}), 
            headers: {
            'Content-Type': 'application/json'
            }
        }
        fetch('http://localhost:5001/CompleteTask', dataToPost)
        .then(res => {
            if (res.ok) {
                console.log('Task Completed!')
                setIsComplete(true)
                return
            }
        })
        .catch(err => console.error('Task Could not be Completed', err))
    }

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
                    <span style={{fontWeight: 'bold'}}>{deadline.substring(5, 10)}</span> {title}
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