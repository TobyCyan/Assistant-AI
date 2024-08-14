const fs = require('fs')

const link = './ChatBot/behavior.json'
const data = JSON.parse(fs.readFileSync(link))

const dataArray = data['behavior']

/**
 * Checks if the given type exists.
 * @param {string} type The type to check for existence.
 * @returns {Object} An object with a boolean of whether the type is found and a number of the type's index.
 */
const isTypeExist = (type) => {
    let typeFound = false
    let typeIndex = -1
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i]['type'] == type) {
            typeFound = true
            typeIndex = i
            break
        }
    }
    return {typeFound, typeIndex}
}

/**
 * Checks if pattern of the given type exists.
 * @param {string} pattern The pattern to check for existence.
 * @param {string} type The type of the pattern.
 * @returns {Object} An object with a boolean of whether the pattern is found and a number of the type's index.
 */
const isPatternExist = (pattern, type) => {
    let patternFound = false
    
    const typeIndex = saveNewTypeEntry(type)
    
    const patternArray = dataArray[typeIndex]['pattern']
    for (let j = 0; j < patternArray.length; j++) {
        if (patternArray[j] == pattern) {
            patternFound = true
            break
        }
    }    
    return {patternFound, typeIndex}
}

/**
 * Checks if response of the given type exists.
 * @param {string} response The response to check for existence.
 * @param {string} type The type of the pattern.
 * @param {string} pattern The pattern of the response.
 * @returns {Object} An object with a boolean of whether the response is found and a number of the type's index.
 */
const isResponseExist = (response, type, pattern) => {
    let responseFound = false

    const typeIndex = saveNewPatternBasedOnType(pattern, type)

    const responseArray = dataArray[typeIndex]['response']
    for (let i = 0; i < responseArray.length; i++) {
        if (responseArray[i] == response) {
            responseFound = true
            break
        }
    }
    return {responseFound, typeIndex}
}

/**
 * Saves a new type entry if type doesn't exist.
 * @param {string} type The type to save.
 * @returns {number} The type index.
 */
const saveNewTypeEntry = (type) => {
    let {typeFound, typeIndex} = isTypeExist(type)

    if (!typeFound) {
        const dataItem = {
            type: type,
            pattern: [],
            response: []
        }
        dataArray.push(dataItem)
        typeIndex = dataArray.length - 1
        
        const jsonData = JSON.stringify(data)
        try {
            fs.writeFileSync(link, jsonData, (err) => {
                if (err) {
                    console.error('Error Saving New Type Entry: ', err)
                }
            })
        } catch (error) {
            console.error('Error reading the file:', error);
        }
    }
    return typeIndex
}

/**
 * Saves a new pattern of the given type.
 * @param {string} pattern The pattern to save.
 * @param {string} type The type of the pattern.
 * @returns {number} The type index.
 */
const saveNewPatternBasedOnType = (pattern, type)  => {
    const {patternFound, typeIndex} = isPatternExist(pattern, type)
    
    if (!patternFound) {
        let patternArray = dataArray[typeIndex]['pattern']
        patternArray.push(pattern)

        const jsonData = JSON.stringify(data)
        fs.writeFileSync(link, jsonData, (err) => {
            if (err) {
                console.error('Error Saving New Pattern Entry: ', err)
            } else {
                console.log('Pattern Entry Updated as: ' + patternArray)
            }
        })
    } 
    return typeIndex
}

/**
 * Saves a new response based on the given type and the pattern.
 * @param {string} response The response to save.
 * @param {string} type The type of the response.
 * @param {string} pattern The pattern of the response.
 * @returns {number} The type index.
 */
const saveNewResponseBasedOnTypeAndPattern = (response, type, pattern) => {
    const {responseFound, typeIndex} = isResponseExist(response, type, pattern)

    if (!responseFound) {
        let responseArray = dataArray[typeIndex]['response']
        responseArray.push(response)

        const jsonData = JSON.stringify(data)
        fs.writeFileSync(link, jsonData, (err) => {
            if (err) {
                console.error('Error Saving New Response Entry: ', err)
            } else {
                console.log('Response Entry Updated as: ' + responseArray)
            }
        })
    }
    return typeIndex
}

/**
 * Below are reserved for code to execute to add new types, pattern, or response entries.
 */

// console.log(dataArray)
//saveNewPatternBasedOnType("Can you delete this task for me please?", "DeleteTask")
// saveNewPatternBasedOnType("New Task", "AddTask")
// saveNewPatternBasedOnType("Tell me about recurring tasks.", "RecurringTask")
//saveNewResponseBasedOnTypeAndPattern("Your productivity report shows how efficient you’ve been in terms of completing your tasks on time. You can do it!", "ProductivityReport", "Productivity Report.")

