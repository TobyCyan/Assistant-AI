import React, { useEffect, useState, ReactNode } from "react"
import NavBar from "../components/NavBar/NavBar.jsx";
import "../index.css"
import { useTokenContext } from "../components/TokenContext/TokenContext";
import AddRecurringTasks from "../components/TaskModals/AddRecurringTasks";
import DeleteRecurringTask from "../components/TaskModals/DeleteRecurringTask"
import RecurringTasksTable from "../components/RecurringTasks/RecurringTasksTable";
import { compareTasksDeadline, startIntro, setHasFinishedIntroAtPage } from "../utilities/utilities.js";
import Modal from "react-modal";
import IntroElement from "../components/IntroElements/IntroElement.jsx";

/**
 * A Functional React component that displays all user tasks based on their categories, level of priority and completion status, and allows user to perform task operations such as add, edit, complete, uncomplete and delete.
 * @component
 * @returns {ReactNode} A React element that renders lists of tasks based on category, priority level and state of completion.
 */
const Scheduler = () => {
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
    const [recTasks, setRecTasks] = useState([])

    /**
     * The tasks to display and setter function to update it.
     * @type {[Array<Object>, function]}
     */
    const [displayRecTasks, setDisplayRecTasks] = useState(recTasks)

    /**
     * The filter and setter function to update it.
     * @type {[String, function]}
     */
    const [filter, setFilter] = useState("All")

    /**
     * The current state of AddEditModal and setter function to update it.
     * @type {[Object, function]}
     */
    const[addEditRecModalOpen, setAddEditRecModalOpen] = useState({
        isShown: false,
        type: "add",
        data: null,
    })

    /**
     * The current state of CompleteDeleteModal and setter function to update it.
     * @type {[Object, function]}
     */
    const[delRecModalOpen, setDelRecModalOpen] = useState({
        isShown: false,
        data: null,
    })

    /**
     * The initial state of activating the intro and setter function to update it.
     * @type {[boolean, function]}
     */
    const [activateIntro, setActivateIntro] = useState(false)

    /**
     * The name of the current page.
     * @type {string}
     */
    const page = "Scheduler"

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
            intro: "Welcome to the Recurring Tasks Page!"
        },
        {
            element: ".tasksSidebar",
            intro: "This is your side bar! It works the same way as the My Tasks page where you can see your recurring tasks by their categories!"
        },
        {
            element: ".addTaskBtn",
            intro: "This button here is for you to add a new recurring task!"
        },
        {
            element: ".detailedTasksContainer",
            intro: "This is where you can see all of your recurring tasks in detail!"
        },
        {
            element: ".navBarShop",
            intro: "Off we go to the Shop!"
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
     * @function useEffect
     * @description Get User Info and User TaskModals if there is token.
     */
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            getUserInfo()
            getUserRecTasks()
        }
    }, [token])

    /**
     * @function useEffect
     * @description Sort the tasks by deadline, set the tasks to display and filter the tasks if there is any changes to the user tasks.
     */
    useEffect(() => {
        recTasks.sort(compareTasksDeadline)
        setDisplayRecTasks(recTasks)
        filterTasks(filter)
    }, [recTasks])

    /**
     * @function useEffect
     * @description Re-filter the tasks if there is any changes to the filter.
     */
    useEffect(() => {
        filterTasks(filter)
    }, [filter])

    /**
     * Function that closes the add or edit modal.
     */
    const closeAddEditRecModal = () => {
        setAddEditRecModalOpen({
            isShown: false,
            type: "add",
            data: null,
        })
    }

    /**
     * Function that closes the complete or delete modal.
     */
    const closeDelRecModal = () => {
        setDelRecModalOpen({
            isShown: false,
            data: null,
        })
    }

    /**
     * Open Modal when user wants to add task, to load empty page.
     */
    const handleAddTask = () => {
        setAddEditRecModalOpen({
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
        setAddEditRecModalOpen({
            isShown: true,
            type: "edit",
            data: taskData, //To add data
        })
    }

    /**
     * Function that filters the list of tasks based on All, completion status, priority level, and category, then sets the tasks to display.
     * @param {string} value Value to filter the tasks by.
     */
    const filterTasks = (value) => {
        if(value === "All") {
            setDisplayRecTasks(recTasks)
        } else if (value === "Completed") {
            setDisplayRecTasks(recTasks.filter(each => each.completed))
        } else if (value === "Low") {
            setDisplayRecTasks(recTasks.filter(each => each.priority === "Low"))
        } else if (value === "Medium") {
            setDisplayRecTasks(recTasks.filter(each => each.priority === "Medium"))
        } else if (value === "High") {
            setDisplayRecTasks(recTasks.filter(each => each.priority === "High"))
        } else {
            setDisplayRecTasks(recTasks.filter(each => each.category === filter))
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
        setDelRecModalOpen({
            isShown: true,
            data: taskData,
        })
    }

    /**
     * Async GET method to get user tasks.
     * @async
     * @returns {Promise<void>} A promise that gets the current user's tasks.
     * @throws {Error} Throws an error if getting user tasks fails.
     */
    const getUserRecTasks = async () => {
        const dataToPost = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        try {
            const res = await fetch(`${expressApiUrl}RecurringTasks`, dataToPost)
            if (res.ok) {
                // console.log("Recurring Tasks successfully retrieved")
            } else {
                // console.log("Invalid User/Recurring Tasks")
            }

            const data = await res.json()
            if (data) {
                setRecTasks(data.recurringTasks)
                setDisplayRecTasks(recTasks)
            }
        } catch (error) {
            console.error("Failed to Fetch Recurring Tasks!", error)
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
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

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
            console.error("Failed to Fetch User Info!", error)
        }
    }

    /**
     * A React component that displays a list of buttons of every unique categories of all the uncompleted tasks and the number of uncompleted tasks in each category.
     * @component
     */
    const categories = [...new Set(recTasks.map(task => task.category))].map((eachCat, index) => (
        <li key={index} onClick={() => handleFilterTasks(eachCat)}>
            {eachCat} ({recTasks.filter(each => each.category === eachCat).length})
        </li>
    ))

    return (
        <>
            <NavBar/>
            <IntroElement steps={introSteps} activate={activateIntro} setActivate={setActivateIntro} hasDoneTutorial={userData.hasDoneTutorial} endIntro={false} page={page} />
            <div className="tasksPageContainer">
                <div className="tasksSidebar">
                    <button className="addTaskBtn" onClick={handleAddTask}>Add Recurring Task</button>
                    <div className="categoriesSidebar">Categories</div>
                    <ul id="category-list">
                        <li onClick={() => handleFilterTasks("All")}>All ({recTasks.length})</li>
                        {categories}
                    </ul>
                </div>
                <div className="detailedTasksContainer">
                    <RecurringTasksTable recurringTasks={displayRecTasks} onEdit={handleEditTask} onDelete={handleDeleteTask}/>
                </div>
            </div>
            <Modal
                isOpen={addEditRecModalOpen.isShown}
                onRequestClose={() => {
                    closeDelRecModal()
                }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    },
                }}
                contentLabel=""
                className="AddEditTaskModal"
            >
                <AddRecurringTasks
                    type={addEditRecModalOpen.type}
                    recurringTask={addEditRecModalOpen.data}
                    onClose={closeAddEditRecModal}
                    getAllTasks={getUserRecTasks}
                />
            </Modal>
            <Modal
                isOpen={delRecModalOpen.isShown}
                onRequestClose={() => {
                    closeDelRecModal()
                }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    },
                }}
                contentLabel=""
                className="DelTaskModal"
            >
                <DeleteRecurringTask
                    recurringTask={delRecModalOpen.data}
                    onClose={closeDelRecModal}
                    getAllTasks={getUserRecTasks}
                />
            </Modal>
        </>
    )
}

export default Scheduler