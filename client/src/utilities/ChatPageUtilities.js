import { addNewChatBotResponse } from "../components/ChatRoom/ChatRoom";
import UserAvatar from '../AppImages/TempAvatar.png';

/**
 * Checks if the given input date has the correct format of YYYY-MM-DD.
 * @param {string} date The date to check. 
 * @returns {boolean} true or false.
 */
export const correctDateFormat = (date) => {
    /**
     * Array in the format of [YYYY, MM, DD]
     * @type {Array<String>}
     */
    const dateArray = date.split('-')
    const dateObject = new Date(date)
    const formatLengthMatches = dateArray.length == 3 && dateArray[0].length == 4 && dateArray[1].length == 2 && dateArray[2].length == 2
    return !isNaN(dateObject) && formatLengthMatches
}

/**
 * Checks if the given input date comes after today.
 * @param {string} date The date to check.
 * @returns {boolean} true or false.
 */
export const dateAfterToday = (date) => {
    const currentDate = new Date()
    const dateObj = new Date(date)
    return !(dateObj < currentDate)
}

/**
 * Checks if the given input reminder date comes before the deadline.
 * @param {string} reminder The reminder date.
 * @param {string} deadline The deadline date.
 * @returns {boolean} true or false.
 */
export const reminderBeforeDeadline = (reminder, deadline) => {
    const reminderDate = new Date(reminder)
    const deadlineDate = new Date(deadline)
    return reminderDate < deadlineDate
}

/**
 * Checks for the input deadline format.
 * @async
 * @param {string} deadline The input deadline.
 * @returns {boolean} true or false.
 */
export const checkDeadline = async (deadline) => {
    if (!correctDateFormat(deadline)) {
        await addNewChatBotResponse('Wrong format, please try again.')
        return false
    }
    if (!dateAfterToday(deadline)) {
        await addNewChatBotResponse('Deadline should not come before today you silly! Please try again.')
        return false
    }
    return true
}

/**
 * Array of inputs to indicate priority level.
 * @type {Array<String>}
 */
const priorities = ['High', 'Medium', 'Low']

/**
 * Checks for the input priorty format.
 * @async
 * @param {string} priority The input priority.
 * @returns {boolean} true or false.
 */
export const checkPriority = async (priority) => {
    if (!priorities.includes(priority)) {
        await addNewChatBotResponse('For consistency please use the exact words for priority!')
        return false
    }
    return true
}

/**
 * Checks for the input reminder format.
 * @param {string} reminder The input reminder.
 * @returns {boolean} true or false.
 */
export const checkReminder = async (reminder, deadline) => {
    if (!correctDateFormat(reminder)) {
        await addNewChatBotResponse('Wrong format, please try again.')
        return false
    }
    if (!dateAfterToday(reminder)) {
        await addNewChatBotResponse('Reminder should not come before today you silly! Please try again.')
        return false
    }
    if (!reminderBeforeDeadline(reminder, deadline)) {
        await addNewChatBotResponse('I have to reminder you before the deadline remember? Please try again.')
        return false
    }
    return true
}

/**
 * Creates a user message instance that will show up in the chat room.
 * @param {string} input Input message from the user.
 */
export const addNewUserMessage = (input) => {
    const chatRoom = document.getElementById('chatroom')

    // Creates a div with messageContainer and sendContainer classes.
    // Acts as the container that will bundle the Avatar and message box.
    const messageContainer = document.createElement('div')
    messageContainer.classList.add('messageContainer')
    messageContainer.classList.add('sendContainer')

    // Creates an img field with src attribute.
    // Acts as the Avatar.
    const profilePicture = document.createElement('img')
    profilePicture.classList.add('chatRoomAvatar')
    profilePicture.setAttribute('src', UserAvatar)

    // Creates a div with msgbox and send classes.
    // Acts as the user input message text box.
    const newMessage = document.createElement('div')
    newMessage.classList.add('msgbox')
    newMessage.classList.add('send')
    newMessage.innerHTML = input
    messageContainer.appendChild(newMessage)
    messageContainer.appendChild(profilePicture)

    // Append the message container to the chatRoom and automatically scrolls to the bottom.
    chatRoom.appendChild(messageContainer)
    chatRoom.scrollTop = chatRoom.scrollHeight;
}