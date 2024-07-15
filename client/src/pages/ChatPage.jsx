import React, { useState, useEffect, ReactNode } from "react";
import NavBar from "../components/NavBar/NavBar.jsx";
import { useTokenContext } from "../components/TokenContext/TokenContext";
import getCurrentPositionWeather from "../../../ChatBot/static/API Calls/weather";
import { addNewChatBotResponse } from "../components/ChatRoom/ChatRoom.jsx";
import UserAvatar from '../AppImages/TempAvatar.png'
import { wait } from "../components/ChatRoom/ChatRoom.jsx";

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

    
    const quitInputs = ['quit', 'q', 'bye', 'stop', 'leave']
    const priorities = ['High', 'Medium', 'Low']
    const confirmationPrompts = ['confirm', 'yes', 'sure', 'okay', 'no problem']

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
        })
        .catch(err => {
            console.error('Error Adding Task: ', err.message)
        })
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
     * Handles the specified response type and pass in an API key if it exists to receive a custom response from the chat bot.
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
                const addTaskFlow = ['title', 'description', 'category', 'deadline', 'priority', 'reminder']
                setInputFlow(addTaskFlow)

                await switchToInputMode(responseType)
                await addNewChatBotResponse('All set! Please start by entering the title of your new task~')
                await addNewChatBotResponse('Please say quit, q, bye, stop, or leave to quit input mode!')
                break
        
            case 'EditTask':
                setTakingInput(true)
                break
            
            case 'DeleteTask':
                setTakingInput(true)
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
            await addNewChatBotResponse('Quitting input mode.')
            await addNewChatBotResponse('Back to normal! What would you like to do next?')
            return
        }
        switch (inputType) {
            case 'AddTask':
                redirectInputToAddTask(input)
                break
        }
    }

    /**
     * Switches to input mode to take user inputs to add to database.
     * @param {string} inputType The input type to switch to.
     * @returns {void} Returns nothing.
     */
    const switchToInputMode = async (inputType) => {
        const inputModeText = 'Entering input mode... Please wait a moment.'

        setTakingInput(true)
        setInputType(inputType)
        await addNewChatBotResponse(inputModeText)
        return
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
            await generateConfirmation()
            return
        }
    }

    const generateConfirmation = async () => {
        setInConfirmation(true)
        await addNewChatBotResponse('Hold on a moment...')
        await wait(1000)
        const summaryText = `Your new task to be added will be: <br>
        Title: ${title} <br>
        Description: ${description} <br>
        Category: ${category} <br>
        Deadline: ${deadline} <br>
        Priority: ${priority} <br> 
        Reminder: ${reminderDate} <br> 
        Would that be okay?`

        const confirmationText = 'Please enter confirm, yes, sure, okay, or no problem to proceed.'
        await addNewChatBotResponse(summaryText)
        await addNewChatBotResponse(confirmationText)
        setIndex(0)
        setTakingInput(false)
    }

    const applyConfirmation = async (input) => {
        if (!confirmationPrompts.includes(input.toLowerCase())) {
            await addNewChatBotResponse('Your confirmation is not clear enough, please try again.')
            return
        }
        switch (inputType) {
            case 'AddTask':
                console.log('adding task')
                addNewTask()
                break
        }
        setInputType('')
        setTakingInput(false)
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