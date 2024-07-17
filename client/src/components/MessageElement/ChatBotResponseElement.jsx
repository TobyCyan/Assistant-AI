import React from "react";
import AIAvatar from '../../AppImages/Mei Chibi Icons/Mei_Chibi_Icon.png';

/**
 * A React component that displays the chat bot's response message box.
 * @component
 * @param {string | ReactNode} response A response string or React component to show.
 * @returns {ReactNode} A React element that renders the chat bot's response message box.
 */
const ChatBotResponseElement = ({response}) => {
    return (
        <>
            <div className="messageContainer receiveContainer">
                <img src={AIAvatar} className="chatRoomAvatar" />
                <div className="msgbox receive">
                    {response}
                </div>
            </div>
        </>
    )
}

export default ChatBotResponseElement