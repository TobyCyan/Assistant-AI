export const getDDMM = (date) => {
    return `${date.substring(8, 10)}/${date.substring(5, 7)}`
}

export const getDDMMYY = (date) => {
    return `${date.substring(8, 10)}/${date.substring(5, 7)}/${date.substring(2,4)}`
}

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

// Weightage for tasks
const weightages = {
    overduedTasks: {
        High: -0.5,
        Medium: -0.3,
        Low: -0.2
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

const getDaysDifference = (date1, date2) => {
    // Returns negative if date2 is earlier / date 1 is later
    const timeDiff = date2.getTime() - date1.getTime()

    return Math.floor(timeDiff / (1000 * 3600 * 24))
}

const pointsPerTask = (task) => {
    const taskDate = new Date(task.deadline)
    const days = getDaysDifference(today, taskDate)
    // console.log(days)

    if(task.completed) {
        // Pro-rate the effect based on today date and completion date
        const completedDate = new Date(task.dateCompleted)
        // Completion Date to today, definitely positive as today is always later, 30 days later weightage should not matter
        let todayToCompletion = Math.min(30, getDaysDifference(completedDate, today))
        // console.log(todayToCompletion)
        // Compute punctual / lateness (-ve) if late, 0 if punctual, +ve if early
        const deadlineToCompletion = getDaysDifference(completedDate, taskDate)
        // console.log(deadlineToCompletion)
        let weight = 0;

        //Weightage
        if(deadlineToCompletion > 0) {
            weight = weightages['early'][task.priority] * Math.min(deadlineToCompletion, 30) / 30
        } else if(deadlineToCompletion === 0) {
            weight = weightages['punctual'][task.priority]
        } else {
            weight = weightages['overduedTasks'][task.priority] * Math.min(Math.abs(deadlineToCompletion), 30) / 30
        }
        // console.log(weight)
        // console.log(weight * (30 - todayToCompletion) / 30)

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



export const calculateTaskProductivity = (tasks) => {
    const allPoints = tasks.reduce((each, next) => {
        const points = pointsPerTask(next)
        // console.log(next.deadline + "got" + points)
        return each + points
    }, 0)
    const result = allPoints >= tasks.length ? 100 : allPoints < 0 ? 0 : 100 * allPoints / tasks.length
    return result.toFixed(2)
}

const today = new Date();

