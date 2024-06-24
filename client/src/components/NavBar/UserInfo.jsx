import React, { useState, useEffect } from 'react'
import '../../index.css'
import { useNavigate } from "react-router-dom";
import { useTokenContext } from "../TokenContext/TokenContext.jsx";
// import {secretKey} from "../../../../server/Methods/userMethods";

// const jwt = require('jsonwebtoken')

const UserInfo = () => {
    const navigate = useNavigate()

    const {tokenStatus, userInfo, tasksInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const [username, setUsername] = useState('')
    const [points, setPoints] = useState(0)

    useEffect(() => {
        console.log(userData)
        setUsername(userData?.username)
        setPoints(userData?.points)
    }, [userData]);

    const onLogOut = () => {
        setToken('')
        localStorage.removeItem("token")
        console.log(token)
        navigate("/login")
    }

    const onSignUp = () => {
        navigate("/SignUp")
    }

    const userBar = () => {
        if (token) {
            return (
                <div className="userInfo">

                    <div className="nameAndPoints">
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