import {useTokenContext} from "../TokenContext/TokenContext.jsx";

const CompleteDeleteTasks = ({taskData, type, getAllTasks, getUserInfo, onClose}) => {
    const {tokenStatus, userInfo, tasksInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = tasksInfo

    const completeTask = async() => {
        const completedTask = {...taskData, completed: true}
        const dataToPost = {
            method: 'PUT',
            body: JSON.stringify(completedTask),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const res = await fetch('http://localhost:5001/CompleteTask', dataToPost)
            if(res,ok) {
                console.log("Task successfully completed")
            }
            getAllTasks()
            getUserInfo()
            onClose()
        } catch (error) {
            console.error('Failed to Complete task!', error)
        }
    }

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
            if(res.ok) {
                console.log("Task successfully deleted")
            }
            getAllTasks()
            onClose()
        } catch (error) {
            console.error('Failed to Delete task!', error)
        }
    }

    const handleConfirm = () => {
        if(type === "del") {
            deleteTask()
        } else {
            completeTask()
        }
    }

    return (
        <div className="compDelTasksContainer">
            <button className="closeSmallModalBtn" onClick={onClose}>Close</button>
            <div>{`Are you sure you want to ${type ==="del" ? "delete" : "complete"} this task ${taskData?.title}?`}</div>
            <button className="confirmCompDelBtn" onClick={handleConfirm}>Confirm</button>
        </div>
    )
}

export default CompleteDeleteTasks;