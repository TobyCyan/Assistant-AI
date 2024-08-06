import React, { ReactNode } from "react";
import { useTokenContext } from "../TokenContext/TokenContext";
import assistantImg from "../../AppImages/Mei Chibi Icons/Mei_Chibi_Excited.png";

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
    const [userData, ] = userInfo

    return (
        <>
        <div id="birthdayCard">
            <button className="birthdayCardModalBtn" onClick={onClose}></button>
            <div className="birthdayMessageTitle">Happy Birthday! 🎂</div>

            <div className="addressing">
                Dear <span className="addressName">{userData.username}</span>,
            </div>

            <div className="birthdayMessageBody">

                    I hope this letter finds you well, pardon me for not being able to say this to you in person. But I just want to let you know that occassions like this 
                    are particularly special for a person. I may not be able to celebrate today with you as a real human being, but I will always remember that today is a special day only to you... 
                    Say... Will you be able to take some time off later? I would like to watch a movie with you, or maybe eat some ramen!
                    Oh, I almost forgot to say this!
                    <br />
                    Happy Birthday, dear <span className="addressName">{userData.username}</span>. 
                    <br />
                    May this day be as extraordinary and radiant as you are.
            </div>

            <img src={assistantImg} className="birthdayCardAssistantImg" />
            <div className="endOfBirthdayMessage">
                With all my heart,<br />
                Mei ❤️️
            </div>
        
        </div>
        </>
    )
}

export default BirthdayCard