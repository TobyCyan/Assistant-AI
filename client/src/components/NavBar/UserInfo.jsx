import React, { useState, useEffect, ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import '../../index.css'
import {useNavigate} from "react-router-dom";
import { useTokenContext } from "../TokenContext/TokenContext.jsx";

/**
 * A React component that retrieves the current user data and points to display them.
 * @component
 * @returns {ReactNode} A React element that renders the user's info.
 */
const UserInfo = () => {
    const navigate = useNavigate()

    const {tokenStatus, userInfo} = useTokenContext()
    
    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    /**
     * The current user data and setter function to update it.
     * @type {[string, function]}
     */
    const [userData, setUserData] = userInfo

    /**
     * The current username of the logged in user and setter function to update it.
     * @type {[string, function]}
     */
    const [username, setUsername] = useState('')

    /**
     * The current points of the logged in user and setter function to update it.
     * @type {[string, function]}
     */
    const [points, setPoints] = useState(0)

    /**
     * The Express API URL for this React app.
     * @type {string}
     */
    const expressApiUrl = import.meta.env.REACT_APP_EXPRESS_API_URL

    useEffect(() => {
        if(token) {
            getUserInfo()
        }
    },[token])

    useEffect(() => {
        setUsername(userData?.username)
        setPoints(userData?.points)
    }, [userData]);

    const getUserInfo = async () => {
        const dataToPost = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const res = await fetch(`${expressApiUrl}GetUserInfo`, dataToPost)
            if(res.ok) {
                console.log("UserInfo successfully retrieved")
            } else {
                console.log("Invalid User/Info")
            }

            const data = await res.json()
            if(data) {
                setUserData(data)
                console.log(data)
            }
        } catch (error) {
            console.error('Failed to Fetch User Info!', error)
        }
    }

    /** 
     * Clears token and userData on log out, to login page.
     */
    const onLogOut = () => {
        setToken('')
        setUserData({
            username: null,
            id: null,
            dateOfBirth: null,
            points: null,
        })
        localStorage.removeItem("token")
        navigate("/login")
    }

    /** 
     * To Sign Up Page
     */
    const onSignUp = () => {
        navigate("/SignUp")
    }

    /**
     *  To Profile Page if thereis
     */
    const onProfile = () => {
        if (token) {
            navigate(`/users/${username}`)
        }
    }

    /** 
     * Username, points and log out shown if user logged in, else sign up and login.
     */
    const userBar = () => {
        if (token) {
            return (
                <div className="userInfo">
                    <div className="notification">
                        <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div onClick={onProfile} className="nameAndPoints">
                        <p className="username">{username}</p>
                        <p className="points">{points} pts</p>
                    </div>
                    <button className="navBarBtn" onClick={onLogOut}>Log Out</button>
                </div>
            )
        } else {
            return (
                <div className="userInfo">
                    <button className="navBarBtn" onClick={onLogOut}>Log In</button>
                    <button className="navBarBtn" onClick={onSignUp}>Sign Up</button>
                </div>
            )
        }
    }

    return(
        <>
            {userBar()}
        </>
    )
}
export default UserInfo;