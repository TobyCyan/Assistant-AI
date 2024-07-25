import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ReminderRoom from "../ReminderRoom/ReminderRoom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { getTimeOfTheDay } from "../../utilities/ReminderRoomUtilities";


const ReminderBell = ({overduedTasks, remindersTasks, upcomingTasks, priorityTasks, setActivateBirthday}) => {
    const timeOfTheDay = getTimeOfTheDay()

    /**
     * @type {number} Today"s date in terms of the day of the month.
     */
    const todayDate = (new Date()).getDate()

    const [hasReminded, setHasReminded] = useState(false)

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

    useEffect(() => {
        console.log('reminded? ', hasReminded)
    }, [hasReminded])

    /**
     * @function useEffect
     * @description Resets the reminder array in the localStorage if it does not exist, or user has been reminded and today is a different day than the recorded one.
     */
    useEffect(() => {
        let reminder = localStorage.getItem(timeOfTheDay)
        reminder = JSON.parse(reminder)

        if (!reminder || reminder["reminded"] && reminder["date"] != todayDate) {
            localStorage.setItem(timeOfTheDay, JSON.stringify({reminded: false, date: todayDate}))
        }

        /**
         * A boolean that indicates whether the user has been reminded during this time of the day.
         * @type {boolean} true or false.
         */
        const hasReminded = JSON.parse(localStorage.getItem(timeOfTheDay))["reminded"]
        console.log('reminded? ', hasReminded)
        setHasReminded(hasReminded)
    }, [])

    return (
        <>
            <div className="reminderBellContainer">
                {hasReminded ? (
                    <>
                        <div className="notification">
                            <FontAwesomeIcon id="reminded" icon={faBell} />
                        </div>
                        <div className="checkMark"></div>
                    </>
                ) : (
                    <>
                        <div className="notification">
                            <FontAwesomeIcon id="notReminded" icon={faBell} onClick={handleDailyReminder}/>
                        </div>
                        <div className="notificationMark">
                            <p>1</p>
                        </div>
                    </>
                )}
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
                    setActivateBirthday={setActivateBirthday}
                    setHasReminded={setHasReminded}
                    timeOfTheDay={timeOfTheDay}
                    todayDate={todayDate}
                />
            </Modal>
        </>
    )
}

export default ReminderBell