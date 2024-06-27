import React, {useEffect, useState} from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";

import '../index.css'
import {useTokenContext} from "../components/TokenContext/TokenContext";
import DetailedTaskCard from "../components/Tasks/DetailedTaskCard";
import AddEditTasks from "../components/Tasks/AddEditTasks";
import CompleteDeleteTasks from "../components/Tasks/CompleteDeleteTasks";
import {compareTasksDeadline} from "../utilities/utilities.js";
import Modal from 'react-modal';
import { parseToken } from './Login.jsx';

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
            setToken(token)
            const tokenData = parseToken(token)
            setUserData({username: tokenData[0], userId: tokenData[1]})
        }
    }, [])

    useEffect(() => {
        if (token) {
            console.log("Token Set")
            localStorage.setItem('token', token);
            getUserInfo();
            getUserTasks();
        }
    }, [token]);

    useEffect(() => {
        tasks.sort(compareTasksDeadline)
        setDisplayTasks(tasks)
        filterTasks(filter)
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

    const uncompletedTasks = tasks.filter(each => !each.completed)

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


    // Open Modal when user wants to uncomplete task
    const handleUncompleteTask = (taskData) => {
        setCompDelModalOpen({
            isShown: true,
            type: "uncomp",
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

    const categories = [...new Set(uncompletedTasks.map(task => task.category))].map((eachCat, index) => (
        <li key={index} onClick={() => handleFilterTasks(eachCat)}>
            {eachCat} ({uncompletedTasks.filter(each => each.category === eachCat).length})
        </li>
    ))

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
            <div className="tasksPageContainer">
                <div className="tasksSidebar">
                    <button className="addTaskBtn" onClick={handleAddTask}>Add Task</button>
                    <div className="categoriesSidebar">Categories</div>
                    <ul id="category-list">
                        <li onClick={() => handleFilterTasks('All')}>All ({uncompletedTasks.length})</li>
                        <li onClick={() => handleFilterTasks('Completed')}>Completed ({tasks.filter(each => each.completed).length})</li>
                        {categories}
                        <li onClick={() => handleFilterTasks('High')}>High ({uncompletedTasks.filter(each => each.priority === 'High').length})</li>
                        <li onClick={() => handleFilterTasks('Medium')}>Medium ({uncompletedTasks.filter(each => each.priority === 'Medium').length})</li>
                        <li onClick={() => handleFilterTasks('Low')}>Low ({uncompletedTasks.filter(each => each.priority === 'Low').length})</li>
                    </ul>
                </div>
                <div className="detailedTasksContainer">
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