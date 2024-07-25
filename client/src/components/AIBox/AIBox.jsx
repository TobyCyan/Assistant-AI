import React, {useEffect, useState, ReactNode} from "react";
import "../../index.css"
import { useTokenContext } from "../TokenContext/TokenContext";
import { useNavigate } from "react-router-dom";
import { randIntervalGenerator, getRandomVoiceLine } from "../../utilities/utilities";
// import { importSprites } from "../../utilities/SpriteUtilities";

/**
 * A React component that displays the region where the AI assistant can be seen, this includes the assistant itself and any dialogues.
 * @component
 * @returns {ReactNode} A React element that renders the AI assistant.
 */
const AIBox = () => {
    const { userInfo, tokenStatus, meiSprite } = useTokenContext()
    const [assistantSprite, ] = meiSprite
    const [token, ] = tokenStatus

    const [waveSprite, setWaveSprite] = useState(null)
    const [winkSprite, setWinkSprite] = useState(null)

    const navigate = useNavigate()

    /**
     * The current user data and setter function to update it.
     * @type {[Object, function]}
     */
    const [userData, setUserData] = userInfo

    /**
     * The current dialogue in the chat bubble and setter function to update it.
     * @type {[string, function]}
     */
    const [dialogue, setDialogue] = useState("")

    /**
     * The minimum time for the random interval in milliseconds.
     * @type {number}
     */
    const minInterval = 8000

    /**
     * The maximum time for the random interval in milliseconds.
     * @type {number}
     */
    const maxInterval = 12000

    /**
     * Array of voice lines that can be said by the Assistant at the home page.
     * @type {Array<string>}
     */
    const voiceLines = [
        "Hello!",
        "Got something you want me to do for you?",
        "How can I help you today?",
        "Today is another day to be productive!",
        "You look tired, want me to sing a song for you?",
        "Don't forget to get your tasks done on time!",

    ]
    

    /**
     * @function useEffect
     * @description Sets the welcome message.
     */
    useEffect(() => {
        setDialogue(`Welcome Back! ${ userData.username ? userData.username : ""}`)
    }, [userData])

    /**
     * @function useEffect
     * @description Imports the necessary sprites based on the current sprite type.
     */
    useEffect(() => {
        const importSprites = async () => {
            try {
                const sprite1 = await import(`../../AppImages/Mei Chibi Icons/${assistantSprite}_Wave.png`)
                const sprite2 = await import(`../../AppImages/Mei Chibi Icons/${assistantSprite}_Wink.png`)
                setWaveSprite(sprite1.default)
                setWinkSprite(sprite2.default)
            } catch (err) {
                console.error("Failed to Import Sprites: ", err.message)
            }
        }
        importSprites()
    }, [token, assistantSprite])

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
        const dialogueBox = document.getElementById("assistantDialogue")
        if (dialogueBox) {
            dialogueBox.addEventListener("click", () => {
                setDialogue(getRandomVoiceLine(voiceLines)) 
            })
        } else {
            console.log("dialogueBox does not exist.")
        }
    }, [])

    /**
     * Navigates to the Chat Page to chat with the AI Assistant.
     */
    const toAssistantWindow = () => {
        navigate("/chatpage")
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
                    { waveSprite ?  <img src={waveSprite} className="assistantAvatar wave" onClick={toAssistantWindow}/> : <div>Loading Image...</div> }
                    { winkSprite ? <img src={winkSprite} className="assistantAvatar wink" onClick={toAssistantWindow}/> : <div>Loading Image...</div> }
                </div>
                <div className="instructionText">Click on me to chat!</div>
            </div>
        </>
    )
}

export default AIBox