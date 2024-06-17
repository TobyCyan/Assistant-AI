import React, { useState, useEffect } from 'react'
import '../../index.css'
import { useNavigate } from "react-router-dom";
import { useTokenContext } from "../TokenContext/TokenContext.jsx";
// import {secretKey} from "../../../../server/Methods/userMethods";

// const jwt = require('jsonwebtoken')

const UserInfo = () => {
    const navigate = useNavigate()

    const {tokenStatus, userInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const [username, setUsername] = useState('')

    useEffect(() => {
        if (token) {
            // const user = jwt.verify(token, secretKey)
            // setUsername(user)
            console.log('Token Refreshed')
        }
    }, [token])


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
                    <p className="username">{username}</p>
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