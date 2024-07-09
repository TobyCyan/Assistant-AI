import React, { useEffect, useState, ReactNode } from "react";
import '../../index.css'
import voice_lines from "../../../../ChatBot/static/js/medium";
import { useTokenContext } from "../TokenContext/TokenContext";
import avatarImg from '../../../../images/TempAvatar.png'

/**
 * A React component that displays the region where the AI assistant can be seen, this includes the assistant itself and any dialogues.
 * @component
 * @returns {ReactNode} A React element that renders the AI assistant.
 */
const AIBox = ({stylingCondition, response, setResponse, chatting, setChatting, handleDailyReminder}) => {
    const {tokenStatus, userInfo} = useTokenContext()

    /**
     * The current user data and setter function to update it.
     * @type {[Object, function]}
     */
    const [userData, setUserData] = userInfo

    const [dialogue, setDialogue] = useState('')
    const maxInterval = 12000
    const minInterval = 8000
    const len = voice_lines.length

    /**
     * A random interval generator.
     * @returns A random time in milliseconds between the minInterval and maxInterval.
     */
    const randIntervalGenerator = () => {
        return Math.random() * (maxInterval - minInterval) + minInterval
    }

    /**
     * @function useEffect
     * @description Sets the welcome message.
     */
    useEffect(() => {
        setDialogue(`Welcome Back! ${ userData.username ? userData.username : ''}`)
    }, [])

    /**
     * @function useEffect
     * @description If not chatting, sets the AI assistant's chat bubble with a random dialogue at random intervals.
     */
    useEffect(() => {
        if (!chatting) {
            let popUpTimer = setInterval(fetchVoiceLine, randIntervalGenerator())
        
            function fetchVoiceLine() {
                const newRand = randIntervalGenerator()  

                setDialogue(getRandomVoiceLine())

                clearInterval(popUpTimer)
                popUpTimer = setInterval(fetchVoiceLine, newRand) 
            }

            return () => {
                clearInterval(popUpTimer)
            }
        } else {
            setTimeout(handleIdleTimeOut, 10000)
        }
    }, [chatting])

    const handleIdleTimeOut = () => {
        setResponse('Thanks for chatting with me!')
        setTimeout(stopChatting, 5000)
    }  
    
    /**
     * Stops chatting with the assistant.
     */
    const stopChatting = () => {
        setChatting(false)
    }

    /**
     * @function useEffect
     * @description Allows the dialogue in the chat bubble to be manually changed by clicking on it.
     */
    useEffect(() => {
        const AIBox = document.getElementById('AIBox')
        if (AIBox) {
            AIBox.addEventListener('click', () => {
                setChatting(false)
                setDialogue(getRandomVoiceLine()) 
            })
        } else {
            console.log('AIBox does not exist.')
        }
    }, [])

    /**
     * Returns a random voice line from the array.
     * @returns A random voice line.
     */
    function getRandomVoiceLine() {
        const rand_index = Math.floor(Math.random() * len);
        return voice_lines[rand_index]
    }


    return (
        <>
            <div className={stylingCondition}>
                <div className="invisibleBox">
                    <div className="AIBox" id="AIBox">
                        {chatting? response : dialogue}
                    </div>
                </div>

                <div className="assistantAvatarDiv">
                    <img src={avatarImg} id="assistantAvatar" onClick={handleDailyReminder}/>
                </div>
            </div>
        </>
    )
}

export default AIBox