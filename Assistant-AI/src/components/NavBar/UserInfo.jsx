import React from 'react'
import '../../index.css'
import {useNavigate} from "react-router-dom";

const UserInfo = () => {
    const navigate = useNavigate()

    const onLogOut = () => {
        navigate("/login")
    }

    const onSignUp = () => {
        navigate("/SignUp")
    }

    return (
        <div className="userInfo">
            <p>UserName</p>
            <button onClick={onLogOut}>Log In</button>
            <button onClick={onSignUp}>Sign Up</button>
        </div>
    )
}
export default UserInfo;