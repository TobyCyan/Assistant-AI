import React,  { useEffect, ReactNode, useState, useRef } from "react";
import ChatBotResponseElement from "../MessageElement/ChatBotResponseElement";
import { getGreetingDialogue, getOverdueTasksDialogue, getPriorityTasksDialogue, getUpcomingTasksDialogue } from "../../utilities/ReminderRoomUtilities";
import ListMessageElement from "../MessageElement/ListMessageElement";
import { taskInfoString } from "../../utilities/ChatPageUtilities";

/**
 * A React component that displays the reminder room where the AI Assistant can talk to the user.
 * @returns {ReactNode} A React element that renders the reminder room.
 */
const ReminderRoom = ({closeReminderRoomModal, taskData, setHasReminded, timeOfTheDay, todayDate}) => {
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
     * Returns the dialogue line depending on the tasks at hand that need to be reminded of.
     * @param {Array<Object>} remindersTasks The list of tasks to be reminded of.
     * @returns {string | ReactNode} The dialogue that is printed regarding the user's reminder tasks.
     */
    const getRemindersTasksDialogue = (remindersTasks) => {
        const numOfTasks = remindersTasks.length
        if (numOfTasks == 0) {
            return "There is no task to remind you of."
        }

        const taskListText = remindersTasks.map((task, index) => {
            return taskInfoString(task, index)
        })
        const textList = ["I have noted to remind you of these tasks today!", ...taskListText]

        return (
            <ListMessageElement list={textList} />
        )
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
                clearInterval(messageTimer)
                return
            }
            const newMessage = reminderDialogueFlow[index]
            addNewChatBotResponse(newMessage)
            index += 1
        }
        
        // If user closes the modal, the reminder ends but reminded status is not updated to true.
        return () => {
            clearInterval(messageTimer)
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