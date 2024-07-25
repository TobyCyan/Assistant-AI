import React,  { useEffect, ReactNode, useState, useRef } from "react";
import { useTokenContext } from "../TokenContext/TokenContext";
import { wait } from "../../utilities/ChatPageUtilities";
import ChatBotResponseElement from "../MessageElement/ChatBotResponseElement";
import { getTimeOfTheDay, getGreetingDialogue, getOverdueTasksDialogue, getPriorityTasksDialogue, getRemindersTasksDialogue, getUpcomingTasksDialogue } from "../../utilities/ReminderRoomUtilities";


/**
 * A React component that displays the reminder room where the AI Assistant can talk to the user.
 * @returns {ReactNode} A React element that renders the reminder room.
 */
const ReminderRoom = ({closeReminderRoomModal, taskData, setActivateBirthday, setHasReminded, timeOfTheDay, todayDate}) => {
    const [chatMessages, setChatMessages] = useState([])
    const lastMessage = useRef(null)

    /**
     * Adds on the new chat bot response into the chat room.
     * @param {string} response The chat bot response.
     */
    const addNewChatBotResponse = async (response) => {
        setChatMessages(prevMessages => [...prevMessages, <ChatBotResponseElement response={response} />])
    }

    /**
     * @type {Array} The flow of the dialogue.
     */
    const reminderDialogueFlow = [
        getGreetingDialogue(timeOfTheDay),
        "Your Tasks for today are as follows...",
        getOverdueTasksDialogue(taskData.overduedTasks),
        getRemindersTasksDialogue(taskData.remindersTasks),
        getUpcomingTasksDialogue(taskData.upcomingTasks),
        getPriorityTasksDialogue(taskData.priorityTasks),
        "Bye and have fun!"
    ]

    /**
     * Ends the reminder by clearing the message interval, activating the birthday modal, and set hasReminded as true.
     * @param {*} messageTimer The message timer.
     */
    const endReminder = (messageTimer) => {
        clearInterval(messageTimer)
        setActivateBirthday(true)
    }

    /**
     * @function useEffect
     * @description Sets the interval between and automatically showing each dialogue in the reminderDialogueFlow array.
     */
    useEffect(() => {
        const messageInterval = 1600
        let index = 0
        let messageTimer = setInterval(nextMessage, messageInterval)

        function nextMessage() {
            // If the user waits until the reminder completes, the reminder ends and reminded status is set to true.
            if (index == reminderDialogueFlow.length) {
                localStorage.setItem(timeOfTheDay, JSON.stringify({reminded: true, date: todayDate}))
                closeReminderRoomModal()
                setHasReminded(true)
                endReminder(messageTimer)
                return
            }
            const newMessage = reminderDialogueFlow[index]
            addNewChatBotResponse(newMessage)
            index += 1
        }
        
        // If user closes the modal, the reminder ends but reminded status is not updated to true.
        return () => {
            endReminder(messageTimer)
        }
    }, [])

    /**
     * @function useEffect
     * @description Scrolls the last message into view whenever there is a change in chatMessages.
     */
    useEffect(() => {
        lastMessage.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages])

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