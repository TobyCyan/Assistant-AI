const fs = require('fs')

const link = './ChatBot/behavior.json'
const data = JSON.parse(fs.readFileSync(link))

const dataArray = data['behavior']

// Checks if the Given type Exists.
// Accepts a type string.
// Returns a typeFound boolean and typeIndex number.
const isTypeExist = (type) => {
    let typeFound = false
    let typeIndex = -1
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i]['type'] == type) {
            console.log('Behavior Type ' + type + ' already exists!')
            typeFound = true
            typeIndex = i
            break
        }
    }
    return {typeFound, typeIndex}
}

// Checks if pattern of the Given type Exists.
// Accepts a pattern string and type string.
// Returns a patternFound boolean and typeIndex number.
const isPatternExist = (pattern, type) => {
    let patternFound = false
    
    const typeIndex = saveNewTypeEntry(type)
    
    const patternArray = dataArray[typeIndex]['pattern']
    for (let j = 0; j < patternArray.length; j++) {
        if (patternArray[j] == pattern) {
            console.log('Pattern: ' + pattern + ' already exists!')
            patternFound = true
            break
        }
    }    
    return {patternFound, typeIndex}
}

// Checks if response of the Given type Exists.
// Accepts a response string, a type string and a pattern string.
// Returns a responseFound boolean and a typeIndex number.
const isResponseExist = (response, type, pattern) => {
    let responseFound = false

    const typeIndex = saveNewPatternBasedOnType(pattern, type)

    const responseArray = dataArray[typeIndex]['response']
    for (let i = 0; i < responseArray.length; i++) {
        if (responseArray[i] == response) {
            console.log('Response: ' + response + ' already exists!')
            responseFound = true
            break
        }
    }
    return {responseFound, typeIndex}
}

// Saves a New type Entry if type doesn't exist.
// Accepts a type string.
// Returns a typeIndex number.
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
            console.log('Type: ' + type + ' created!')
        } catch (error) {
            console.error('Error reading the file:', error);
        }
    }
    return typeIndex
}

// Saves a New pattern of the Given type.
// Also handles if type doesn't exist.
// Accepts a pattern string and a type string.
// Returns a typeIndex number.
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

// Saves a New response Based on the Given type and the pattern.
// Accepts a response string, a type string and a pattern string.
// Returns a typeIndex number.
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

console.log(dataArray)
//saveNewResponseBasedOnTypeAndPattern("Yep sure! Please wait a moment!", "DeleteTask", "Delete a Task")
//saveNewPatternBasedOnType("Can you delete this task for me please?", "DeleteTask")
//saveNewPatternBasedOnType("Add a Task", "AddTask")
//saveNewPatternBasedOnType("Add Task", "AddTask")
saveNewResponseBasedOnTypeAndPattern("Your productivity report shows how efficient you’ve been in terms of completing your tasks on time. You can do it!", "ProductivityReport", "Productivity Report.")
//saveNewResponseBasedOnTypeAndPattern("Understood!", "PriorityTask", "Highest prioritised task.")
//saveNewResponseBasedOnTypeAndPattern("You got it!", "PriorityTask", "What tasks should I prioritise.")
saveNewPatternBasedOnType("What is my productivity report?", "ProductivityReport")
saveNewPatternBasedOnType("Tell me about the productivity report.", "ProductivityReport")

// saveNewPatternBasedOnType("What is the weather today?" , "Weather")

