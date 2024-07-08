import React, {useEffect} from 'react';
import NavBar from "../components/NavBar/NavBar.jsx";
import TasksBox from "../components/TasksCardsAndBox/TasksBox.jsx";
import ProductivityBar from "../components/ProductivityBar/ProductivityBar.jsx";
import AIBox from "../components/AIBox/AIBox.jsx";
import Modal from "react-modal";
import AddEditTasks from "../components/TaskModals/AddEditTasks.jsx";
import CompleteDeleteTasks from "../components/TaskModals/CompleteDeleteTasks.jsx";
import BirthdayCard from "../components/Birthday/BirthdayCard.jsx";
import {useParams} from "react-router-dom";
import {useState} from 'react'
import {useTokenContext} from "../components/TokenContext/TokenContext.jsx";
import {getDDMMYY} from "../utilities/utilities.js";
import SearchBar from "../components/ProfilePage/SearchBar.jsx";
import FriendReqsBox from "../components/ProfilePage/FriendReqsBox.jsx";
import FriendsBox from "../components/ProfilePage/FriendsBox.jsx";

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

    const[friends, setFriends] = useState([{
        username: 'Test',
        points: 0},
        {
            username: 'Test2',
            points: 1},
    ])
    // const[friends, setFriends] = useState([])
    const[friendReqs, setFriendReqs] = useState([{
        username: 'Test',
        points: 0},
        {
            username: 'Test2',
            points: 1
        },
    ])
    // const[friendReqs, setFriendReqs] = useState([])

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

    /*
    const getUserFriends = async () => {
        try {
            const res = await fetch('http://localhost:5001/user/friends', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if(!res.ok) {
                throw new Error('Friend cannot be retrieved')
            }

            const data = await response.json()
            setFriends(data)
            console.log(friends)
        } catch (err) {
            console.log("Error getting user friends")
        }
    }

     */

    /*
    const getUserFriendReqs = async () => {
        try {
            const res = await fetch('http://localhost:5001/user/requests', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if(!res.ok) {
                throw new Error('Requests cannot be retrieved')
            }

            const data = await response.json()
            setFriendReqs(data)
            console.log(friends)
        } catch (err) {
            console.log("Error getting user friend requests")
        }
    }

     */


    const sendFriendReq = async () => {
        try {
            const response = await fetch(`http://localhost:5001/friendReq/${username}`, {
                method: 'POST',
                body: JSON.stringify(displayUser.id),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        } catch (err) {
            console.log("Error sending friend request")
        }
    }


    useEffect(() => {
        if(token) {
            //getUserFriends()
            //getUserFriendReqs()
        }
    }, [])

    useEffect(() => {
        if(token) {
            getUserDataByUsername()
        }
    }, [username, token]);

    const isUser = displayUser?.username === userData?.username

    // const isFriend =

    const addFriend = (<div className="addFriendBtn">
        <button onClick={sendFriendReq}>Add Friend</button>
    </div>)

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
                        {!isUser && addFriend}
                    </div>
                    <div className="socialBox">
                        <SearchBar/>
                        <FriendsBox friendsToShow={friends}/>
                        <FriendReqsBox
                            friendRequests={friendReqs}
                            onAccept={() => {}}
                            onDelete={() => {}}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;