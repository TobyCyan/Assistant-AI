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

export const compareTasks = (task1, task2) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    const priority1 = priorityOrder[task1.priority];
    const priority2 = priorityOrder[task2.priority];

    // If priorities are different, sort by priority (High > Medium > Low)
    if (priority1 !== priority2) {
        return priority2 - priority1; // Sort descending by priority
    }

    // Same priority - earlier deadline first
    return new Date(task1.deadline) - new Date(task2.deadline);
};