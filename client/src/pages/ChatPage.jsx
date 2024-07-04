import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar/NavBar.jsx";
import { useTokenContext } from "../components/TokenContext/TokenContext";
import getCurrentPositionWeather from "../../../ChatBot/static/API Calls/weather";
import AIBox from "../components/AIBox/AIBox.jsx";

const ChatPage = () => {
    const [chatting, setChatting] = useState(false)
    const [input, setInput] = useState('')
    const [response, setResponse] = useState('Arona is thinking...')
    const {tokenStatus, userInfo, userTasks} = useTokenContext()
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
    * POST Request to Chat with the Assistant.
    * @async
    * @returns {Promise<void>} A promise that returns a response.
    * @throws {Error} Throws an error if chatting fails.
    */
    const handleInput = async () => {
        if (removeSpaces(input) != '') {
            setChatting(true)

            const model = 'model.tflearn'
            const dataToPost = {
                method: 'POST',
                body: JSON.stringify({input, model}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
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
                setResponse(output)
                setInput('')
                console.log('Response Type: ' + reply.type)
                if (reply.code_name) {
                    handleCodeName(reply.code_name)
                }
            })
            .catch(err => {
                console.error('Error Getting a Response: ', err.message)
            })
        }
    }

    const handleCodeName = async (code_name) => {
        console.log('handling: ' + code_name)
        if (code_name == 'Weather') {
            const weatherResponse = await getCurrentPositionWeather()
            console.log(weatherResponse)
            setResponse(prev => prev + weatherResponse)
        }
    }
    
    

    return (
        <>
            <NavBar />
            <h1>Arona???</h1>

            <label className="container">
                <input 
                    id="chatbox" 
                    onChange={(e) => setInput(e.target.value)} 
                    value={input} 
                    placeholder="Enter an Input"
                    onKeyDown={(e) => {
                        if (e.key == 'Enter') {
                            handleInput()
                        }
                    }}
                    >
                </input>
                <span className="border"></span>
            </label>

            <AIBox response={response} setResponse={setResponse} chatting={chatting} setChatting={setChatting}/>

        </>
    )
}

export default ChatPage