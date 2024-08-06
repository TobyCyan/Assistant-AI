import { useTokenContext } from "../TokenContext/TokenContext.jsx";
import React, { ReactNode } from "react"
import { calculateTaskPoints } from "../../utilities/utilities.js";

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
     * The Express API URL for this React app.
     * @type {string}
     */
    const expressApiUrl = import.meta.env.VITE_EXPRESS_API_URL

    /**
     * PUT Request to complete task.
     * @async
     * @returns {Promise<void>} A promise that completes the user task.
     * @throws {Error} Throws an error if completing task fails.
     */
    const completeTask = async () => {
        const toEarn = calculateTaskPoints(taskData)
        const completedTask = {...taskData, completed: true, points: toEarn}
        const dataToPost = {
            method: "PUT",
            body: JSON.stringify(completedTask),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
        try {
            const res = await fetch(`${expressApiUrl}CompleteTask`, dataToPost)
            if(res.ok) {
                console.log(`Task successfully completed, user gained ${toEarn} points!`)
            }
            getAllTasks()
            getUserInfo()
            onClose()
        } catch (error) {
            console.error("Failed to Complete task!", error)
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
            method: "PUT",
            body: JSON.stringify({uncompletedTask, toDeduct}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };
        try {
            const res = await fetch(`${expressApiUrl}UncompleteTask`, dataToPost)
            if(res.ok) {
                console.log("Task successfully uncompleted")
            }
            getAllTasks()
            getUserInfo()
            onClose()
        } catch (error) {
            console.error("Failed to uncomplete task!", error)
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
            method: "DELETE",
            body: JSON.stringify({taskId}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };

        try {
            const res = await fetch(`${expressApiUrl}DeleteTask`, dataToPost)
            if(res) {
                console.log("Task successfully deleted")
                const data = await res.json()
                getAllTasks()
                onClose()
            }

        } catch (error) {
            console.error("Failed to Delete task!", error)
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

export default CompleteDeleteTasks