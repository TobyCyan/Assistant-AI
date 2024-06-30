/**
 * Converts a date string into DDMM format.
 * @param {string} date Date string to convert into DDMM format.
 * @returns {string} The given date in the DDMM format.
 * @example
 * // Returns "10/08"
 * getDDMM('2024-08-10')
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
 * getDDMM('2024-08-10')
 */
export const getDDMMYY = (date) => {
    return `${date.substring(8, 10)}/${date.substring(5, 7)}/${date.substring(2,4)}`
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
 * Today's date.
 * @type {Date}
 */
const today = new Date();

