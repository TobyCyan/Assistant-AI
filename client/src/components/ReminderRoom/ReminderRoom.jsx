import React,  { useEffect, ReactNode, useState, useRef } from "react";
import { useTokenContext } from "../TokenContext/TokenContext";
import { wait } from "../../utilities/ChatPageUtilities";
import ChatBotResponseElement from "../MessageElement/ChatBotResponseElement";
import { getTimeOfTheDay, getGreetingDialogue, getOverdueTasksDialogue, getPriorityTasksDialogue, getRemindersTasksDialogue, getUpcomingTasksDialogue } from "../../utilities/ChatRoomUtilities";


/**
 * A React component that displays the reminder room where the AI Assistant can talk to the user.
 * @returns {ReactNode} A React element that renders the reminder room.
 */
const ReminderRoom = ({closeReminderRoomModal, taskData, setActivateBirthday}) => {
    const {userInfo, tokenStatus} = useTokenContext()

    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const [chatMessages, setChatMessages] = useState([])
    const lastMessage = useRef(null)
    
    /**
     * @function useEffect
     * @description Debug statement to show the list of upcoming tasks.
     */
    // useEffect(() => {
    //     console.log("data: " + JSON.stringify(taskData.overduedTasks)+ "\n")
    // }, [taskData])
    
    /**
     * @function useEffect
     * @description Scrolls the last message into view whenever there is a change in chatMessages.
     */
    useEffect(() => {
        lastMessage.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages])

    /**
     * Adds on the new chat bot response into the chat room.
     * @param {string} response The chat bot response.
     */
    const addNewChatBotResponse = async (response) => {
        await wait(800)
        setChatMessages(prevMessages => [...prevMessages, <ChatBotResponseElement response={response} />])
    }

    /**
     * @type {string} The time of the day.
     */
    const timeOfTheDay = getTimeOfTheDay()

    /**
     * @type {Date} Today"s date.
     */
    const today = new Date()

    /**
     * @type {number} Today"s date in terms of the day of the month.
     */
    const todayDate = today.getDate()

    /**
     * @type {Array} The flow of the dialogue.
     */
    const reminderDialogueFlow = [
        getGreetingDialogue(timeOfTheDay),
        "Your Tasks for today are as follows...",
        getOverdueTasksDialogue(taskData.overduedTasks),
        // getRemindersTasksDialogue(taskData.remindersTasks),
        // getUpcomingTasksDialogue(taskData.upcomingTasks),
        // getPriorityTasksDialogue(taskData.priorityTasks),
        "Bye and have fun!"
    ]

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
    }, [])

    /**
     * @function useEffect
     * @description Clears the Chat Room and sets the interval between showing each dialogue in the reminderDialogueFlow array.
     */
    useEffect(() => {
        /**
         * A boolean that indicates whether the user has been reminded during this time of the day.
         * @type {boolean} true or false.
         */
        const hasReminded = JSON.parse(localStorage.getItem(timeOfTheDay))["reminded"]

        if (!hasReminded) {
            const messageInterval = 1600
            let index = 0
            let messageTimer = setInterval(nextMessage, messageInterval)
    
            function nextMessage() {
                if (index == reminderDialogueFlow.length) {
                    localStorage.setItem(timeOfTheDay, JSON.stringify({reminded: true, date: todayDate}))
                    clearInterval(messageTimer)
                    closeReminderRoomModal()
                    setActivateBirthday(true)
                    return
                }
                const newMessage = reminderDialogueFlow[index]
                addNewChatBotResponse(newMessage)
                index += 1
            }
            
            return () => {
                clearInterval(messageTimer)
                setActivateBirthday(true)
            }
        } else {
            closeReminderRoomModal()
        }

    }, [])


    return (
        <>   
            <div className="reminderroomContainer oneWayChatRoom">
                <div className="chatroom" id="chatroom" ref={lastMessage}>
                    {...chatMessages}
                </div> 
            </div>
        </>
    )
}

export default ReminderRoom