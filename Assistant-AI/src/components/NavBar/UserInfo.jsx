import React, { useState, useEffect } from 'react'
import '../../index.css'
import { useNavigate } from "react-router-dom";
import { useTokenContext } from '../../../TokenContext';
// import { secretKey } from '../../../../Methods/userMethods'

// const jwt = require('jsonwebtoken')

const UserInfo = () => {
    const {token, setToken} = useTokenContext()
    const [username, setUsername] = useState('')

    useEffect(() => {
        if (token) {
            // const user = jwt.verify(token, secretKey)
            // setUsername(user)
            console.log('Token Refreshed')
        }
    }, [token])

    const navigate = useNavigate()

    const onLogOut = () => {
        setToken('')
        navigate("/login")
    }

    const onSignUp = () => {
        navigate("/SignUp")
    }

    const handleLoginBar = () => {
        if (token) {
            return (
                <div className="userInfo">
                    <p>{username}</p>
                    <button onClick={onLogOut}>Log Out</button>
                </div>
            )
        } else {
            return (
                <div className="userInfo">
                    <button onClick={onLogOut}>Log In</button>
                    <button onClick={onSignUp}>Sign Up</button>
                </div>
            )
        }
    }

    return (
        <>
        {handleLoginBar()}
        </>
    )
}
export default UserInfo;