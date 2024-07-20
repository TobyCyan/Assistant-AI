/**
 * Converts a date string into DDMM format.
 * @param {string} date Date string to convert into DDMM format.
 * @returns {string} The given date in the DDMM format.
 * @example
 * // Returns "10/08"
 * getDDMM('2024-08-10') or getDDMM('2024-08-10T00:00:00.000Z')
 */
export const getDDMM = (date) => {
    return `${date.substring(8, 10)}/${date.substring(5, 7)}`
}

/**
 * Converts a date string into DDMMYY format.
 * @param {string} date Date string to convert into DDMMYY format.
 * @returns {string} The given date in the DDMMYY format.
 * @example
 * // Returns "10/08/24"
 * getDDMM('2024-08-10') or getDDMM('2024-08-10T00:00:00.000Z')
 */
export const getDDMMYY = (date) => {
    return `${date.substring(8, 10)}/${date.substring(5, 7)}/${date.substring(2,4)}`
}

/**
 * Converts a date string into YYYY-MM-DD format.
 * @param {string} date Date string to convert into YYYY-MM-DD format.
 * @returns {string} The given date in the YYYY-MM-DD format.
 * @example
 * // Returns "2024-08-10"
 * getDDMM('2024-08-10T00:00:00.000Z')
 */
export const getYYYYMMDD = (date) => {
    return date.split('T')[0]
}

/**
 * Today's date.
 * @type {Date}
 */
const today = new Date();

/**
 * Converts today's date string and a birthday date string into DDMM format, and compares them to see if they match.
 * @param {string} birthday Birthday string to convert into DDMM format.
 * @returns {boolean} true or false.
 * @example
 * // Returns false if today isn't 25th Febuary, else returns true.
 * isDateBirthday('2003-02-25T00:00:00.000Z')
 */
export const isTodayBirthday = (birthday) => {
    const todayDate = today.toISOString().split('T')[0]
    const birthdayDate = birthday.split('T')[0]

    const todayDateInDDMM = getDDMM(todayDate)
    const birthdayDateInDDMM = getDDMM(birthdayDate)

    return todayDateInDDMM == birthdayDateInDDMM
}

/**
 * Checks if today is the next day of the user's birthday by checking if the difference in days is 1.
 * @param {string} birthday Birthday string to compare with the today.
 * @returns {boolean} true or false.
 */
export const isTodayNextDayOfBirthday = (birthday) => {
    const birthdayDate = new Date(birthday)
    return getDaysDifference(birthdayDate, today) == 1
}

/**
 * Checks if the task is overdue.
 * @param {Object} task The task object.
 * @returns {boolean} true or false.
 */
export const isTaskOverdue = (task) => {
    const deadlineDate = new Date(task.deadline)
    return deadlineDate < today
}

/**
 * Checks if the task needs to be reminded of.
 * @param {Object} task The task object.
 * @returns {boolean} true or false.
 */
export const isTaskNeededToBeReminded = (task) => {
    const reminderDate = new Date(task.reminder)
    return reminderDate <= today
}

/**
 * Checks if the task is upcoming.
 * @param {Object} task The task object.
 * @returns {boolean} true or false.
 */
export const isTaskUpcoming = (task) => {
    const deadlineDate = new Date(task.deadline)
    return deadlineDate > today
}

/**
 * Checks whether the given password is a strong password.
 * @param {string} password Password to check.
 * @returns {boolean} true or false.
 */
export const checkStrongPW = (password) => {
    const len = password.length
    const alphabets = 'abcdefghijklmnopqrstuvwxyz'
    const uppercaseAlphabets = alphabets.toUpperCase()
    const numbers = '0123456789'

    let isAlphabetExist = false
    let isUppercaseExist = false
    let isNumberExist = false
    for (let i = 0; i < len; i++) {
        if (alphabets.includes(password[i])) {
            isAlphabetExist = true
        }
        if (uppercaseAlphabets.includes(password[i])) {
            isUppercaseExist = true
        }
        if (numbers.includes(password[i])) {
            isNumberExist = true
        }
    }

    return len >= 8 && isAlphabetExist && isUppercaseExist && isNumberExist
}

