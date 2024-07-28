import React, { ReactNode, useEffect, useState } from "react";

/**
 * A React component that displays the user's message box.
 * @component
 * @param {string} message The message string to show.
 * @returns {ReactNode} A React element that renders the user's message box.
 */
const UserMessageElement = ({message}) => {
    const [icon, setIcon] = useState(null)

    useEffect(() => {
        importIcon()
    }, [])

    /**
     * Imports the user's profile icon.
     * @param {Array<Object>} items The list of items owned by the user.
     */
    const importIcon = async () => {
        try {
            const storageIcon = localStorage.getItem("profileIcon")
            if (storageIcon) {
                const icon = await import(`../../AppImages/Profile Icons/${storageIcon}.png`)
                setIcon(icon.default)
                localStorage.setItem("profileIcon", storageIcon)
            } else {
                const defaultName = "Default"
                const icon = await import(`../../AppImages/Profile Icons/${defaultName}.png`)  
                setIcon(icon.default)
                localStorage.setItem("profileIcon", defaultName)
            }  
        } catch (err) {
            console.error("Failed to Import Icon: ", err.message)
        }
    }

    return (
        <>
            <div className="messageContainer sendContainer">
                <div className="msgbox send">
                    {message}
                </div>
                <img src={icon} className="chatRoomAvatar" />
            </div>
        </>
    )
}

export default UserMessageElement