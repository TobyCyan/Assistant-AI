import React, { useState, useEffect, ReactNode } from "react";
import NavBar from "../components/NavBar/NavBar.jsx";
import { useTokenContext } from "../components/TokenContext/TokenContext";
import getCurrentPositionWeather from "../../../ChatBot/static/API Calls/weather";
import AIBox from "../components/AIBox/AIBox.jsx";
import AIAvatar from '../../../images/arona_wave.png'
import UserAvatar from '../../../images/TempAvatar.png'

/**
 * A React component that displays the page where users can interact and chat with the AI Assistant.
 * @component
 * @returns {ReactNode} A React element that renders the chatbot page.
 */
const ChatPage = () => {
    const [chatting, setChatting] = useState(false)
    const [input, setInput] = useState('')
    const [response, setResponse] = useState('Arona thinks...')
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
        console.log(JSON.stringify(dataToPost))
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
                
                console.log('Response Type: ' + reply.type)
                if (reply.code_name) {
                    handleCodeName(reply.code_name)
                }
            })
            .catch(err => {
                console.error('Error Getting a Response: ', err)
            })
    }

    /** 
    * Handles user chat input and POST Request to Chat with the Assistant.
    * @async
    */
    const handleInput = async () => {
        if (removeSpaces(input) != '') {
            setChatting(true)
            setInput('')
            addNewUserMessage(input)

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
        }
    }

    const handleCodeName = async (code_name) => {
        console.log('handling: ' + code_name)
        if (code_name == 'Weather') {
            const weatherResponse = await getCurrentPositionWeather()
            const createWeatherResponse = response + weatherResponse
            addNewChatBotResponse(createWeatherResponse)
            return
        }
        
        if (code_name == 'AddTask') {
            
            return
        }
        
        if (code_name == 'EditTask') {
            return
        }
        
        if (code_name == 'DeleteTask') {
            return
        }
    }

    /**
     * Creates a user message instance that will show up in the chat room.
     * @param {string} input Input message from the user.
     */
    const addNewUserMessage = (input) => {
        const chatRoom = document.getElementById('chatroom')
        const messageContainer = document.createElement('div')
        messageContainer.classList.add('messageContainer')
        messageContainer.classList.add('sendContainer')

        const profilePicture = document.createElement('img')
        profilePicture.classList.add('chatRoomAvatar')
        profilePicture.setAttribute('src', UserAvatar)

        const newMessage = document.createElement('div')
        newMessage.classList.add('msgbox')
        newMessage.classList.add('send')
        newMessage.innerHTML = input
        messageContainer.appendChild(newMessage)
        messageContainer.appendChild(profilePicture)

        chatRoom.appendChild(messageContainer)
    }

    /**
     * Creates a response message instance that will show up in the chat room.
     * @param {string} response Response message from the AI Assistant.
     */
    const addNewChatBotResponse = (response) => {
        const chatRoom = document.getElementById('chatroom')
        const messageContainer = document.createElement('div')
        messageContainer.classList.add('messageContainer')
        messageContainer.classList.add('receiveContainer')

        const profilePicture = document.createElement('img')
        profilePicture.classList.add('chatRoomAvatar')
        profilePicture.setAttribute('src', AIAvatar)

        const newMessage = document.createElement('div')
        newMessage.classList.add('msgbox')
        newMessage.classList.add('receive')
        newMessage.innerHTML = response
        messageContainer.insertBefore(profilePicture, newMessage.firstElementChild)
        messageContainer.appendChild(newMessage)

        chatRoom.appendChild(messageContainer)
    }

    /**
     * @function useEffect
     * @description Initial message from the AI Assistant.
     */
    useEffect(() => {
        const chatRoom = document.getElementById('chatroom')
        chatRoom.innerHTML = ''
        const startingResponse = `Hey ${userData.username}! How can I help you today?`
        addNewChatBotResponse(startingResponse)
    }, [])

    return (
        <>
            <NavBar />
            <h1>Arona</h1>
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
                    <button onClick= {() => handleInput()}className="sendButton"></button>
                    <span className="border"></span>
                </div>

            </div>

        </>
    )
}

export default ChatPage