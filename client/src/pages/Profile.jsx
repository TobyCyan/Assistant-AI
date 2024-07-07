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

    const getUserDataByUsername = async () => {
        try {
            const response = await fetch(`http://localhost:5001/user/${username}`, {
                headers: {
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

    useEffect(() => {
        if(token) {
            getUserDataByUsername()
        }
    }, [username, token]);



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
                    </div>
                    <div className="friendsBox">
                        <div className="currentFriendsBox">

                        </div>
                        <div className="friendRequestsBox">

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;