const priorityOrder = { High: 3, Medium: 2, Low: 1 };

/**
 * Sorts the tasks by priority first, then deadline.
 * @param {Object} task1 First task to compare.
 * @param {Object} task2 Second task to compare.
 * @returns {number} The difference in priority level or deadline.
 */
export const compareTasksPriority = (task1, task2) => {
    const priority1 = priorityOrder[task1.priority];
    const priority2 = priorityOrder[task2.priority];

    // If priorities are different, sort by priority (High > Medium > Low)
    if (priority1 !== priority2) {
        return priority2 - priority1; // Sort descending by priority
    }

    // Same priority - earlier deadline first
    return new Date(task1.deadline) - new Date(task2.deadline);
};

/**
 * Sorts the tasks by deadline first, then priority.
 * @param {Object} task1 First task to compare.
 * @param {Object} task2 Second task to compare.
 * @returns {number} The difference in priority level or deadline.
 */
export const compareTasksDeadline = (task1, task2) => {
    const deadline1 = new Date(task1.deadline).getTime()
    const deadline2 = new Date(task2.deadline).getTime()

    if(deadline1 !== deadline2) {
        return deadline1 - deadline2;
    }

    const priority1 = priorityOrder[task1.priority];
    const priority2 = priorityOrder[task2.priority];

    return priority2 - priority1;
}

/** 
 * Weightage for tasks.
 * @type {Object}
 */
const weightages = {
    overduedTasks: {
        High: -0.8,
        Medium: -0.5,
        Low: -0.3
    },
    punctual: {
        High: 0.1,
        Medium: 0.5,
        Low: 0.03
    },
    early: {
        High: 0.3,
        Medium: 0.2,
        Low: 0.1
    }
};

/**
 * Difference in days, returns negative if date2 is earlier / date 1 is later.
 * @param {Date} date1 First date.
 * @param {Date} date2 Second date.
 * @returns {number} The floored difference between both dates in days.
 */
const getDaysDifference = (date1, date2) => {
    const timeDiff = date2.getTime() - date1.getTime()

    return Math.floor(timeDiff / (1000 * 3600 * 24))
}

/**
 * Calculate points for each task.
 * @param {Object} task The task which points is to be calculated. 
 * @returns {number} The calculated points of the task.
 */
const pointsPerTask = (task) => {
    const taskDate = new Date(task.deadline)
    const days = getDaysDifference(today, taskDate)

    if(task.completed) {
        // Pro-rate the effect based on today date and completion date.
        const completedDate = new Date(task.dateCompleted)

        // Completion Date to today, definitely positive as today is always later, 30 days later weightage should not matter.
        let todayToCompletion = Math.min(30, getDaysDifference(completedDate, today))
        
        // Compute punctual / lateness (-ve) if late, 0 if punctual, +ve if early.
        const deadlineToCompletion = getDaysDifference(completedDate, taskDate)
 
        let weight = 0;

        // Weightage
        if(deadlineToCompletion > 0) {
            weight = weightages['early'][task.priority] * Math.min(deadlineToCompletion, 30) / 30
        } else if(deadlineToCompletion === 0) {
            weight = weightages['punctual'][task.priority]
        } else {
            weight = weightages['overduedTasks'][task.priority] * Math.min(Math.abs(deadlineToCompletion), 30) / 30
        }

        return 1 + weight * (30 - todayToCompletion) / 30;

    } else {
        // Compare deadline, negative weightage prorated up to a maximum effect of a month
        if(days < 0) {
            // Overdued
            const weight = weightages['overduedTasks'][task.priority]
            return days <= -30 ? 1 + weight : 1 + weight * days / -30;
        } else {
            return 1;
        }
    }
}

