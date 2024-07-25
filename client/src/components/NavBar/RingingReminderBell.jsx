import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ReminderRoom from "../ReminderRoom/ReminderRoom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { compareTasksPriority, isTaskOverdue, isTaskUpcoming, isTaskNeededToBeReminded } from "../../utilities/utilities";
import { useTokenContext } from "../TokenContext/TokenContext";


const RingingReminderBell = ({setHasReminded, timeOfTheDay, todayDate}) => {
    const {tokenStatus, } = useTokenContext()
    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, ] = tokenStatus

    /**
     * The current user tasks and setter function to update it.
     * @type {[Array<Object>, function]}
     */
    const [tasks, setTasks] = useState([])

    /**
     * The Express API URL for this React app.
     * @type {string}
     */
    const expressApiUrl = import.meta.env.VITE_EXPRESS_API_URL

    /**
     * Filters the uncompleted task and sort them by the deadline.
     * @type {Array<Object>}
     */
    const uncompletedTasks = tasks.filter(task => !task.completed)

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
            getUserTasks()
        }
    }, [token]);

    /**
     * The current state of ReminderRoomModal and setter function to update it.
     * @type {[Object, function]}
     */
    const [reminderRoomModalOpen, setReminderRoomModalOpen] = useState({
        isShown: false,
        data: {
            overduedTasks: [],
            remindersTasks: [],
            upcomingTasks: [],
            priorityTasks: [],
        },
    })

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
            },
        })
    }

    /**
     * Closes the Chat Room Modal.
     */
    const closeReminderRoomModal = () => {
        setReminderRoomModalOpen({
            isShown: false,
            data: {
                overduedTasks: overduedTasks,
                remindersTasks: remindersTasks,
                upcomingTasks: upcomingTasks,
                priorityTasks: priorityTasks,
            },
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
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };

        try {
            const res = await fetch(`${expressApiUrl}Tasks`, dataToPost)
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

    return (
        <>
            <div className="notification">
                <FontAwesomeIcon id="notReminded" icon={faBell} onClick={handleDailyReminder}/>
            </div>
            <div className="notificationMark">
                <p>1</p>
            </div>

            <Modal
                isOpen={reminderRoomModalOpen.isShown}
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
                    setHasReminded={setHasReminded}
                    timeOfTheDay={timeOfTheDay}
                    todayDate={todayDate}
                />
            </Modal>
        </>
    )
}

export default RingingReminderBell