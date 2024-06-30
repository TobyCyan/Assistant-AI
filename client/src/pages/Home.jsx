import React, { useEffect, useState, ReactNode } from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import TasksBox from "../components/TasksBox/TasksBox";
import Modal from 'react-modal';
import { useTokenContext } from "../components/TokenContext/TokenContext";
import AddEditTasks from "../components/Tasks/AddEditTasks";
import CompleteDeleteTasks from "../components/Tasks/CompleteDeleteTasks";
import ProductivityBar from "../components/ProductivityBar/ProductivityBar.jsx";
import {compareTasksPriority, compareTasksDeadline, calculateTaskProductivity} from "../utilities/utilities.js";

/**
 * A React component that displays the home page and a brief layout of the current user tasks, including the navigation bar, 4 task boxes, and the modal to add or edit tasks.
 * @component
 * @returns {ReactNode} A React element that renders the home page.
 */
const Home = () => {
    const {tokenStatus, userInfo} = useTokenContext()
    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    /**
     * The current user data and setter function to update it.
     * @type {[Object, function]}
     */
    const [userData, setUserData] = userInfo

    /**
     * The current user tasks and setter function to update it.
     * @type {[Array<Object>, function]}
     */
    const [tasks, setTasks] = useState([])

    /**
     * Filters the uncompleted task and sort them by the deadline.
     * @type {Array<Object>} The list of uncompleted tasks sorted by deadline.
     */
    const uncompletedTasks = tasks.filter(task => !task.completed).sort(compareTasksDeadline) || []
    const productivity = calculateTaskProductivity(tasks);

    /**
     * The current state of AddEditModal and setter function to update it.
     * @type {[Object, function]}
     */
    const[addEditModalOpen, setAddEditModalOpen] = useState({
        isShown: false,
        type: "add",
        data: null,
    })

    /**
     * The current state of CompleteDeleteModal and setter function to update it.
     * @type {[Object, function]}
     */
    const[compDelModalOpen, setCompDelModalOpen] = useState({
        isShown: false,
        type: "del",
        data: null,
    })

    /**
     * @function useEffect
     * @description On First Load, Get User Info and User Tasks if there is token.
     */
    useEffect(() => {
        if(token) {
            localStorage.setItem('token', token);
            setToken(token)
            getUserInfo()
            getUserTasks()
        }
    }, [])

    /**
     * @function useEffect
     * @description Get User Info and User Tasks if there is token
     */
    useEffect(() => {
        if (token) {
            console.log("Token Set")
            localStorage.setItem('token', token);
            getUserInfo();
            getUserTasks();
        }
    }, [token]);

    /** 
     * Async GET method to get user tasks.
     * @async
     * @returns {Promise<void>} A promise that gets the current user's tasks.
     * @throws {Error} Throws an error if getting user tasks fails.
     */
    const getUserTasks = async () => {
        const dataToPost = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const res = await fetch('http://localhost:5001/Tasks', dataToPost)
            if(res.ok) {
                console.log("Tasks successfully retrieved")
            } else {
                console.log("Invalid User/Tasks")
            }

            const data = await res.json()
            if(data) {
                console.log('Type of Tasks: ' + typeof data.tasks + ', Tasks: ' + data.tasks + ', isArray? ' + Array.isArray(data.tasks))
                setTasks(data.tasks)
                console.log(data.tasks)
            }
        } catch (error) {
            console.error('Failed to Fetch Tasks!', error)
        }
    }

    /** 
     * Async GET method to get user data.
     * @async
     * @returns {Promise<void>} A promise that gets the current user's data.
     * @throws {Error} Throws an error if getting user data fails.
     */
    const getUserInfo = async () => {
        const dataToPost = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const res = await fetch('http://localhost:5001/GetUserInfo', dataToPost)
            if(res.ok) {
                console.log("UserInfo successfully retrieved")
            } else {
                console.log("Invalid User/Info")
            }

            const data = await res.json()
            if(data) {
                console.log(data)
                setUserData(data)
            }
        } catch (error) {
            console.error('Failed to Fetch User Info!', error)
        }
    }

    /**
     * Closes the Add Edit Task Modal.
     */
    const closeAddEditModal = () => {
        setAddEditModalOpen({
            isShown: false,
            type: "add",
            data: null,
        })
    }

    /**
     * Closes the Complete Delete Task Modal.
     */
    const closeCompDelModal = () => {
        setCompDelModalOpen({
            isShown: false,
            type: "del",
            data: null,
        })
    }

    /**
     * Open Modal when user wants to add task, to load empty page.
     */
    const handleAddTask = () => {
        setAddEditModalOpen({
            isShown: true,
            type: "add",
            data: null, //To add data
        })
    }

    /** 
     * Open Modal when user wants to edit, to load current note data.
     * @param {Object} taskData Data of current task.
     */
    const handleEditTask = (taskData) => {
        // To receive data
        setAddEditModalOpen({
            isShown: true,
            type: "edit",
            data: taskData, //To add data
        })
    }

    /**
     * Open Modal when user wants to delete task.
     * @param {Object} taskData Data of current task.
     */
    const handleDeleteTask = (taskData) => {
        setCompDelModalOpen({
            isShown: true,
            type: "del",
            data: taskData,
        })
    }

    /** 
     * Open Modal when user wants to complete task.
     * @param {Object} taskData Data of current task.
     */
    const handleCompleteTask = (taskData) => {
        setCompDelModalOpen({
            isShown: true,
            type: "comp",
            data: taskData,
        })
    }

    /** 
     * To compare current date.
     * @type {Date}
     */
    const currentDate = new Date()

    /** 
     * Array of Overdued Tasks.
     * @type {Array<Object>}
     */
    const overduedTasks = uncompletedTasks.filter(each => {
        const deadlineDate = new Date(each.deadline)
        return deadlineDate < currentDate
    })

    /**
     * Array of tasks with reminders past current date.
     * @type {Array<Object>}
     */
    const remindersTasks = uncompletedTasks.filter(each => {
        const reminderDate = new Date(each.reminder)
        return reminderDate < currentDate
    })

    /** 
     * Array of upcoming tasks.
     * @type {Array<Object>}
     */
    const upcomingTasks = uncompletedTasks.filter(each => {
        const deadlineDate = new Date(each.deadline)
        return deadlineDate > currentDate
    });

    /**
     * Array of tasks sorted from high to low priority.
     * @type {Array<Object>}
     */
    const priorityTasks = uncompletedTasks.sort(compareTasksPriority)

    return (
        <>
            <NavBar />
            <div className="homepageContainer">
                <div className="overdueAndRemindersBox">
                    <TasksBox id="overdueBox" key="Overdued" title="Overdued" tasksToShow={overduedTasks} onEdit={handleEditTask} onComplete={handleCompleteTask}  onDelete={handleDeleteTask}/>
                    <TasksBox key="Reminders" title="Reminders" tasksToShow={remindersTasks} onEdit={handleEditTask} onComplete={handleCompleteTask}  onDelete={handleDeleteTask} />
                </div>
                <div className="upcomingAndPriorityBox">
                    <TasksBox key="Upcoming" title="Upcoming" tasksToShow={upcomingTasks} onEdit={handleEditTask} onComplete={handleCompleteTask}  onDelete={handleDeleteTask}/>
                    <TasksBox key="Priority" title="Priority" tasksToShow={priorityTasks} onEdit={handleEditTask} onComplete={handleCompleteTask}  onDelete={handleDeleteTask}/>
                </div>

                    {!token ? (
                        <div className="assistantCharacterBox">
                            <div>
                                <h2>Please Log In or Sign Up to Add Tasks!</h2>
                            </div>
                        </div>
                            ) : (
                            <div className="assistantCharacterBox">
                                <div className="addButtonBox">
                                    <button className="addTaskBtn" onClick={handleAddTask}>Add Task</button>
                                </div>
                                <div className="userDisplayBox">
                                    <div>Welcome back {userData?.username}!</div>
                                    <div>Points: {userData?.points || 0}</div>
                                    <div className="productivityBox">
                                        <h3>Productivity Report</h3>
                                        <ProductivityBar percentage={productivity}/>
                                        <h3>{productivity}%</h3>
                                    </div>
                                </div>
                                <div className="AIbox">
                                    <p>Assistant AI</p>
                                </div>
                            </div>
                            )}

                        </div>
                        <Modal
                        isOpen={addEditModalOpen.isShown}
                onRequestClose={closeAddEditModal}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    },
                }}
                contentLabel=""
                className="AddEditTaskModal"
            >
                <AddEditTasks
                    type={addEditModalOpen.type}
                    taskData={addEditModalOpen.data}
                    onClose={closeAddEditModal}
                    getAllTasks={getUserTasks}
                />
            </Modal>
            <Modal
                isOpen={compDelModalOpen.isShown}
                onRequestClose={closeCompDelModal}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    },
                }}
                contentLabel=""
                className="CompDelTaskModal"
            >
                <CompleteDeleteTasks
                    type={compDelModalOpen.type}
                    taskData={compDelModalOpen.data}
                    onClose={closeCompDelModal}
                    getAllTasks={getUserTasks}
                    getUserInfo={getUserInfo}
                />
            </Modal>
        </>
    )
}

export default Home;