/**
 * Calculates the task productivity in terms of percentage.
 * @param {Array<Object>} tasks The list of user tasks.
 * @returns {number} The productivity percentage to 2 decimal places.
 */
export const calculateTaskProductivity = (tasks) => {
    const allPoints = tasks.reduce((each, next) => {
        const points = pointsPerTask(next)
        return each + points
    }, 0)
    const result = allPoints >= tasks.length ? 100 : allPoints < 0 ? 0 : 100 * allPoints / tasks.length
    return result.toFixed(2)
}

/**
 * Get the Difference between Current Time and Deadline Time.
 * @param {Object} task The task data.
 * @returns {number} The difference between current and deadline time.
 */
export const getTimeDifference = (task) => {
    const deadlineDate = new Date(task.deadline)
    const currDate = new Date()
    const currTime = currDate.getTime()
    const deadlineTime = deadlineDate.getTime()
    const difference = deadlineTime - currTime
    return difference
}

/**
 * Round up or down the given num.
 * @param {number} num The number to round up or down.
 * @returns {number} The rounded up or down number.
 */
export const roundNum = (num) => {
    const numCeil = Math.ceil(num)
    const numFloor = Math.floor(num)
    const decimalNum = num - numFloor
    return decimalNum >= 0.5 ? numCeil : numFloor
}

/**
 * Calculates the points based on the priority and difference between current time and deadline time.
 * @param {string} priotity The priority of the task - High, Medium, Low
 * @param {number} hours The difference in hours between current time and task deadline time.
 * @returns {number} The priority points of the task.
 */
export const calculatePriorityPoints = (priority, hours) => {
    /**
     * Map points to priority with different weightages.
     * @type {Object}
     */
    const priorityMap = {
        High: 3,
        Medium: 2,
        Low: 1
    }
    return priorityMap[priority] + roundNum(hours / 24)
}

/**
 * Calculate Points Earned from Completing the Task.
 * @returns {number} The task points.
 */
export const calculateTaskPoints = (taskData) => {
    const priority = taskData.priority
    const difference = getTimeDifference(taskData)
    const differenceInHours = difference / 1000 / 60 / 60
    const priorityPoints = calculatePriorityPoints(priority, differenceInHours)
    const maxThreshold = 50
    const totalPoints = priorityPoints + roundNum(differenceInHours * 0.25)
    const finalPoints = Math.min(totalPoints, maxThreshold)

    return differenceInHours < 0 ? 5 : finalPoints
}

/**
 * A function that parses the JSON Web Token (JWT) and extracts the username and userId from it.
 * @param {Object} token The JWT obtained from back-end to be parsed.
 * @returns {[string, number]} Array of the username and userId.
 */
export const parseToken = (token) => {
    const tokenPayload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    const username = tokenPayload?.username
    const userId = tokenPayload?.userId
    return [username, userId]
}

/**
 * Obtains a random element from the given array.
 * @param {Array} array The array to get the random element from.
 * @returns {*} A random element from the given array.
 */
export const randomItem = (array) => {
    const randomNum = Math.floor(Math.random() * array.length)
    return array[randomNum]
}

/**
 * Array of voice lines that can be said by the Assistant at the home page.
 * @type {Array<string>}
 */
export const voice_lines = [
    'Hello!',
    'Got something you want me to do for you?',
    'How can I help you today?',
    'Today is another day to be productive!',
    'You look tired, want me to sing a song for you?',
    "Don't forget to get your tasks done on time!",

]

/**
 * Gets a comment based on the user's productivity.
 * @param {Number} productivity The user's productivity.
 * @returns {String} A string that comments about the user's productivity.
 */
export const getProductivityBarComments = (productivity) => {
    if (productivity >= 80) {
        return 'Good Progress! Keep It Up!'
    }
    if (productivity >= 50) {
        return "You are getting there! I believe in you!"
    }
    if (productivity >= 20) {
        return "Hmm... You may need some work... But it's still doable!"
    }
    return "... Maybe the productivity is the memories we made along the way!"
}
