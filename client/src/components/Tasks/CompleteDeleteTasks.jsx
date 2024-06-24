import {useTokenContext} from "../TokenContext/TokenContext.jsx";

const CompleteDeleteTasks = ({taskData, type, getAllTasks, getUserInfo, onClose}) => {
    const {tokenStatus, userInfo, tasksInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo

    // Get the Difference between Current Time and Deadline Time.
    const getTimeDifference = (task) => {
        const deadlineDate = new Date(task.deadline)

        const currDate = new Date()
        const currTime = currDate.getTime()
        const deadlineTime = deadlineDate.getTime()
        const difference = deadlineTime - currTime
        return difference
    }

    // Round up or down the given num.
    const roundNum = (num) => {
        const numCeil = Math.ceil(num)
        const numFloor = Math.floor(num)
        const decimalNum = num - numFloor
        return decimalNum >= 0.5 ? numCeil : numFloor
    }

    const calculatePriorityPoints = (priority, hours) => {
        const priorityMap = {
            High: 3,
            Medium: 2,
            Low: 1
        }
        return priorityMap[priority] + roundNum(hours / 24)
    }

    // Calculate Points Earned from Completing the Task.
    // Not Final
    function calculateTaskPoints() {
        const priority = taskData.priority
        const difference = getTimeDifference(taskData)
        const differenceInHours = difference / 1000 / 60 / 60
        const priorityPoints = calculatePriorityPoints(priority, differenceInHours)

        return differenceInHours < 0 ? 1 : priorityPoints + roundNum(differenceInHours * 0.25)
    }

    /*
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
        };
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
            <button className="closeSmallModalBtn" onClick={onClose}>Close</button>
            <div className="confirmMessage">{`Are you sure you want to ${type ==="del" ? "delete" : type === "comp" ? "complete" : "uncomplete"} this task ${taskData?.title}?`}</div>
            <button className="confirmCompDelBtn" onClick={handleConfirm}>Confirm</button>
        </div>
    )
}

export default CompleteDeleteTasks;