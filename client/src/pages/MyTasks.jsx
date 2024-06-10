import React, { useEffect, useState } from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import TasksBox from "../components/TasksBox/TasksBox";
import Modal from 'react-modal';
import AddEditTasks from "../components/Tasks/AddEditTasks";
import { useTokenContext } from "../components/TokenContext/TokenContext";

const MyTasks = () => {
    const {tokenStatus, userInfo, tasksInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = tasksInfo

    const[isAddTaskModalOpen, setAddTaskModalOpen] = useState({
        isShown: false,
        type: "add",
        data: null,
    })
    
    useEffect(() => {
        if (token) {
            console.log('Username is ' + userData.username)
            const userId = userData.userId
            const dataToPost = {
                method: 'POST',
                body: JSON.stringify({userId}),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            // Sends a request with the username as payload.
            fetch('http://localhost:5001/Tasks', dataToPost)
            .then(res => {
                // Sets the tasks if response is ok.
                if (res.ok) {
                    console.log('Tasks Successfully Fetched!')
                    return res.json()
                } else {
                    console.log('Invalid User/ Tasks')
                }
            })
            .then(tasks => {
                if (tasks) {
                    console.log(tasks)
                    setTasks(tasks.tasks)
                }
            })
            .catch(err => console.error('Failed to Fetch Tasks!', err))
        }
    }
    , [])

    // Closes the  Modal
    const closeModal = () => {
        setAddTaskModalOpen({
            isShown: false,
            type: "add",
            data: null,
        })
    }

    // Open Modal when user wants to add task, to load empty page
    const handleAddTask = () => {
        setAddTaskModalOpen({
            isShown: true,
            type: "add",
            data: null, //To add data
        })
    }

    // Open Modal when user wants to edit, to load current note data
    const handleEditTask = () => {
        // To receive data
        setAddTaskModalOpen({
            isShown: true,
            type: "edit",
            data: null, //To add data
        })
    }

    return (
        <>
            <NavBar/>
            <div className="homepageContainer">
                <div className="overdueAndRemindersBox">
                    <TasksBox key="Overdued" title="Overdued" tasksToShow={tasks}/>
                    <TasksBox key="Reminders" title="Reminders" tasksToShow={tasks}/>
                </div>
                <div className="upcomingAndPriorityBox">
                    <TasksBox key="Upcoming" title="Upcoming" tasksToShow={tasks} setTasks={setTasks}/>
                    <TasksBox key="Priority" title="Priority" tasksToShow={tasks} setTasks={setTasks}/>
                </div>
                <div className="assistantCharacterBox">
                    <div className="box">
                        <p>Assistant AI</p>
                    </div>
                    {token ? (
                        <>
                        <button onClick={() => handleAddTask()}>Add Task</button>
                        <button onClick={() => handleEditTask()}>Edit Task</button>
                        </>
                        ) : (
                            <div>Login To Start Adding Tasks!</div>
                        )
                    } 
                
                </div>
            </div>
            <Modal
                isOpen={isAddTaskModalOpen.isShown}
                taskData = {isAddTaskModalOpen.data}
                onClose={closeModal}
                appElement={document.getElementById('root')}
            >
                <button onClick={closeModal} className="taskCloseButton">
                    Close
                </button>

                <AddEditTasks 
                tasks={tasks} 
                setTasks={setTasks}
                />
            </Modal>
        </>
    )
}

export default MyTasks;