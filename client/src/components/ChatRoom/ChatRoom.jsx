import React, {useEffect, ReactNode} from "react";
import AIAvatar from '../../AppImages/arona_wave.png'
import {isTodayNextDayOfBirthday, getDDMM} from "../../utilities/utilities";

/**
 * Creates a response message instance that will show up in the chat room.
 * @param {string} response Response message from the AI Assistant.
 */
export const addNewChatBotResponse = (response) => {
    const chatRoom = document.getElementById('chatroom')
    
    // Creates a div with messageContainer and receiveContainer classes.
    // Acts as the container that will bundle the Avatar and message box.
    const messageContainer = document.createElement('div')
    messageContainer.classList.add('messageContainer')
    messageContainer.classList.add('receiveContainer')

    // Creates an img field with src attribute.
    // Acts as the Avatar.
    const profilePicture = document.createElement('img')
    profilePicture.classList.add('chatRoomAvatar')
    profilePicture.setAttribute('src', AIAvatar)

    // Creates a div with msgbox and receive classes.
    // Acts as the response message text box.
    const newMessage = document.createElement('div')
    newMessage.classList.add('msgbox')
    newMessage.classList.add('receive')
    newMessage.innerHTML = response
    // Adjusts the positions of the Avatar and Message box.
    messageContainer.insertBefore(profilePicture, newMessage.firstElementChild)
    messageContainer.appendChild(newMessage)
    
    // Append the message container to the chatRoom and automatically scrolls to the bottom.
    chatRoom.appendChild(messageContainer)
    chatRoom.scrollTop = chatRoom.scrollHeight;
}

/**
 * A React component that displays the chat room where the AI Assistant can talk to the user.
 * @returns {ReactNode} A React element that renders the chat room.
 */
const ChatRoom = ({closeChatRoomModal, overduedTasks, remindersTasks, upcomingTasks, priorityTasks}) => {
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

    const getOverdueTasksDialogue = (overduedTasks) => {
        return
    }

    const getRemindersTasksDialogue = (remindersTasks) => {

    }

    const getUpcomingTasksDialogue = (upcomingTasks) => {
        return
    }

    const getPriorityTasksDialogue = (priorityTasks) => {
        return
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
        'Your Task for today is...',
        'I believe you can do it!!',
        'Filler',
        'Filler',
        'Bye!'
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
                }
                const newMessage = reminderDialogueFlow[index]
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
                <div className="chatroom" id="chatroom">
    
                </div>   
            </div>
        </>
    )
}

export default ChatRoom