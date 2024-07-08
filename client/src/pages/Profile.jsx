import React, {useEffect} from 'react';
import NavBar from "../components/NavBar/NavBar.jsx";
import {useParams} from "react-router-dom";
import {useState} from 'react'
import {useTokenContext} from "../components/TokenContext/TokenContext.jsx";
import {getDDMMYY} from "../utilities/utilities.js";
import SearchBar from "../components/ProfilePage/SearchBar.jsx";
import FriendReqsBox from "../components/ProfilePage/FriendReqsBox.jsx";
import FriendsBox from "../components/ProfilePage/FriendsBox.jsx";
import Modal from 'react-modal';
import CompleteDeleteTasks from "../components/TaskModals/CompleteDeleteTasks.jsx";
import RequestModal from "../components/ProfilePage/RequestModal.jsx";

const Profile = () => {
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
    const {username} = useParams()
    const [displayUser, setDisplayUserInfo] = useState(null)

    const[requestModalOpen, setRequestModalOpen] = useState({
        isShown: false,
        type: "accept",
        data: null,
    })

    /*
    const[friends, setFriends] = useState([{
        name: 'Test',
        points: 0},
        {
            name: 'Test2',
            points: 1},
    ])

     */

    /*
    const[friendReqs, setFriendReqs] = useState([{
        name: 'Test',
        points: 0},
        {
            name: 'Test2',
            points: 1
        },
    ])
     */

    const[friends, setFriends] = useState([])
    const[friendReqs, setFriendReqs] = useState([])
    const[sentReqs, setSentReqs] = useState([])


    /**
     * Opens the modal to create the  friend request.
     * @param {Object} taskData Data of the selected task to delete.
     */
    /*
    const handleNewFriendRequest = (requestData) => {
        setRequestModalOpen({
            isShown: true,
            type: "add",
            data: requestData,
        })
    }
    */

    /**
     * Opens the modal to accept the friend request.
     * @param {Object} requestData Data of the selected task to complete.
     */
    const handleAcceptFriendRequest = (requestData) => {
        setRequestModalOpen({
            isShown: true,
            type: "accept",
            data: requestData,
        })
    }

    /**
     * Opens the modal to delete the friend request.
     * @param {Object} requestData Data of the selected task to uncomplete.
     */
    const handleDeleteFriendRequest = (requestData) => {
        setRequestModalOpen({
            isShown: true,
            type: "delete",
            data: requestData,
        })
    }

    const closeRequestModal = () => {
        setRequestModalOpen({
            isShown: false,
            type: "accept",
            data: null,
        })
    }

    const getUserDataByUsername = async () => {
        try {
            const response = await fetch(`http://localhost:5001/user/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('User not found');
            }

            const data = await response.json();
            setDisplayUserInfo(data);
            console.log(displayUser)
        } catch (err) {
            console.log(`Error getting by username`)
        }
    }


    const getUserFriends = async () => {
        try {
            const res = await fetch('http://localhost:5001/Friends', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if(!res.ok) {
                throw new Error('Friend cannot be retrieved')
            }

            const data = await res.json()
            console.log('Array' + data.friends)
            setFriends(data.friends)
            console.log(friends)
        } catch (err) {
            console.log("Error getting user friends")
        }
    }

    const getUserFriendRequests = async () => {
        try {
            const res = await fetch('http://localhost:5001/FriendRequests', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if(!res.ok) {
                throw new Error('Requests cannot be retrieved')
            }

            const data = await res.json()
            setFriendReqs(data.receivedRequests)
            setSentReqs(data.sentRequests)
            console.log(friendReqs)
            console.log(sentReqs)
            console.log('Successfully retrieved friend reqs!')
        } catch (err) {
            console.log("Error getting user friend requests")
        }
    }


    const createFriendRequest = async () => {
        try {
            const res = await fetch(`http://localhost:5001/requests/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if(res.ok) {
                console.log(`Friend request successfully sent!`)
            }
            getUserFriendRequests()
        } catch (err) {
            console.log("Error sending friend request")
        }
    }


    useEffect(() => {
        if(token) {
            getUserFriends()
            getUserFriendRequests()
        }
    }, [])

    useEffect(() => {
        if(token) {
            getUserDataByUsername()
            getUserFriends()
            getUserFriendRequests()
        }
    }, [username, userData, token]);

    const isUser = displayUser?.username === userData?.username
    const isFriend = friends.some(friend => friend.name === username)
    const requestFrom = friendReqs.some(request => request.name === username)
    const requestSent = sentReqs.some(request => request.name === username)

    let friendStatus = null;

    const acceptRequest = (
        <button onClick={handleAcceptFriendRequest}>Add Friend</button>
)

    const addFriend = (
        <button onClick={createFriendRequest}>Add Friend</button>
    )

    return (
        <>
            <NavBar/>
            <div className="profileContainer">
            <div className="profileInnerBox">
                    <div className="userProfileBox">
                        <div className="profilePic">
                            {/* Add profile picture logic here */}
                        </div>
                        <div className="profileUsernameBox">
                            {displayUser?.username}
                        </div>
                        <div className="profileDateOfBirthBox">
                            {displayUser && displayUser.dateOfBirth && getDDMMYY(displayUser.dateOfBirth)}
                        </div>
                        <div className="profilePointsBox">
                            Points: {displayUser?.points}
                        </div>
                        <div className="friendStatus">
                            {isUser ? null : isFriend ? "Friends" : requestSent ? "Request sent!" : requestFrom ? acceptRequest : addFriend}
                        </div>
                    </div>
                    <div className="socialBox">
                        <SearchBar/>
                        <FriendsBox
                            key="Friends"
                            friendsToShow={friends}
                        />
                        <FriendReqsBox
                            key="Friend Requests"
                            friendRequests={friendReqs}
                            onAccept={handleAcceptFriendRequest}
                            onDelete={handleDeleteFriendRequest}
                        />
                    </div>
                </div>
            </div>
            <Modal
                isOpen={requestModalOpen.isShown}
                onRequestClose={() => {
                    closeRequestModal()
                }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    },
                }}
                contentLabel=""
                className="RequestModal"
            >
                <RequestModal
                    request={requestModalOpen.data}
                    type={requestModalOpen.type}
                    onClose={closeRequestModal}
                    getAllFriends={getUserFriends}
                    getAllFriendRequests={getUserFriendRequests}
                />
            </Modal>
        </>
    );

}

export default Profile;