import React, { useEffect, useState, ReactNode } from "react";
import NavBar from "../components/NavBar/NavBar.jsx";
import TasksBox from "../components/TasksCardsAndBox/TasksBox";
import Modal from "react-modal";
import { useTokenContext } from "../components/TokenContext/TokenContext";
import AddEditTasks from "../components/TaskModals/AddEditTasks";
import CompleteDeleteTasks from "../components/TaskModals/CompleteDeleteTasks";
import ProductivityBar from "../components/ProductivityBar/ProductivityBar.jsx";
import { isTaskOverdue, isTaskNeededToBeReminded, isTaskUpcoming, isTodayBirthday, isTodayNextDayOfBirthday, compareTasksPriority, compareTasksDeadline, calculateTaskProductivity, getProductivityBarComments, startIntro, setHasFinishedIntroAtPage } from "../utilities/utilities.js";
import AIBox from "../components/AIBox/AIBox.jsx";
import BirthdayCard from "../components/Birthday/BirthdayCard.jsx";
import ReminderRoom from "../components/ReminderRoom/ReminderRoom.jsx";
// import { wait } from "../utilities/ChatPageUtilities.js";
import IntroElement from "../components/IntroElements/IntroElement.jsx";

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
    const [token, ] = tokenStatus

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
     * The initial state of activating the intro and setter function to update it.
     * @type {[boolean, function]}
     */
    const [activateIntro, setActivateIntro] = useState(false)
    
    /**
     * The initial state of activating the birthday modal and setter function to update it.
     * @type {[boolean, function]}
     */
    const [activateBirthday, setActivateBirthday] = useState(false)
    
    /**
     * The name of the current page.
     * @type {string}
     */
    const page = "Home"

    /**
     * The steps for the webpage intro.
     * @returns {Array<Object>} An array of objects that specify the element to highlight or the intro value.
     */
    const introSteps = () => [
        {
            intro: "Welcome to Assistant AI!",
        },
        {
            element: ".homepageTaskContainer",
            intro: "These are your tasks.",
        },
        {
            element: ".overdueAndRemindersBox",
            intro: "Your overdued tasks will be shown here, as well as your reminders so you don't forget!",
        },
        {
            element: ".upcomingAndPriorityBox",
            intro: "All of your upcoming tasks will be displayed here. I will also rank your tasks in terms of their priority so be sure to do them first!"
        },
        {
            element: ".extraInfoTab",
            intro: "When you finish a task, you earn points! And your total points can be found here alongside your productivity report!",
        },
        {
            element: ".addButtonBox",
            intro: "Feel free to use this button to add new tasks, or you can come talk to me personally for me to add them for you! hehe~",
        },
        {
            element: ".navBar",
            intro: "This is the navigation bar, where you can use to navigate to other pages!",
        },
        {
            element: ".AIBoxContainer",
            intro: "I will be here in case you need me, just click on me to talk! :)"
        },
        {
            element: ".AIBoxContainer",
            intro: "Let's head to the Chat Room first!"
        },
    ]

    /**
     * @function useEffect
     * @description Sets a time out which waits for a certain duration before automatically starting the intro if the user has not done the intro.
     */
    useEffect(() => {
        startIntro(userData, setActivateIntro, page)
    }, [userData])

    useEffect(() => {
        setHasFinishedIntroAtPage(page)
    }, [])

    /**
     * Filters the uncompleted task and sort them by the deadline.
     * @type {Array<Object>}
     */
    const uncompletedTasks = tasks.filter(task => !task.completed).sort(compareTasksDeadline) || []

    /**
     * The user"s productivity
     * @type {number}
     */
    const productivity = calculateTaskProductivity(tasks)

    /** 
     * Array of Overdued TaskModals.
     * @type {Array<Object>}
     */
    const overduedTasks = uncompletedTasks.filter(each => isTaskOverdue(each))

    /**
     * Array of tasks with reminders before or equals to current date and isn"t overdue.
     * @type {Array<Object>}
     */
    const remindersTasks = uncompletedTasks.filter(each => isTaskNeededToBeReminded(each) && !isTaskOverdue(each))

    /** 
     * Array of upcoming tasks.
     * @type {Array<Object>}
     */
    const upcomingTasks = uncompletedTasks.filter(each => isTaskUpcoming(each));

    /**
     * Array of tasks sorted from high to low priority.
     * @type {Array<Object>}
     */
    const priorityTasks = uncompletedTasks.sort(compareTasksPriority)

    /**
     * @function useEffect
     * @description Get User Info and User TaskModals if there is token
     */
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            getUserInfo()
            getUserTasks()
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
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };

        try {
            const res = await fetch("http://localhost:5001/Tasks", dataToPost)
            if (res.ok) {
                console.log("TaskModals successfully retrieved")
            } else {
                console.log("Invalid User/TaskModals")
            }

            const data = await res.json()
            if (data) {
                setTasks(data.tasks)
            }
        } catch (error) {
            console.error("Failed to Fetch TaskModals!", error.message)
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
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };

        try {
            const res = await fetch("http://localhost:5001/GetUserInfo", dataToPost)
            if (res.ok) {
                console.log("UserInfo successfully retrieved")
            } else {
                console.log("Invalid User/Info")
            }

            const data = await res.json()
            if (data) {
                setUserData(data)
            }
        } catch (error) {
            console.error("Failed to Fetch User Info!", error.message)
        }
    }

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
        isShown: false,
    })

    /**
     * The current state of ReminderRoomModal and setter function to update it.
     * @type {[Object, function]}
     */
    const [reminderRoomModalOpen, setReminderRoomModalOpen] = useState({
        isShown: false,
        data: {
            overduedTasks: overduedTasks,
            remindersTasks: remindersTasks,
            upcomingTasks: upcomingTasks,
            priorityTasks: priorityTasks,
        },
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

    /**
     * Closes the Birthday Modal.
     */
    const closeBirthdayModal = () => {
        setBirthdayModalOpen({
            isShown: false,
        })
        localStorage.setItem("birthdayShown", true)
    }

    /**
     * Closes the Chat Room Modal.
     */
    const closeReminderRoomModal = () => {
        setReminderRoomModalOpen({
            isShown: false,
            data: {
                overduedTasks: [],
                remindersTasks: [],
                upcomingTasks: [],
                priorityTasks: [],
            },
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
     * Open modal when it"s the user"s birthday.
     */
    const handleBirthday = () => {
        setBirthdayModalOpen({
            isShown: true,
        })
    }

    /**
     * Open modal for daily reminder.
     */
    const handleDailyReminder = () => {
        setReminderRoomModalOpen({
            isShown: true,
            data: {
                overduedTasks: overduedTasks,
                remindersTasks: remindersTasks,
                upcomingTasks: upcomingTasks,
                priorityTasks: priorityTasks,
            }
        })
    }

    /**
     * @function useEffect
     * @description Checks if birthdayShown exists in the local storage, sets it if not.
     */
    useEffect(() => {
        const birthdayShownStored = localStorage.getItem("birthdayShown")

        if (!birthdayShownStored) {
            localStorage.setItem("birthdayShown", false)
        }
    }, [])

    /**
     * @function useEffect
     * @description Checks whether today is user"s birthday and shows the birthday card if it is.
     */
    useEffect(() => {
        const birthday = userData.dateOfBirth
        if (!birthday) {
            return
        }

        const birthdayShown = JSON.parse(localStorage.getItem("birthdayShown"))
        if (isTodayBirthday(birthday) && !birthdayShown && activateBirthday) {
            setTimeout(() => {
                handleBirthday()
            }, 500)
        }
    }, [userData, activateBirthday])

    /**
     * @function useEffect
     * @description Resets birthdayShown state the next day after user"s birthday.
     */
    useEffect(() => {
        const birthday = userData.dateOfBirth
        //const birthday = "Thu Jul 03 2024 17:46:09 GMT+0800 (Malaysia Time)"
        if (isTodayNextDayOfBirthday(birthday)) {
            localStorage.setItem("birthdayShown", false)
        }
    }, [])

    /**
     * @function useEffect
     * @description Opens the Chat Room modal everyday for the daily reminder only when it"s active so it does not clash with the intro.
     */
    useEffect(() => {
        if (userData.hasDoneTutorial) {
            setTimeout(() => {
                handleDailyReminder()
            }, 1000)
        }
    }, [userData])

    return (
        <>
        <IntroElement steps={introSteps} activate={activateIntro} setActivate={setActivateIntro} hasDoneTutorial={userData.hasDoneTutorial} endIntro={false} page={page} />
        <NavBar />
        <div className="homepageContainer">
            {!token ? (
                <div className="extraInfoTab homepageChildDiv">
                    <div>
                        <h2>Please Log In or Sign Up to Add Tasks!</h2>
                    </div>
                </div>
                    ) : (
                    <div className="extraInfoTab">
                        <div className="addButtonBox">
                            <button className="addTaskBtn" onClick={handleAddTask}>Add Task</button>
                        </div>
                        <div className="userDisplayBox">
                            <div>Points: {userData?.points || 0}</div>
                            <div className="productivityBox">
                                <h3>Productivity Report</h3>
                                <ProductivityBar percentage={productivity}/>
                                <h3>{productivity}%</h3>
                                <p>{getProductivityBarComments(productivity)}</p>
                            </div>
                        </div>

                    </div>
            )}
            <div className="homepageTaskContainer homepageChildDiv">
                <div className="overdueAndRemindersBox">
                    <TasksBox id="overdueBox" key="Overdued" title="Overdued" className="overdueBox" tasks={tasks} tasksToShow={overduedTasks} onEdit={handleEditTask} onComplete={handleCompleteTask}  onDelete={handleDeleteTask}/>
                    <TasksBox id="reminderBox" key="Reminders" title="Reminders" tasks={tasks} tasksToShow={remindersTasks} onEdit={handleEditTask} onComplete={handleCompleteTask}  onDelete={handleDeleteTask} />
                </div>
                <div className="upcomingAndPriorityBox">
                    <TasksBox id="upcomingBox" key="Upcoming" title="Upcoming" tasks={tasks} tasksToShow={upcomingTasks} onEdit={handleEditTask} onComplete={handleCompleteTask}  onDelete={handleDeleteTask}/>
                    <TasksBox id="priorityBox" key="Priority" title="Priority" tasks={tasks} tasksToShow={priorityTasks} onEdit={handleEditTask} onComplete={handleCompleteTask}  onDelete={handleDeleteTask}/>
                </div>

            </div>
    
            <AIBox />
            
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
            
            <Modal
                isOpen = {reminderRoomModalOpen.isShown}
                onRequestClose={closeReminderRoomModal}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    }
                }}
                className="reminderRoomModal"
            >

                <ReminderRoom 
                    closeReminderRoomModal={closeReminderRoomModal} 
                    taskData={reminderRoomModalOpen.data}
                    setActivateBirthday={setActivateBirthday}
                />
            </Modal>
        </div>
        </>
    )
    
}
            
    


export default Home;