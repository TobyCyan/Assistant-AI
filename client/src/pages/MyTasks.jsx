import React, { useEffect, useState, ReactNode } from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import '../index.css'
import { useTokenContext } from "../components/TokenContext/TokenContext";
import DetailedTaskCard from "../components/TasksCardsAndBox/DetailedTaskCard.jsx";
import AddEditTasks from "../components/TaskModals/AddEditTasks";
import CompleteDeleteTasks from "../components/TaskModals/CompleteDeleteTasks";
import {
    compareTasksDeadline,
    startIntro,
    setHasFinishedIntroAtPage,
    compareTasksPriority
} from "../utilities/utilities.js";
import Modal from 'react-modal';
import IntroElement from '../components/IntroElements/IntroElement.jsx';

/**
 * A Functional React component that displays all user tasks based on their categories, level of priority and completion status, and allows user to perform task operations such as add, edit, complete, uncomplete and delete.
 * @component
 * @returns {ReactNode} A React element that renders lists of tasks based on category, priority level and state of completion.
 */
function MyTasks() {
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
     * The initial user data and setter function to update it.
     * @type {[Array<Object>, function]}
     */
    const [tasks, setTasks] = useState([])

    /**
     * The initial state of activating the intro and setter function to update it.
     * @type {[boolean, function]}
     */
    const [activateIntro, setActivateIntro] = useState(false)

    /**
     * The name of the current page.
     * @type {string}
     */
    const page = "MyTasks"

    /**
     * The Express API URL for this React app.
     * @type {string}
     */
    const expressApiUrl = import.meta.env.VITE_EXPRESS_API_URL

    /**
     * The steps for the webpage intro.
     * @returns {Array<Object>} An array of objects that specify the element to highlight or the intro value.
     */
    const introSteps = () => [
        {
            intro: "Welcome to the Tasks Page!"
        },
        {
            element: ".tasksSidebar",
            intro: "This is your side bar! I have categorised everything into their own categories, and even by priority!"
        },
        {
            element: ".addTaskBtn",
            intro: "Another button here to add new tasks! How convenient! hehe~"
        },
        {
            element: ".detailedTasksContainer",
            intro: "This is where you can see all of your tasks in detail!"
        },
        {
            element: ".detailedTasksContainer",
            intro: "Once you have added your tasks, you should be able to see buttons to edit, complete, and delete them!"
        },
        {
            intro: "That's all I have for you on this page!"
        },
        {
            element: ".navBarRecurringTasks",
            intro: "Let's explore the Recurring Tasks page next!"
        }
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
     * The tasks to display and setter function to update it.
     * @type {[Array<Object>, function]}
     */
    const [displayTasks, setDisplayTasks] = useState(tasks.sort(compareTasksPriority).sort(compareTasksDeadline))

    /**
     * The filter and setter function to update it.
     * @type {[String, function]}
     */
    const [filter, setFilter] = useState('All')

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
     * @description Get User Info and User TaskModals if there is token.
     */
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            getUserInfo();
            getUserTasks();
        }
    }, [token]);

    /**
     * @function useEffect
     * @description Sort the tasks by deadline, set the tasks to display and filter the tasks if there is any changes to the user tasks.
     */
    useEffect(() => {
        tasks.sort(compareTasksPriority).sort(compareTasksDeadline)
        setDisplayTasks(tasks)
        filterTasks(filter)
    }, [tasks]);

    /**
     * @function useEffect
     * @description Re-filter the tasks if there is any changes to the filter.
     */
    useEffect(() => {
        filterTasks(filter)
    }, [filter]);

    /**
     * Function that closes the add or edit modal.
     */
    const closeAddEditModal = () => {
        setAddEditModalOpen({
            isShown: false,
            type: "add",
            data: null,
        })
    }

    /**
     * Function that closes the complete or delete modal.
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
     */
    const handleEditTask = (taskData) => {
        // To receive data
        setAddEditModalOpen({
            isShown: true,
            type: "edit",
            data: taskData, //To add data
        })
    }

    const uncompletedTasks = tasks.filter(each => !each.completed)

    /**
     * Function that filters the list of tasks based on All, completion status, priority level, and category, then sets the tasks to display.
     * @param {string} value Value to filter the tasks by.
     */
    const filterTasks = (value) => {
        if(value === 'All') {
            setDisplayTasks(uncompletedTasks)
        } else if (value === 'Completed') {
            setDisplayTasks(tasks.filter(each => each.completed))
        } else if (value === 'Low') {
            setDisplayTasks(uncompletedTasks.filter(each => each.priority === 'Low'))
        } else if (value === 'Medium') {
            setDisplayTasks(uncompletedTasks.filter(each => each.priority === 'Medium'))
        } else if (value === 'High') {
            setDisplayTasks(uncompletedTasks.filter(each => each.priority === 'High'))
        } else {
            setDisplayTasks(uncompletedTasks.filter(each => each.category === filter))
        }
    }

    /**
     * Set the filter value to filter the tasks.
     * @param {string} value Value to filter the tasks by.
     */
    const handleFilterTasks = (value) => {
        setFilter(value)
    }

    /**
     * Opens the modal to delete the selected task.
     * @param {Object} taskData Data of the selected task to delete.
     */
    const handleDeleteTask = (taskData) => {
        setCompDelModalOpen({
            isShown: true,
            type: "del",
            data: taskData,
        })
    }

    /**
     * Opens the modal to complete the selected task.
     * @param {Object} taskData Data of the selected task to complete.
     */
    const handleCompleteTask = (taskData) => {
        setCompDelModalOpen({
            isShown: true,
            type: "comp",
            data: taskData,
        })
    }


    /**
     * Opens the modal to uncomplete the selected task.
     * @param {Object} taskData Data of the selected task to uncomplete.
     */
    const handleUncompleteTask = (taskData) => {
        setCompDelModalOpen({
            isShown: true,
            type: "uncomp",
            data: taskData,
        })
    }

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
            const res = await fetch(`${expressApiUrl}Tasks`, dataToPost)
            if (res.ok) {
                // console.log("TaskModals successfully retrieved")
            } else {
                // console.log("Invalid User/TaskModals")
            }

            const data = await res.json()
            if (data) {

                setTasks(data.tasks)
                setDisplayTasks(tasks)
            }
        } catch (error) {
            console.error('Failed to Fetch TaskModals!', error)
        }
    }

    /**
     * Async GET method to get user info.
     * @async
     * @returns {Promise<void>} A promise that gets the current user's info.
     * @throws {Error} Throws an error if getting user info fails.
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
            const res = await fetch(`${expressApiUrl}GetUserInfo`, dataToPost)
            if(res.ok) {
                // console.log("UserInfo successfully retrieved")
            } else {
                // console.log("Invalid User/Info")
            }

            const data = await res.json()
            if(data) {
                setUserData(data)
            }
        } catch (error) {
            console.error('Failed to Fetch User Info!', error)
        }
    }

    /**
     * A React component that displays a list of buttons of every unique categories of all the uncompleted tasks and the number of uncompleted tasks in each category.
     * @component
     */
    const categories = [...new Set(uncompletedTasks.map(task => task.category))].map((eachCat, index) => (
        <li key={index} onClick={() => handleFilterTasks(eachCat)}>
            {eachCat} ({uncompletedTasks.filter(each => each.category === eachCat).length})
        </li>
    ))

    /**
     * A React component that displays every tasks in their own detailed cards with the edit, complete, uncomplete, and delete buttons.
     * @component
     */
    const tasksInGrid = (
        <div className="tasksGridBox">
            {displayTasks.map((task, index) => (
                <DetailedTaskCard
                    key={index}
                    taskData={task}
                    onEdit={()=>handleEditTask(task)}
                    onComplete={()=>handleCompleteTask(task)}
                    onUncomplete={() => handleUncompleteTask(task)}
                    onDelete={()=>handleDeleteTask(task)}
                />
            ))}
        </div>
    );

    return (
        <>
            <NavBar/>
            <IntroElement steps={introSteps} activate={activateIntro} setActivate={setActivateIntro} hasDoneTutorial={userData.hasDoneTutorial} endIntro={false} page={page} />
            <div className="tasksPageContainer">
                <div className="tasksSidebar">
                    <button className="addTaskBtn" onClick={handleAddTask}>Add Task</button>
                    <div className="categoriesSidebar">Categories</div>
                    <ul id="category-list">
                        <li onClick={() => handleFilterTasks('All')}>All ({uncompletedTasks.length})</li>
                        <li onClick={() => handleFilterTasks('High')}>High
                            ({uncompletedTasks.filter(each => each.priority === 'High').length})
                        </li>
                        <li onClick={() => handleFilterTasks('Medium')}>Medium
                            ({uncompletedTasks.filter(each => each.priority === 'Medium').length})
                        </li>
                        <li onClick={() => handleFilterTasks('Low')}>Low
                            ({uncompletedTasks.filter(each => each.priority === 'Low').length})
                        </li>
                        {categories}
                        <li
                            onClick={() => handleFilterTasks('Completed')}
                            style={{ color: 'green' }}
                        >Completed
                            ({tasks.filter(each => each.completed).length})
                        </li>

                    </ul>
                </div>
                <div className="detailedTasksContainer">
                    {tasksInGrid}
                </div>
            </div>
            <Modal
                isOpen={addEditModalOpen.isShown}
                onRequestClose={() => {
                    closeAddEditModal()
                }}
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
                onRequestClose={() => {
                    closeCompDelModal()
                }}
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

export default MyTasks;