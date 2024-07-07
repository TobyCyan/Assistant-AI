import {useTokenContext} from "../TokenContext/TokenContext.jsx";
import React, { ReactNode } from 'react'

/**
 * A React component that calculates the task points and assign it to the user when completing task, deduct when uncompleting, and removes the task when deleting.
 * @component
 * @param {Object} taskData The data of the current task.
 * @param {string} type The type of operation - add or edit.
 * @param {function} getAllTasks fetch request to get all user tasks.
 * @param {function} getUserInfo fetch request to get the current user info.
 * @param {function} onClose Function to close the modal.
 * @returns {ReactNode} A React element that renders the completing and deleting of user tasks.
 */
const CompleteDeleteTasks = ({taskData, type, getAllTasks, getUserInfo, onClose}) => {
    const {tokenStatus, userInfo} = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    /**
     * Get the Difference between Current Time and Deadline Time.
     * @param {Object} task The task data.
     * @returns {number} The difference between current and deadline time.
     */
    const getTimeDifference = (task) => {
        const deadlineDate = new Date(task.deadline)
        const currDate = new Date()
        const currTime = currDate.getTime()
        const deadlineTime = deadlineDate.getTime()
        const difference = deadlineTime - currTime
        return difference
    }

    /**
     * Round up or down the given num.
     * @param {number} num The number to round up or down.
     * @returns {number} The rounded up or down number.
     */
    const roundNum = (num) => {
        const numCeil = Math.ceil(num)
        const numFloor = Math.floor(num)
        const decimalNum = num - numFloor
        return decimalNum >= 0.5 ? numCeil : numFloor
    }

    /**
     * Calculates the points based on the priority and difference between current time and deadline time.
     * @param {string} priotity The priority of the task - High, Medium, Low
     * @param {number} hours The difference in hours between current time and task deadline time.
     * @returns {number} The priority points of the task.
     */
    const calculatePriorityPoints = (priority, hours) => {
        /**
         * Map points to priority with different weightages.
         * @type {Object}
         */
        const priorityMap = {
            High: 3,
            Medium: 2,
            Low: 1
        }
        return priorityMap[priority] + roundNum(hours / 24)
    }

    /**
     * Calculate Points Earned from Completing the Task.
     * @returns {number} The task points.
     */
    function calculateTaskPoints() {
        const priority = taskData.priority
        const difference = getTimeDifference(taskData)
        const differenceInHours = difference / 1000 / 60 / 60
        const priorityPoints = calculatePriorityPoints(priority, differenceInHours)

        return differenceInHours < 0 ? 1 : priorityPoints + roundNum(differenceInHours * 0.25)
    }

    /**
     * PUT Request to complete task.
     * @async
     * @returns {Promise<void>} A promise that completes the user task.
     * @throws {Error} Throws an error if completing task fails.
     */
    const completeTask = async () => {
        const toEarn = calculateTaskPoints()
        const completedTask = {...taskData, completed: true, points: toEarn}
        const dataToPost = {
            method: 'PUT',
            body: JSON.stringify(completedTask),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const res = await fetch('http://localhost:5001/CompleteTask', dataToPost)
            if(res.ok) {
                console.log(`Task successfully completed, user gained ${toEarn} points!`)
            }
            getAllTasks()
            getUserInfo()
            onClose()
        } catch (error) {
            console.error('Failed to Complete task!', error)
        }
    }

    /**
     * PUT Request to uncomplete Task.
     * @async
     * @returns {Promise<void>} A promise to uncomplete a task.
     * @throws {Error} Throws an error if uncompleting task fails.
     */
    const uncompleteTask = async () => {
        const toDeduct = taskData.points
        const uncompletedTask = {...taskData, completed: false, points: 0}
        const dataToPost = {
            method: 'PUT',
            body: JSON.stringify({uncompletedTask, toDeduct}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const res = await fetch('http://localhost:5001/UncompleteTask', dataToPost)
            if(res.ok) {
                console.log("Task successfully uncompleted")
            }
            getAllTasks()
            getUserInfo()
            onClose()
        } catch (error) {
            console.error('Failed to uncomplete task!', error)
        }
    }

    /**
     * DELETE Request to delete Task.
     * @async
     * @returns {Promise<void>} A promise that deletes a task.
     * @throws {Error} Throws an error if deleting task fails.
     */
    const deleteTask = async () => {
        const taskId = taskData.id
        const dataToPost = {
            method: 'DELETE',
            body: JSON.stringify({taskId}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const res = await fetch('http://localhost:5001/DeleteTask', dataToPost)
            if(res) {
                console.log("Task successfully deleted")
                const data = await res.json()
                getAllTasks()
                onClose()
            }

        } catch (error) {
            console.error('Failed to Delete task!', error)
        }
    }

    /**
     * Select which operation to execute when confirming completing, uncompleting or deleting tasks.
     */
    const handleConfirm = () => {
        if(type === "del") {
            deleteTask()
        } else if (type === "comp") {
            completeTask()
        } else {
            uncompleteTask()
        }
    }

    return (
        <div className="compDelTasksContainer">
            <button className="closeSmallModalBtn" onClick={onClose}></button>
            <div></div>
            <div className="confirmMessage">{`Are you sure you want to ${type ==="del" ? "delete" : type === "comp" ? "complete" : "uncomplete"} this task "${taskData?.title}"?`}</div>
            <button className="confirmCompDelBtn" onClick={handleConfirm}>{type ==="del" ? "DELETE" : type === "comp" ? "COMPLETE" : "UNCOMPLETE"}</button>
        </div>
    )
}

export default CompleteDeleteTasks;