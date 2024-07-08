import {useTokenContext} from "../TokenContext/TokenContext.jsx";
import React from "react";

const RequestModal = ({request, type, getAllFriends, getAllFriendRequests, onClose}) => {
    const {tokenStatus, userInfo} = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    const handleConfirm = () => {
        if(type === "accept") {
            acceptFriendRequest()
        } else {
            deleteFriendRequest()
        }
    }

    /*
    const createFriendRequest = async () => {
        const dataToPost = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const res = await fetch(`http://localhost:5001/${request.name}`, dataToPost)
            if(res.ok) {
                console.log(`Friend request successfully sent!`)
            }
            getAllFriendRequests()
            onClose()
        } catch (error) {
            console.error('Failed to send friend request!', error)
        }
    */

    const acceptFriendRequest = async () => {
        const dataToPost = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const res = await fetch(`http://localhost:5001/requests/${request.name}`, dataToPost)
            if(res.ok) {
                console.log(`Friend request successfully sent!`)
            }
            getAllFriends()
            getAllFriendRequests()
            onClose()
        } catch (error) {
            console.error('Failed to send friend request!', error)
        }
    }


    const deleteFriendRequest = async () => {
        const dataToPost = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const res = await fetch(`http://localhost:5001/requests/${request.name}`, dataToPost)
            if(res.ok) {
                console.log(`Friend request successfully sent!`)
            }
            getAllFriendRequests()
            onClose()
        } catch (error) {
            console.error('Failed to send friend request!', error)
        }
    }

    return (
        <div className="requestContainer">
            <button className="closeSmallModalBtn" onClick={onClose}></button>
            <div></div>
            <div className="confirmMessage">{`${type ==="delete" ? "Reject" : "Accept"} ${request?.name}'s friend request?`}</div>
            <button className="confirmRequestButton" onClick={handleConfirm}>{type ==="delete" ? "REJECT" : "ACCEPT"}</button>
        </div>
    )
}

export default RequestModal;