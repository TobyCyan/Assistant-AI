import React, { useState, useEffect, ReactNode } from 'react'
import '../../index.css'
import { useNavigate } from "react-router-dom";
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

    useEffect(() => {
        if(token) {
            getUserInfo()
        }
    },[token])

    useEffect(() => {
        console.log(userData)
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
            const res = await fetch('http://localhost:5001/GetUserInfo', dataToPost)
            if(res.ok) {
                console.log("UserInfo successfully retrieved")
            } else {
                console.log("Invalid User/Info")
            }

            const data = await res.json()
            if(data) {
                console.log(data)
                setUserData(data)
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
        console.log(token)
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
            navigate(`/${username}`)
        }
    }

    /** 
     * Username, points and log out shown if user logged in, else sign up and login.
     */
    const userBar = () => {
        if (token) {
            return (
                <div className="userInfo">
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