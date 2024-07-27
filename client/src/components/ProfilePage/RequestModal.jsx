import {useTokenContext} from "../TokenContext/TokenContext.jsx";
import React, { ReactNode } from "react";

/**
 * A React component that displays the friend request modal to carry out operations on the given friend request.
 * @component
 * @param {string} request The friend request string.
 * @param {string} type The type of operation to be done to the friend request.
 * @param {function} getAllFriends The function to get all of the user's friends.
 * @param {function} getAllFriendRequests The function to get the user's friend requests.  
 * @returns {ReactNode} The React element that renders the request modal.
 */
const RequestModal = ({request, type, getAllFriends, getAllFriendRequests, onClose}) => {
    const {tokenStatus, userInfo} = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    /**
     * The Express API URL for this React app.
     * @type {string}
     */
    const expressApiUrl = import.meta.env.REACT_APP_EXPRESS_API_URL

    const handleConfirm = () => {
        if(type === "accept") {
            acceptFriendRequest()
        } else {
            deleteFriendRequest()
        }
    }

    const acceptFriendRequest = async () => {
        const dataToPost = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const res = await fetch(`${expressApiUrl}requests/${request.name}`, dataToPost)
            if (res.ok) {
                // console.log(`Friend request successfully sent!`)
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
            const res = await fetch(`${expressApiUrl}requests/${request.name}`, dataToPost)
            if (res.ok) {
                // console.log(`Friend request successfully sent!`)
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
            <div className="confirmMessage">{`${type === "delete" ? "Reject" : "Accept"} ${request?.name}'s friend request?`}</div>
            <button className="confirmRequestButton" onClick={handleConfirm}>{type ==="delete" ? "REJECT" : "ACCEPT"}</button>
        </div>
    )
}

export default RequestModal;