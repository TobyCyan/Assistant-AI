import React, {useEffect, useState, ReactNode} from "react";
import '../../index.css'
import { useTokenContext } from "../TokenContext/TokenContext";
import avatarImgWave from '../../AppImages/Mei Chibi Icons/Mei_Chibi_Wave.png'
import avatarImgWink from '../../AppImages/Mei Chibi Icons/Mei_Chibi_Wink.png'
import { useNavigate } from "react-router-dom";
import { randIntervalGenerator, getRandomVoiceLine } from "../../utilities/utilities";

/**
 * A React component that displays the region where the AI assistant can be seen, this includes the assistant itself and any dialogues.
 * @component
 * @returns {ReactNode} A React element that renders the AI assistant.
 */
const AIBox = () => {
    const {userInfo} = useTokenContext()
    const navigate = useNavigate()

    /**
     * The current user data and setter function to update it.
     * @type {[Object, function]}
     */
    const [userData, setUserData] = userInfo

    const [dialogue, setDialogue] = useState('')
    const maxInterval = 12000
    const minInterval = 8000

    /**
     * Array of voice lines that can be said by the Assistant at the home page.
     * @type {Array<string>}
     */
    const voiceLines = [
        'Hello!',
        'Got something you want me to do for you?',
        'How can I help you today?',
        'Today is another day to be productive!',
        'You look tired, want me to sing a song for you?',
        "Don't forget to get your tasks done on time!",

    ]
    

    /**
     * @function useEffect
     * @description Sets the welcome message.
     */
    useEffect(() => {
        setDialogue(`Welcome Back! ${ userData.username ? userData.username : ''}`)
    }, [userData])

    /**
     * @function useEffect
     * @description If not chatting, sets the AI assistant's chat bubble with a random dialogue at random intervals.
     */
    useEffect(() => {
   
        let popUpTimer = setInterval(fetchVoiceLine, randIntervalGenerator(minInterval, maxInterval))
    
        function fetchVoiceLine() {
            const newRand = randIntervalGenerator(minInterval, maxInterval)  

            setDialogue(getRandomVoiceLine(voiceLines))

            clearInterval(popUpTimer)
            popUpTimer = setInterval(fetchVoiceLine, newRand) 
        }

        return () => {
            clearInterval(popUpTimer)
        }
    
    }, [])

    /**
     * @function useEffect
     * @description Allows the dialogue in the chat bubble to be manually changed by clicking on it.
     */
    useEffect(() => {
        const dialogueBox = document.getElementById('assistantDialogue')
        if (dialogueBox) {
            dialogueBox.addEventListener('click', () => {
                setDialogue(getRandomVoiceLine(voiceLines)) 
            })
        } else {
            console.log('dialogueBox does not exist.')
        }
    }, [])

    /**
     * Navigates to the Chat Page to chat with the AI Assistant.
     */
    const toAssistantWindow = () => {
        navigate('/chatpage')
    }


    return (
        <>
            <div className="AIBoxContainer">
                <div className="assistantDialogueContainer">
                    <div className="assistantDialogue" id="assistantDialogue">
                        {dialogue}
                    </div>
                </div>

                <div className="assistantAvatarDiv">
                    <img src={avatarImgWave} className="assistantAvatar wave" onClick={toAssistantWindow}/>
                    <img src={avatarImgWink} className="assistantAvatar wink" onClick={toAssistantWindow}/>
                </div>
                <div className="instructionText">Click on me to chat!</div>
            </div>
        </>
    )
}

export default AIBox