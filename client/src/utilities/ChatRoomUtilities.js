import { getDDMM } from "./utilities"

/**
 * Gets the time of the day depending of the current time in hours.
 * @returns {string} A string that represents the time of the day.
 */
export const getTimeOfTheDay = () => {
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
export const getGreetingDialogue = (timeOfTheDay) => {
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
export const getOverdueTasksDialogue = (overduedTasks) => {
    console.log('overdued: ' + JSON.stringify(overduedTasks))

    if (overduedTasks == 0) return 'There is no task overdue.'
    return `There ${overduedTasks == 1 ? `is 1 task` : `are ${overduedTasks} tasks`} overdue.`
}

/**
 * Returns the dialogue line depending on the tasks at hand that need to be reminded of.
 * @param {Array<Object>} remindersTasks The list of tasks to be reminded of.
 * @returns {string} The dialogue that is printed regarding the user's reminder tasks.
 */
export const getRemindersTasksDialogue = (remindersTasks) => {

    return ''
}

/**
 * Returns the dialogue line depends on the nearest upcoming task at hand.
 * @param {Array<Object>} upcomingTasks The list of upcoming tasks.
 * @returns {string} The dialogue that is printed regarding the user's nearest upcoming task.
 */
export const getUpcomingTasksDialogue = (upcomingTasks) => {
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
export const getPriorityTasksDialogue = (priorityTasks) => {
    if (priorityTasks.length >= 1) {
        const highestPriorityTask = priorityTasks[0]
        const highestPriorityTaskTitle = highestPriorityTask['title']
        const highestPriorityTaskDeadline = highestPriorityTask['deadline']
        return `The highest prioritised task on your list is ${highestPriorityTaskTitle}.`
    }
    return `I don't have any task to recommend to you either!`
}