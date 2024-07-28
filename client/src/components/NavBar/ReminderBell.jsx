import React, { useState, useEffect, ReactNode } from "react";
import RingingReminderBell from "./RingingReminderBell";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { getTimeOfTheDay } from "../../utilities/ReminderRoomUtilities";

/**
 * A React component that displays the reminder bell that reminds the user of their tasks.
 * @component
 * @returns {ReactNode} A React element that renders the reminder bell.
 */
const ReminderBell = () => {
    const timeOfTheDay = getTimeOfTheDay()

    /**
     * @type {number} Today"s date in terms of the day of the month.
     */
    const todayDate = (new Date()).getDate()

    /**
     * The current state if user is reminded and function to update it
     * @type {[boolean, function]}
     */
    const [hasReminded, setHasReminded] = useState(false)

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
        setHasReminded(hasReminded)
    }, [])

    return (
        <>
            <div className="reminderBellContainer">
                {hasReminded ? (
                    <>
                        <div className="notification">
                            <FontAwesomeIcon id="reminded" icon={faBell} />
                            <div className="checkMark"></div>
                        </div>
                    </>
                ) : (      
                    <>  
                        <RingingReminderBell setHasReminded={setHasReminded} timeOfTheDay={timeOfTheDay} todayDate={todayDate} />
                    </>   
                )}
            </div>
        </>
    )
}

export default ReminderBell