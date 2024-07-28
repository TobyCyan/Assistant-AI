import React, {useEffect, useState, ReactNode} from "react";
import "../../index.css"
import { useTokenContext } from "../TokenContext/TokenContext";
import { useNavigate } from "react-router-dom";
import { randIntervalGenerator, getRandomVoiceLine } from "../../utilities/utilities";
import { Items, isOutfitOwned } from "../../utilities/ShopItemUtilities";

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
     * The Express API URL for this React app.
     * @type {string}
     */
    const expressApiUrl = import.meta.env.VITE_EXPRESS_API_URL

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
     * @description Gets user data
     */
    useEffect(() => {
        if (userData.username) {
            getUserDataByUsername()
        }
    }, [userData.username])

    /**
     * Gets user info from database
     * @params None
     */
    const getUserDataByUsername = async () => {
        try {
            const response = await fetch(`${expressApiUrl}user/${userData.username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('User not found');
            }

            const data = await response.json()
            await importSprites(data.userItems)

        } catch (err) {
            console.log(`Error getting by username`)
        }
    }

    /**
     * @function useEffect
     * @description Updates the sprite whenever a new one is equipped.
     */
    useEffect(() => {
        const updateSprite = async () => {
            const sprite1 = await import(`../../AppImages/Mei Chibi Icons/${assistantSprite}_Wave.png`)
            const sprite2 = await import(`../../AppImages/Mei Chibi Icons/${assistantSprite}_Wink.png`)
            setWaveSprite(sprite1.default)
            setWinkSprite(sprite2.default)
        }
        updateSprite()
    }, [assistantSprite])

    /**
     * Imports the user's assistant sprites.
     * @param {Array<Object>} items The list of items owned by the user.
     */
    const importSprites = async (items) => {
        try {
            /**
             * The list of items owned by the user based on the itemId.
             * @type {Array<Object>}
             */
            const mappedItems = [...items].map(each => Items[each.itemId-1])
            const storageSprite = localStorage.getItem("assistantSprite")
            if (storageSprite && isOutfitOwned(storageSprite, mappedItems)) {
                const sprite1 = await import(`../../AppImages/Mei Chibi Icons/${storageSprite}_Wave.png`)
                const sprite2 = await import(`../../AppImages/Mei Chibi Icons/${storageSprite}_Wink.png`)
                setWaveSprite(sprite1.default)
                setWinkSprite(sprite2.default)
                localStorage.setItem("assistantSprite", storageSprite)
            } else {
                const defaultName = "Mei_Chibi"
                const sprite1 = await import(`../../AppImages/Mei Chibi Icons/${defaultName}_Wave.png`)
                const sprite2 = await import(`../../AppImages/Mei Chibi Icons/${defaultName}_Wink.png`)
                setWaveSprite(sprite1.default)
                setWinkSprite(sprite2.default)
                localStorage.setItem("assistantSprite", defaultName)
            }  
        } catch (err) {
            console.error("Failed to Import Icon: ", err.message)
        }
    }

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
            // console.log("dialogueBox does not exist.")
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