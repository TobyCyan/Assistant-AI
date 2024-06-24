import React, {useEffect, useState} from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import '../index.css'
import {useTokenContext} from "../components/TokenContext/TokenContext";
import DetailedTaskCard from "../components/Tasks/DetailedTaskCard";
import Modal from "react-modal";
import AddEditTasks from "../components/Tasks/AddEditTasks";
import CompleteDeleteTasks from "../components/Tasks/CompleteDeleteTasks";

function MyTasks() {
    const {tokenStatus, userInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = useState([])
    const [displayTasks, setDisplayTasks] = useState(tasks)
    const [filter, setFilter] = useState('All')

    // Initial state of AddEditModal
    const[addEditModalOpen, setAddEditModalOpen] = useState({
        isShown: false,
        type: "add",
        data: null,
    })

    // Initial state of CompleteDeleteModal
    const[compDelModalOpen, setCompDelModalOpen] = useState({
        isShown: false,
        type: "del",
        data: null,
    })

    // Get User Info and User Tasks if there is token
    useEffect(() => {
        if (token) {
            console.log("Token Set")
            localStorage.setItem('token', token);
            getUserInfo();
            getUserTasks();
        }
    }, [token]);

    useEffect(() => {
        const uncompleted = tasks.filter(each => !each.completed)
        setDisplayTasks(uncompleted)
    }, [tasks]);

    useEffect(() => {
        filterTasks(filter)
    }, [filter]);

    // Closes the  Modal
    const closeAddEditModal = () => {
        setAddEditModalOpen({
            isShown: false,
            type: "add",
            data: null,
        })
    }

    const closeCompDelModal = () => {
        setCompDelModalOpen({
            isShown: false,
            type: "del",
            data: null,
        })
    }

    // Open Modal when user wants to add task, to load empty page
    const handleAddTask = () => {
        setAddEditModalOpen({
            isShown: true,
            type: "add",
            data: null, //To add data
        })
    }

    // Open Modal when user wants to edit, to load current note data
    const handleEditTask = (taskData) => {
        // To receive data
        setAddEditModalOpen({
            isShown: true,
            type: "edit",
            data: taskData, //To add data
        })
    }

    const filterTasks = (value) => {
        if(value === 'All') {
            setDisplayTasks(tasks)
        } else if (value === 'Completed') {
            const filtered = tasks.filter(each => each.completed)
            setDisplayTasks(filtered)
        } else if (value === 'Low') {
            const filtered = tasks.filter(each => each.priority === 'Low')
            setDisplayTasks(filtered)
        } else if (value === 'Medium') {
            const filtered = tasks.filter(each => each.priority === 'Medium')
            setDisplayTasks(filtered)
        } else if (value === 'High') {
            const filtered = tasks.filter(each => each.priority === 'High')
            setDisplayTasks(filtered)
        } else {
            const filtered = tasks.filter(each => each.category === filter)
            setDisplayTasks(filtered)
        }
    }

    const handleFilterTasks = (value) => {
        setFilter(value)
        console.log(value)
    }

    const handleDeleteTask = (taskData) => {
        setCompDelModalOpen({
            isShown: true,
            type: "del",
            data: taskData,
        })
    }

    const handleCompleteTask = (taskData) => {
        setCompDelModalOpen({
            isShown: true,
            type: "comp",
            data: taskData,
        })
    }

    // Get User Tasks
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
                console.log(data.tasks[0])
                setTasks(data.tasks)
                setDisplayTasks(tasks)
            }
        } catch (error) {
            console.error('Failed to Fetch Tasks!', error)
        }
    }

    // Get User Info
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

    const categories = [...new Set(tasks.map(task => task.category))].map((eachCat, index) => (
        <li key={index} onClick={() => handleFilterTasks(eachCat)}>
            {eachCat}
        </li>
    ))

    /*
    const tasksToTaskCard = tasks.map((task, index) => {
        <DetailedTaskCard
            key={index}
            taskData={task}
            onEdit={()=>handleEditTask(task)}
            onComplete={()=>handleCompleteTask(task)}
            onDelete={()=>handleDeleteTask(task)}
        />
    })
    */

    const tasksInGrid = (
        <div className="tasksGridBox">
            {displayTasks.map((task, index) => (
                <DetailedTaskCard
                    key={index}
                    taskData={task}
                    onEdit={()=>handleEditTask(task)}
                    onComplete={()=>handleCompleteTask(task)}
                    onDelete={()=>handleDeleteTask(task)}
                />
            ))}
        </div>
    );

    return (
        <>
            <NavBar/>
            <div className="tasksPageContainer">
                <div className="tasksSidebar">
                    <button onClick={handleAddTask}>Add Task</button>
                    <ul id="category-list">
                        <li onClick={() => handleFilterTasks('All')}>All</li>
                        <li onClick={() => handleFilterTasks('Completed')}>Completed</li>
                        {categories}
                        <li onClick={() => handleFilterTasks('High')}>High</li>
                        <li onClick={() => handleFilterTasks('Medium')}>Medium</li>
                        <li onClick={() => handleFilterTasks('Low')}>Low</li>
                    </ul>
                </div>
                <div className="tasksContainer">
                {tasksInGrid}
                </div>
            </div>
            <Modal
                isOpen={addEditModalOpen.isShown}
                onRequestClose={() => {
                    closeCompDelModal()
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
                    onClose={() => closeCompDelModal()}
                    getAllTasks={getUserTasks}
                    getUserInfo={getUserInfo}
                />
            </Modal>
        </>
    )
}

export default MyTasks;