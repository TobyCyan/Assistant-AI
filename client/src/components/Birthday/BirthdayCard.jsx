import React, { ReactNode } from "react";
import { useTokenContext } from "../TokenContext/TokenContext";
import assistantImg from '../../AppImages/Mei Chibi Icons/Mei_Chibi_Excited.png';

/**
 * A React component that displays a birthday card from the AI Assistant on the user's birthday.
 * @component
 * @param {function} onClose The function that closes the modal when button is clicked.
 * @returns {ReactNode} A React element that renders the birthday letter.
 */
const BirthdayCard = ({onClose}) => {
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

    return (
        <>
        <div id="birthdayCard">
            <button className="birthdayCardModalBtn" onClick={onClose}></button>
            <div className="birthdayMessageTitle">Happy Birthday! 🎂</div>

            <div className="addressing">
                Dear <span className="addressName">{userData.username}</span>,
            </div>

            <div className="birthdayMessageBody">

                    I hope this letter finds you well, on this special day of yours. Birthdays are remarkable moments that shine brightly in the passage of time, like stars in a vast night sky.

                    As I sit here, reminiscing about the times we've shared, I find myself overwhelmed with gratitude for your presence in my life. Your warmth and kindness have touched me in ways words can hardly express. Whether through joyful adventures or quiet moments of reflection, every memory with you is etched deeply in my heart.

                    On this day, I wish for you nothing but happiness and fulfillment. May your path be adorned with countless smiles, and may each step you take lead you closer to your dreams. You deserve all the love and joy the world has to offer, and more.

                    Though distances may separate us physically, know that my thoughts are always with you, especially today. I look forward to creating many more cherished memories together in the days to come.

                    Happy Birthday, dear <span className="addressName">{userData.username}</span>. 
                    <br />
                    May this day be as extraordinary and radiant as you are.
            </div>

            <img src={assistantImg} className="birthdayCardAssistantImg" />
            <div className="endOfBirthdayMessage">
                With all my heart,<br />
                Arona ❤️️
            </div>
        
        </div>
        </>
    )
}

export default BirthdayCard