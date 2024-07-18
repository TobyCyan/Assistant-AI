import React,  { useEffect, ReactNode, useState, useRef } from "react";
import { getDDMM } from "../../utilities/utilities";
import { useTokenContext } from "../TokenContext/TokenContext";
import { wait } from "../../utilities/ChatPageUtilities";
import ChatBotResponseElement from "../MessageElement/ChatBotResponseElement";



/**
 * A React component that displays the chat room where the AI Assistant can talk to the user.
 * @returns {ReactNode} A React element that renders the chat room.
 */
const ChatRoom = ({closeChatRoomModal, taskData}) => {
    const {userInfo, tokenStatus} = useTokenContext()

    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const [chatMessages, setChatMessages] = useState([])
    const lastMessage = useRef(null)
    
    /**
     * @function useEffect
     * @description Debug statement to show the list of upcoming tasks.
     */
    useEffect(() => {
        console.log('data: ' + JSON.stringify(taskData.overduedTasks)+ '\n')
    }, [taskData])
    
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
     * Gets the time of the day depending of the current time in hours.
     * @returns {string} A string that represents the time of the day.
     */
    const getTimeOfTheDay = () => {
        const today = new Date()
        const timeInHours = today.getHours()
        
        if (timeInHours <= 6) {
            return 'EarlyMorning'
        } 
        if (timeInHours < 12) {
            return 'Morning'
        } 
        if (timeInHours <= 18) {
            return 'Afternoon'
        }
        return 'Evening'
    }

    /**
     * Gets the greeting dialogue.
     * @param {string} timeOfTheDay A string that represents the time of the day.
     * @returns {string} A string that represents the greeting dialogue.
     */
    const getGreetingDialogue = (timeOfTheDay) => {
        if (timeOfTheDay == 'EarlyMorning') {
            return "Oh you're still awake? Don't push yourself too hard!"
        }
        if (timeOfTheDay == 'Morning') {
            return "Good morning!"
        }
        if (timeOfTheDay == 'Afternoon') {
            return "Good Afternoon!"
        }
        if (timeOfTheDay == 'Evening') {
            return "It's getting late. Remember to get enough sleep!"
        }
        return 'Hello!'
    }

    /**
     * Returns the dialogue line depending on the number of overdue tasks at hand.
     * @param {Array<Object>} overduedTasks The list of overdued tasks.
     * @returns {string} The dialogue that is printed regarding the user's overdued tasks.
     */
    const getOverdueTasksDialogue = (overduedTasks) => {
        console.log('overdued: ' + JSON.stringify(overduedTasks))

        if (overduedTasks == 0) return 'There is no task overdue.'
        return `There ${overduedTasks == 1 ? `is 1 task` : `are ${overduedTasks} tasks`} overdue.`
    }

    /**
     * Returns the dialogue line depending on the tasks at hand that need to be reminded of.
     * @param {Array<Object>} remindersTasks The list of tasks to be reminded of.
     * @returns {string} The dialogue that is printed regarding the user's reminder tasks.
     */
    const getRemindersTasksDialogue = (remindersTasks) => {

        return ''
    }

    /**
     * Returns the dialogue line depends on the nearest upcoming task at hand.
     * @param {Array<Object>} upcomingTasks The list of upcoming tasks.
     * @returns {string} The dialogue that is printed regarding the user's nearest upcoming task.
     */
    const getUpcomingTasksDialogue = (upcomingTasks) => {
        if (upcomingTasks.length >= 1) {
            const nearestUpcomingTask = upcomingTasks[0]
            const nearestUpcomingTaskTitle = nearestUpcomingTask['title']
            const nearestUpcomingTaskDeadline = getDDMM(nearestUpcomingTask['deadline'])
            return `Your nearest upcoming task is ${nearestUpcomingTaskTitle} which ends on ${nearestUpcomingTaskDeadline}!`
        }
        return `You haven't added any tasks yet! Try adding some!`
    }

    /**
     * Returns the dialogue line depends on the highest prioritised task at hand.
     * @param {Array<Object>} priorityTasks The list of priority tasks.
     * @returns {string} The dialogue that is printed regarding the user's highest prioritised task.
     */
    const getPriorityTasksDialogue = (priorityTasks) => {
        if (priorityTasks.length >= 1) {
            const highestPriorityTask = priorityTasks[0]
            const highestPriorityTaskTitle = highestPriorityTask['title']
            const highestPriorityTaskDeadline = highestPriorityTask['deadline']
            return `The highest prioritised task on your list is ${highestPriorityTaskTitle}.`
        }
        return `I don't have any task to recommend to you either!`
    }

    /**
     * @type {string} The time of the day.
     */
    const timeOfTheDay = getTimeOfTheDay()

    /**
     * @type {Date} Today's date.
     */
    const today = new Date()

    /**
     * @type {Number} Today's date in terms of the day of the month.
     */
    const todayDate = today.getDate()

    /**
     * @type {Array} The flow of the dialogue.
     */
    const reminderDialogueFlow = [
        getGreetingDialogue(timeOfTheDay),
        'Your Tasks for today are as follows...',
        getOverdueTasksDialogue(taskData.overduedTasks),
        // getRemindersTasksDialogue(taskData.remindersTasks),
        // getUpcomingTasksDialogue(taskData.upcomingTasks),
        // getPriorityTasksDialogue(taskData.priorityTasks),
        'Bye and have fun!'
    ]

    /**
     * @function useEffect
     * @description Resets the reminder array in the localStorage if it does not exist, or user has been reminded and today is a different day than the recorded one.
     */
    useEffect(() => {
        let reminder = localStorage.getItem(timeOfTheDay)
        reminder = JSON.parse(reminder)

        if (!reminder || reminder['reminded'] && reminder['date'] != todayDate) {
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
        const hasReminded = JSON.parse(localStorage.getItem(timeOfTheDay))['reminded']

        if (!hasReminded) {
            const chatRoom = document.getElementById('chatroom')
            chatRoom.innerHTML = ''

            const messageInterval = 1600
            let index = 0
            let messageTimer = setInterval(nextMessage, messageInterval)
    
            function nextMessage() {
                if (index == reminderDialogueFlow.length) {
                    localStorage.setItem(timeOfTheDay, JSON.stringify({reminded: true, date: todayDate}))
                    clearInterval(messageTimer)
                    closeChatRoomModal()
                    return
                }
                const newMessage = reminderDialogueFlow[index]
                console.log('message: ' + newMessage)
                addNewChatBotResponse(newMessage)
                index += 1
            }
            
            return () => {
                clearInterval(messageTimer)
            }
        } else {
            closeChatRoomModal()
        }

    }, [])


    return (
        <>   
            <div className="chatpageContainer oneWayChatRoom">
                <div className="chatroom" id="chatroom" ref={lastMessage}>
                    {...chatMessages}
                </div> 
            </div>
        </>
    )
}

export default ChatRoom