import React, { useState, useEffect, ReactNode } from "react";
import NavBar from "../components/NavBar/NavBar.jsx";
import { useTokenContext } from "../components/TokenContext/TokenContext";
import getCurrentPositionWeather from "../../../ChatBot/static/API Calls/weather";
import ChatRoom from "../components/ChatRoom/ChatRoom.jsx";
import { addNewChatBotResponse } from "../components/ChatRoom/ChatRoom.jsx";
import UserAvatar from '../../../images/TempAvatar.png'

/**
 * A React component that displays the page where users can interact and chat with the AI Assistant.
 * @component
 * @returns {ReactNode} A React element that renders the chatbot page.
 */
const ChatPage = () => {
    const [chatting, setChatting] = useState(false)
    const [input, setInput] = useState('')
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
        if (code_name == 'Weather') {
            const weatherResponse = await getCurrentPositionWeather()
            const createWeatherResponse = weatherResponse
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
                    <button onClick= {() => handleInput()}className="sendButton"></button>
                    <span className="border"></span>
                </div>

            </div>

        </>
    )
}

export default ChatPage