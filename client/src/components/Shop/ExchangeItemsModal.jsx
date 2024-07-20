import {useTokenContext} from "../TokenContext/TokenContext.jsx";
import React from "react";

const ExchangeItemsModal = ({itemData, onClose, getUserInfo, getUserItems}) => {
    const {tokenStatus, userInfo} = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    const handleConfirm = () => {
        exchangeItems()
    }

    /**
     * Async method to exchange items for points
     *
     */
    const exchangeItems = async() => {
        const dataToPost = {
            method: 'POST',
            body: JSON.stringify(itemData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const res = await fetch('http://localhost:5001/CreateUserItem', dataToPost)
            if(res.ok) {
                console.log('Item exchange successfully sent')
            }
            getUserInfo()
            getUserItems()
            onClose()
        } catch (error) {
            console.error('Failed to obtain item!', error)
        }
    }

    return (
        <div className="exchangeContainer">
            <button className="closeSmallModalBtn" onClick={onClose}></button>
            <div></div>
            <div className="exchangeMessage">{`Exchange ${itemData?.points} points for ${itemData?.title}?`}</div>
            <button className="confirmExchangeButton" onClick={handleConfirm}>EXCHANGE</button>
        </div>
    )
}

export default ExchangeItemsModal;