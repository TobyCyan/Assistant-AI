import React, { useState, useEffect, ReactNode } from "react";
import NavBar from "../components/NavBar/NavBar.jsx";
import { useTokenContext } from "../components/TokenContext/TokenContext";
import getCurrentPositionWeather from "../../../ChatBot/static/API Calls/weather";
import { addNewChatBotResponse } from "../components/ChatRoom/ChatRoom.jsx";
import UserAvatar from '../AppImages/TempAvatar.png'
import { wait } from "../components/ChatRoom/ChatRoom.jsx";
import { getDDMM } from "../utilities/utilities.js";

/**
 * A React component that displays the page where users can interact and chat with the AI Assistant.
 * @component
 * @returns {ReactNode} A React element that renders the chatbot page.
 */
const ChatPage = () => {
    const [takingInput, setTakingInput] = useState(false)
    const [inConfirmation, setInConfirmation] = useState(false)
    const [input, setInput] = useState('')
    const [inputType, setInputType] = useState('')
    const [inputFlow, setInputFlow] = useState([])
    const [index, setIndex] = useState(0)
    const [taskData, setTaskData] = useState(null)
    const [tasks, setTasks] = useState([])

    /**
     * Array of inputs to quit input mode.
     * @type {Array<String>}
     */
    const quitInputs = ['quit', 'q', 'bye', 'stop', 'leave']

    /**
     * Array of inputs to go back to the previous input stage.
     * @type {Array<String>}
     */
    const backInputs = ['back', 'go back', 'previous']

    /**
     * Array of inputs to confirm.
     * @type {Array<String>}
     */
    const confirmInputs = ['confirm', 'yes', 'sure', 'okay', 'no problem']

    /**
     * Array of inputs to unconfirm.
     * @type {Array<String>}
     */
    const unconfirmInputs = ['no']

    /**
     * Array of inputs to indicate priority level.
     * @type {Array<String>}
     */
    const priorities = ['High', 'Medium', 'Low']

    /**
     * Array of strings to indicate each stage during addition of a new task.
     * @type {Array<String>}
     */
    const addTaskFlow = ['title', 'description', 'category', 'deadline', 'priority', 'reminder']

    /**
     * A string of the quit inputs that dynamically changes depending on the quitInput array.
     * The string looks like this: 'quitInput(1), quitInput(2), ... , or quitInput(n)'
     * @type {string}
     */
    const quitInputsString = quitInputs.slice(0, -1).join(', ') + `, or ${quitInputs.slice(-1)}`

    /**
     * A string of the back inputs that dynamically changes depending on the backInput array.
     * The string looks like this: 'backInput(1), backInput(2), ... , or backInput(n)'
     * @type {string}
     */
    const backInputsString = backInputs.slice(0, -1).join(', ') + `, or ${backInputs.slice(-1)}`

    /**
     * A string of the confirm inputs that dynamically changes depending on the confirmInput array.
     * The string looks like this: 'confirmInput(1), confirmInput(2), ... , or confirmInput(n)'
     * @type {string}
     */
    const confirmInputsString = confirmInputs.slice(0, -1).join(', ') + `, or ${confirmInputs.slice(-1)}`

    /**
     * A string of the unconfirm inputs that dynamically changes depending on the unconfirmInput array.
     * The string looks like this: 'unconfirmInput(1), unconfirmInput(2), ... , or unconfirmInput(n)'
     * @type {string}
     */
    const unconfirmInputsString = unconfirmInputs.slice(0, -1).join(', ') + `, or ${unconfirmInputs.slice(-1)}`

    /**
     * An array of strings that shows the index, title, category and deadline in the DDMM format of each task.
     * @type {Array<string>}
     */
    const taskList = tasks.map((task, index) => {
        return `${(index + 1)}. ${task.title}, ${task.category}, ${getDDMM(task.deadline)}`
    })

    /**
     * The string after joining all the strings in the taskList array, separating them by a line break element.
     * @type {string}
     */
    const taskListText = taskList.join('<br>')

    /**
     * The current task title and setter function to update it.
     * @type {[string, function]}
     */
    const [title, setTitle] = useState(taskData?.title || '');

    /**
     * The current task description and setter function to update it.
     * @type {[string, function]}
     */
    const [description, setDescription] = useState(taskData?.description  || '');

    /**
     * The current task category and setter function to update it.
     * @type {[string, function]}
     */
    const [category, setCategory] = useState(taskData?.category || '');

    /**
     * The current task deadline and setter function to update it.
     * @type {[string, function]}
     */
    const [deadline, setDeadline] = useState(taskData?.deadline?.substring(0, 10) || '');

    /**
     * The current task priority and setter function to update it.
     * @type {[string, function]}
     */
    const [priority, setPriority] = useState(taskData?.priority || '');

    /**
     * The current task reminder date and setter function to update it.
     * @type {[string, function]}
     */
    const [reminderDate, setReminderDate] = useState(taskData?.reminder?.substring(0,10) || '');

    const {tokenStatus, userInfo} = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    /**
     * The current user data and setter function to update it.
     * @type {[Object, function]}
     */
    const [userData, setUserData] = userInfo

    /**
     * @function useEffect
     * @description Get User Info and User TaskModals if there is token.
     */
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
            getUserTasks()
        }
    }, [token])


    /**
     * POST Request to Add Task.
     * @async
     * @returns {Promise<void>} A promise that adds the user task.
     * @throws {Error} Throws an error if adding task fails.
     */
    const addNewTask = async () => {
        // console.log(reminderTime)
        const newTask = {
            title: title,
            description: description,
            category: category,
            deadline: deadline,
            priority: priority,
            reminder: reminderDate,
            completed: false,
            points: 0,
        }

        /**
         * Data to post and make the API call.
         * @type {Object}
         */
        const dataToPost = {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        fetch('http://localhost:5001/AddTask', dataToPost)
        .then(res => {
            if (res.ok) {
                console.log('Task Successfully Added!')
                return res.json()
            } else {
                console.error(err => 'Add Task Failed!', err)
            }
        })
        .then(task => {
            setTitle('')
            setDescription('')
            setCategory('')
            setDeadline('')
            setPriority('')
            setReminderDate('')
            getUserTasks()
        })
        .catch(err => {
            console.error('Error Adding Task: ', err.message)
        })
    }

    /**
     * Async GET method to get user tasks.
     * @async
     * @returns {Promise<void>} A promise that gets the current user's tasks.
     * @throws {Error} Throws an error if getting user tasks fails.
     */
    const getUserTasks = async () => {
        const dataToPost = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const res = await fetch('http://localhost:5001/Tasks', dataToPost)
            if (res.ok) {
                console.log("TaskModals successfully retrieved")
            } else {
                console.log("Invalid User/TaskModals")
            }

            const data = await res.json()
            if (data) {
                setTasks(data.tasks)
                console.log('task fetched!')
            }
        } catch (error) {
            console.error('Failed to Fetch TaskModals!', error)
        }
    }

    /**
     * DELETE Request to delete Task.
     * @async
     * @param {Number} taskId The task ID to post.
     * @returns {Promise<void>} A promise that deletes a task.
     * @throws {Error} Throws an error if deleting task fails.
     */
    const deleteTask = async (taskId) => {
        const dataToPost = {
            method: 'DELETE',
            body: JSON.stringify({taskId}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const res = await fetch('http://localhost:5001/DeleteTask', dataToPost)
            if(res) {
                await res.json()
                getUserTasks()
            }

        } catch (error) {
            console.error('Failed to Delete task!', error)
        }
    }

    /**
     * Removes all spaces from a given text string.
     * @param {string} text The text string.
     * @returns A text string without spaces.
     */
    const removeSpaces = (text) => {
        return text.replace(/\s+/g, '')
    }

    /**
     * @async
     * @returns {Promise<void>} A promise that returns a response.
     * @throws {Error} Throws an error if chatting fails.
     * @param {Object} dataToPost The data to post to the chatbot's back-end to obtain a response.
     */
    const fetchResponse = async (dataToPost) => {
        fetch('http://localhost:5500/startchat', dataToPost)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log(res.statusText)
                }
            })
            .then(reply => {      
                const output = reply.response
                addNewChatBotResponse(output)
                
                handleResponseType(reply.type, reply.API_Key)
            })
            .catch(err => {
                console.error('Error Getting a Response: ', err)
            })
    }

    /** 
    * Handles user chat input and POST Request to Chat with the Assistant.
    * @async
    * @returns {void}
    */
    const handleInput = async () => {
        if (removeSpaces(input) == '') {
            setInput('')
            return
        }

        addNewUserMessage(input)
        setInput('')

        if (inConfirmation) {
            applyConfirmation(input)
            return
        }
        if (takingInput) {
            handleTakingInput(input)
            return
        }

        const model = 'model.tflearn'
        const dataToPost = {
            method: 'POST',
            body: JSON.stringify({input, model}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        fetchResponse(dataToPost)
        return
        
    }

    /**
     * Switches to input mode to take user inputs to add to database.
     * @async
     * @param {string} inputType The input type to switch to.
     * @returns {void} Returns nothing.
     */
    const switchToInputMode = async (inputType) => {
        const inputModeText = 'Entering input mode... Please wait a moment.'

        setTakingInput(true)
        setInputType(inputType)
        setIndex(0)
        await addNewChatBotResponse(inputModeText)
        return
    }
    
    /**
     * Handles the specified response type and pass in an API key if it exists to receive a custom response from the chat bot.
     * @async
     * @param {string} responseType The response type to handle.
     * @param {string} apiKey The API Key to pass in to get certain information. 
     */
    const handleResponseType = async (responseType, apiKey) => {
        switch (responseType) {
            case 'Weather':
                const weatherResponse = await getCurrentPositionWeather(apiKey)
                const createWeatherResponse = weatherResponse
                await addNewChatBotResponse(createWeatherResponse)
                break
            
            case 'AddTask':
                setInputFlow(addTaskFlow)

                const quitInstructionText = `All set! Please say either of ${quitInputsString} to quit input mode!`
                const backInstructionText = `You can also say ${backInputsString} to go back to the previous field if you ever change your mind!`
                const titleInputText = 'Please start by entering the title of your new task~'
                await switchToInputMode(responseType)
                await addNewChatBotResponse(quitInstructionText)
                await addNewChatBotResponse(backInstructionText)
                await addNewChatBotResponse(titleInputText)
                break
        
            case 'EditTask':

                break
            
            case 'DeleteTask':
                const obtainingTaskText = 'Obtaining all of your tasks...'
                await switchToInputMode(responseType)
                await addNewChatBotResponse(obtainingTaskText)
                await getUserTasks()
                await addNewChatBotResponse('All set!')

                const showTaskListText = `Please enter the index number of the task to delete it (which means ${taskList.length == 1 ? 1 : `1 - ${taskList.length}`})!<br> ${taskListText}`
                await addNewChatBotResponse(showTaskListText)
                break
            
            case 'Priority':

                break    
        }
    }

    /**
     * Handles user input during input mode.
     * @async
     * @param {string} input The user input.
     * @returns {void}
     */
    const handleTakingInput = async (input) => {
        if (quitInputs.includes(input.toLowerCase())) {
            setTakingInput(false)
            setInConfirmation(false)
            setIndex(0)
            await addNewChatBotResponse('Quitting input mode.')
            await addNewChatBotResponse('Back to normal! What would you like to do next?')
            return
        }

        if (index > 0 && backInputs.includes(input.toLowerCase())) {
            setIndex(index - 1)
            await addNewChatBotResponse('Understood!')
            await addNewChatBotResponse(`Please re-input the value for the ${inputFlow[index - 1]}.`)
            return
        }

        if (index == 0 && backInputs.includes(input.toLowerCase())) {
            await addNewChatBotResponse('We are already at the beginning!')
            return
        }

        switch (inputType) {
            case 'AddTask':
                redirectInputToAddTask(input)
                break

            case 'EditTask':

                break

            case 'DeleteTask':
                redirectInputToDeleteTask(input)
                break

            case 'Priority':

                break

        }
    }

    /**
     * Checks if the given input date has the correct format of YYYY-MM-DD.
     * @param {string} date The date to check. 
     * @returns {boolean} true or false.
     */
    const correctDateFormat = (date) => {
        /**
         * Array in the format of [YYYY, MM, DD]
         * @type {Array<String>}
         */
        const dateArray = date.split('-')
        const dateObject = new Date(date)
        const formatLengthMatches = dateArray[0].length == 4 && dateArray[1].length == 2 && dateArray[2].length == 2
        return !isNaN(dateObject) && formatLengthMatches
    }

    /**
     * Checks if the given input date comes after today.
     * @param {string} date The date to check.
     * @returns {boolean} true or false.
     */
    const dateAfterToday = (date) => {
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
    const reminderBeforeDeadline = (reminder, deadline) => {
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
    const checkDeadline = async (deadline) => {
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
     * Checks for the input priorty format.
     * @async
     * @param {string} priority The input priority.
     * @returns {boolean} true or false.
     */
    const checkPriority = async (priority) => {
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
    const checkReminder = async (reminder) => {
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
     * Once in input mode, all user inputs are redirected here to set the inputs for adding a new task.
     * @async
     * @param {string} input The user input.
     * @returns {void}
     */
    const redirectInputToAddTask = async (input) => {
        const currFlowStage = inputFlow[index]
        console.log('index: ' + index)

        switch (currFlowStage) {
            case 'title':
                setTitle(input)
                await addNewChatBotResponse(`Sweet! Please enter the ${inputFlow[index + 1]}.`)
                break

            case 'description':
                setDescription(input)
                await addNewChatBotResponse(`Sweet! Please enter the ${inputFlow[index + 1]}.`)
                break

            case 'category':
                setCategory(input)
                await addNewChatBotResponse('Great! Please enter the deadline in the format of YYYY-MM-DD.')
                break

            case 'deadline':
                const isDeadlineValid = await checkDeadline(input)
                if (!isDeadlineValid) {
                    return
                }    
                setDeadline(input)
                await addNewChatBotResponse('Nice! Please set a priority level of High, Medium or Low!')
                break

            case 'priority':
                const isPriorityValid = await checkPriority(input)
                if (!isPriorityValid) {
                    return
                }
                setPriority(input)
                await addNewChatBotResponse('Great! Please enter the reminder date in the format of YYYY-MM-DD.')
                break

            case 'reminder':
                const isReminderValid = await checkReminder(input)
                if (!isReminderValid) {
                    return
                }
                setReminderDate(input)
                break

        }

        setIndex(index + 1)

        if (index + 1 == inputFlow.length) {
            await generateConfirmation(inputType)
            return
        }
    } 

    /**
     * Once in input mode, all user inputs are redirected here to set the inputs for deleting an existing task.
     * @async
     * @param {string} input The user input.
     * @returns {void}
     */
    const redirectInputToDeleteTask = async (input) => {
        if (isNaN(input)) {
            const notANumberText = 'Input must be a number!'
            await addNewChatBotResponse(notANumberText)
            return
        }
        if (input < 1 || input > tasks.length) {
            const indexOutOfRangeText = 'Your index is out of range, please tell me a valid one to delete.'
            await addNewChatBotResponse(indexOutOfRangeText)
            return
        }

        setIndex(parseInt(input))
        await generateConfirmation(inputType, input)
        return
    }

    const generateConfirmation = async (inputType, input) => {
        setInConfirmation(true)
        await addNewChatBotResponse('Hold on a moment...')
        await wait(1000)

        const generalConfirmationText = `Please enter ${confirmInputsString} to proceed. <br> Or enter ${unconfirmInputsString} to leave`
        switch (inputType) {
            case 'AddTask':
                const summaryText = `Your new task to be added will be: <br>
                Title: ${title} <br>
                Description: ${description} <br>
                Category: ${category} <br>
                Deadline: ${deadline} <br>
                Priority: ${priority} <br> 
                Reminder: ${reminderDate} <br> 
                Would that be okay?`


                await addNewChatBotResponse(summaryText)
                await addNewChatBotResponse(generalConfirmationText)
                setIndex(0)
                break

            case 'DeleteTask':
                const taskIndex = input - 1
                const deleteTaskConfirmationText = `Task ${taskList[taskIndex]} will be deleted.`
                await addNewChatBotResponse(deleteTaskConfirmationText)
                await addNewChatBotResponse(generalConfirmationText)
                break

        }
        setTakingInput(false)
    }

    const applyConfirmation = async (input) => {
        if (unconfirmInputs.includes(input.toLowerCase()) || quitInputs.includes(input.toLowerCase())) {
            setTakingInput(false)
            setInConfirmation(false)
            await addNewChatBotResponse('Leaving confirmation mode...')
            await addNewChatBotResponse('Back to normal! What would you like to do next?')
            return
        }

        if (!confirmationPrompts.includes(input.toLowerCase())) {
            await addNewChatBotResponse('Your confirmation is not clear enough, please try again.')
            return
        }
        switch (inputType) {
            case 'AddTask':
                await addNewTask()

                const addTaskSuccessMessage = 'Task has been successfully added!'
                await addNewChatBotResponse(addTaskSuccessMessage)
                break
            
            case 'DeleteTask':
                console.log('tasks, ', tasks[index], index)
                const taskId = tasks[index - 1].id
                await deleteTask(taskId)
                const deleteTaskSuccessMessage = 'Task has been successfully deleted!'
                await addNewChatBotResponse(deleteTaskSuccessMessage)
        }
        setInputType('')
        setIndex(0)
        setInConfirmation(false)
    }

    /**
     * Creates a user message instance that will show up in the chat room.
     * @param {string} input Input message from the user.
     */
    const addNewUserMessage = (input) => {
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

    /**
     * @function useEffect
     * @description Initial message from the AI Assistant.
     */
    useEffect(() => {
        const chatRoom = document.getElementById('chatroom')
        chatRoom.innerHTML = ''
        const startingResponse = `Hey${userData.username ? ' ' + userData.username : ''}! How can I help you today?`
        addNewChatBotResponse(startingResponse)
    }, [])

    return (
        <>
            <NavBar />
            <h1>Assistant Window</h1>
            <div className="chatpageContainer">

                <div className="chatroom" id="chatroom">

                </div> 
                
                <div className="chatboxContainer">
                    <input 
                        id="chatbox" 
                        onChange={(e) => setInput(e.target.value)} 
                        value={input} 
                        placeholder="Enter an Input"
                        autoComplete="off"
                        onKeyDown={(e) => {
                            if (e.key == 'Enter') {
                                handleInput()
                            }
                        }}
                        >
                            
                    </input>
                    <button onClick= {() => handleInput()} className="sendButton"></button>
                    <span className="border"></span>
                </div>

            </div>

        </>
    )
}

export default ChatPage