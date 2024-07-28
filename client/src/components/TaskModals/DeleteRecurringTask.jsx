import {useTokenContext} from "../TokenContext/TokenContext.jsx";
import React, {ReactNode} from 'react'

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
const DeleteRecurringTask = ({recurringTask, onClose, getAllTasks}) => {
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
     * DELETE Request to delete Task.
     * @async
     * @returns {Promise<void>} A promise that deletes a task.
     * @throws {Error} Throws an error if deleting task fails.
     */
    const deleteTask = async () => {
        const taskId = recurringTask.id
        const dataToPost = {
            method: 'DELETE',
            body: JSON.stringify({taskId}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const res = await fetch(`${expressApiUrl}DeleteRecTask`, dataToPost)
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

    return (
        <div className="delTasksContainer">
            <button className="closeSmallModalBtn" onClick={onClose}></button>
            <div></div>
            <div className="confirmMessage">{`Are you sure you want to delete recurring task "${recurringTask?.title}"?`}</div>
            <button className="confirmDelBtn" onClick={deleteTask}>DELETE</button>
        </div>
    )
}

export default DeleteRecurringTask;