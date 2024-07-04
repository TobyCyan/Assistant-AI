import React, { useEffect, useState, ReactNode, useRef } from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import TasksBox from "../components/TasksBox/TasksBox";
import Modal from 'react-modal';
import { useTokenContext } from "../components/TokenContext/TokenContext";
import AddEditTasks from "../components/Tasks/AddEditTasks";
import CompleteDeleteTasks from "../components/Tasks/CompleteDeleteTasks";
import ProductivityBar from "../components/ProductivityBar/ProductivityBar.jsx";
import {isTodayBirthday, isTodayNextDayOfBirthday, compareTasksPriority, compareTasksDeadline, calculateTaskProductivity} from "../utilities/utilities.js";
import AIBox from '../components/AIBox/AIBox.jsx';
import BirthdayCard from '../components/Birthday/BirthdayCard.jsx';
import BirthdayCardBackground from '../../../images/birthdaycardbackground.png'

/**
 * A React component that displays the home page and a brief layout of the current user tasks, including the navigation bar, 4 task boxes, and the modal to add or edit tasks.
 * @component
 * @returns {ReactNode} A React element that renders the home page.
 */
const Home = () => {
    const {tokenStatus, userInfo, userTasks} = useTokenContext()
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
    const [tasks, setTasks] = userTasks
    
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
     * The current state of BirthdayModal and setter function to update it.
     * @type {[Object, function]}
     */
    const [birthdayModalOpen, setBirthdayModalOpen] = useState({
        isShown: true
    })
    
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

    const closeBirthdayModal = () => {
        setBirthdayModalOpen({
            isShown: false
        })
        localStorage.setItem('birthdayShown', true)
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
     * Open modal when it's the user's birthday.
     */
    const handleBirthday = () => {
        setBirthdayModalOpen({
            isShown: true,
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

    /**
     * @function useEffect
     * @description Checks if birthdayShown exists in the local storage, sets it if not.
     */
    useEffect(() => {
        const birthdayShownStored = localStorage.getItem('birthdayShown')

        if (!birthdayShownStored) {
            localStorage.setItem('birthdayShown', false)
        }
    }, [])

    /**
     * @function useEffect
     * @description Checks whether today is user's birthday and shows the birthday card if it is.
     */
    useEffect(() => {
        //const birthday = userData.dateOfBirth
        const birthday = '2003-07-04T00:00:00.000Z'
        if (!birthday) {
            return
        }

        const birthdayShown = JSON.parse(localStorage.getItem('birthdayShown'))
        if (isTodayBirthday(birthday) && !birthdayShown) {
            handleBirthday()
        }
    }, [userData])

    /**
     * @function useEffect
     * @description Resets birthdayShown state the next day after user's birthday.
     */
    useEffect(() => {
        const birthday = userData.dateOfBirth
        //const birthday = 'Thu Jul 03 2024 17:46:09 GMT+0800 (Malaysia Time)'
        if (isTodayNextDayOfBirthday(birthday)) {
            localStorage.setItem('birthdayShown', false)
        }
    }, [])

    /**
     * Dummy function that returns nothing.
     * @param {*} dummy Dummy argument.
     * @returns absolutely nothing.
     */
    const dummyFunction = (dummy) => {
        return
    }

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

                                <AIBox stylingCondition={'Home'} chatting={false} setChatting={dummyFunction}/>

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
                />
            </Modal>
            <Modal
                isOpen = {birthdayModalOpen.isShown}
                onRequestClose={closeBirthdayModal}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    }
                }}
                className="BirthdayCardModal"
                >
                <BirthdayCard 
                    onClose={closeBirthdayModal}
                />
            </Modal>
        </>
    )
}

export default Home;