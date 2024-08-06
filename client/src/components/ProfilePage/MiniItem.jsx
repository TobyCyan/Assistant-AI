import React, { ReactNode } from "react";
import { useTokenContext } from "../TokenContext/TokenContext.jsx";

/**
 * A React component that displays the items owned by the user in a small container in the Item Collection section in the Profile page.
 * @component
 * @param {Object} item The item to display in the mini container.
 * @returns {ReactNode} A React element that renders the MiniItem container.
 */
const MiniItem = ({item, isUser}) => {
    const { meiSprite, userIcon, userInfo } = useTokenContext()
    const [assistantSprite, setAssistantSprite] = meiSprite
    const [profileIcon, setProfileIcon] = userIcon

    /**
     * Equips the user item based on the item name in the AppImages folder and its type.
     * @param {string} itemNameInFolder The item name as it is in the AppImages folder.
     * @param {string} itemType The type of the item.
     * @returns {void}
     */
    const onEquip = (itemNameInFolder, itemType) => {
        switch (itemType) {
            case "Assistant Outfit":
                // localStorage.setItem("assistantSprite", itemNameInFolder)
                // setAssistantSprite(itemTitle)
                break
            
            case "Profile Icon":
                localStorage.setItem("profileIcon", itemNameInFolder)
                setProfileIcon(itemNameInFolder)
                break
        }
        return
    }

    return (
        <div className="miniItem">
            <h2 className="miniItemType">{item.type}</h2>
            <img src={item.imageURL} alt={item.title} className="miniItemImage"/>
            {}
            {isUser && <button className="equipButton" onClick={() => onEquip(item.nameInFolder, item.type)}>
                {profileIcon == item.nameInFolder || assistantSprite == item.name ? "Equipped" : "Equip"}
            </button>}
        </div>
    )
}

export default MiniItem