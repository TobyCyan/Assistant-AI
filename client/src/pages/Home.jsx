import React, {useEffect, useState} from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import '../index.css'
import TasksBox from "../components/TasksBox/TasksBox";
import Modal from 'react-modal';
import AddEditTasks from "../components/Tasks/AddEditTasks";
import {useTokenContext} from "../components/TokenContext/TokenContext";

function Home() {
    const {token, setToken} = useTokenContext()
    const testArray = new Array(9).fill().map((_, index) => ({
        id: index,
        title: "Task",
        message: `Task ${index}`
    }));

    const [allNotes, setAllTasks] = useState([])
    const [userInfo, setUserInfo] = useState(null)

    // Open Modal when user wants to add task, to load empty page
    const[isAddTaskModalOpen, setAddTaskModalOpen] = useState({
        isShown: false,
        type: "add",
        data: null,
    })

    // Open Modal when user wants to edit, to load current note data
    const handleEdit = () => {
        // To receive data
        setAddTaskModalOpen({
            isShown: true,
            type: "edit",
            data: null, //To add data
        })
    }

    useEffect(() => {
        getUserInfo()
        return () => {}
    }, []);

    // Get data of current user
    const getUserInfo = async () => {
        if(!token) {
            return;
        }

        const dataToGet = {
            method: 'GET',
            //body: JSON.stringify({username}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }
        try {
            const res = await fetch("https://localhost:5001/getUser", dataToGet)
            if(!res.ok) {
                console.log("Res is not okay")
            }
            const data = await res.json();
            console.log("User info:", data);
            return data;
        } catch (error) {
            console.log("Error!")
        }
    }

    // Get all tasks of current user
    const getAllTasks = async () => {

    }

    // Delete this task
    const deleteNote = async () => {

    }

    return (
        <>
            <NavBar/>
            <div className="homepageContainer">
                <div className="overdueAndRemindersBox">
                    <TasksBox key="Overdued" title="Overdued" tasksToShow={testArray}/>
                    <TasksBox key="Reminders" title="Reminders" tasksToShow={testArray}/>
                </div>
                <div className="upcomingAndPriorityBox">
                    <TasksBox key="Upcoming" title="Upcoming" tasksToShow={testArray}/>
                    <TasksBox key="Priority" title="Priority" tasksToShow={testArray}/>
                </div>
                <div className="assistantCharacterBox">
                    <div className="box">
                        <p>Assistant AI</p>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isAddTaskModalOpen.isShown}
                taskData = {isAddTaskModalOpen.data}
                onClose={() => {
                    setAddTaskModalOpen({
                        isShown: false,
                        type: "add",
                        data: null,
                    })
                }}
            >
                <AddEditTasks

                />
            </Modal>
        </>
    )
}

export default Home;