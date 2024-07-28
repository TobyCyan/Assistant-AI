import { getDDMM } from "./utilities"

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
 * Waits for a given duration in milliseconds.
 * @param {number} n The duration to wait in milliseconds. 
 * @returns {Promise<void>} A promise that sets a time out for n milliseconds.
 */
export const wait = (n) => {
    return new Promise((resolve) => setTimeout(resolve, n))
}

/**
 * Removes all spaces from a given text string.
 * @param {string} text The text string.
 * @returns A text string without spaces.
 */
export const removeSpaces = (text) => {
    return text.replace(/\s+/g, '')
}

/**
 * Gets a string of the task information.
 * @param {Object} task The task.
 * @param {number} index The index number.
 * @returns {String} A string that shows information of the given task object.
 */
export const taskInfoString = (task, index) => `${(index + 1)}. ${task.title}, ${task.category}, ${getDDMM(task.deadline)}, ${task.priority}`

/**
 * @async
 * Gets the user's current location's weather and returns it as a promise.
 * @returns {Promise<string>} A promise that returns a weather response.
 */
export const getCurrentPositionWeather = async (APIKey) => {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude
                const lon = position.coords.longitude
    
                let fetchLink = 'https://api.openweathermap.org/data/2.5/weather?'
                fetchLink += 'lat=' + lat + '&lon=' + lon + '&appid=' + APIKey
    
                try {
                    const response = await fetch(fetchLink)
                    if (response.ok) {
                        const weather = await response.json()
                        const weatherInfo = weather.weather[0]
                        const weatherDescription = weatherInfo.description
                        const weatherResponse = " Today's weather is " + weatherDescription + "!"
                        resolve(weatherResponse)
                    }
                } catch (err) {
                    console.error('Error Fetching Weather Info! ', err)
                    reject(err)
                }
                
            });
        }
    })
}