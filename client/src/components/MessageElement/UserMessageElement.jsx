import React, { ReactNode } from "react";
import userAvatar from '../../AppImages/arona_wave.png'

/**
 * A React component that displays the user's message box.
 * @component
 * @param {string} message The message string to show.
 * @returns {ReactNode} A React element that renders the user's message box.
 */
const UserMessageElement = ({message}) => {
    return (
        <>
            <div className="messageContainer sendContainer">
                <div className="msgbox send">
                    {message}
                </div>
                <img src={userAvatar} className="chatRoomAvatar" />
            </div>
        </>
    )
}

export default UserMessageElement