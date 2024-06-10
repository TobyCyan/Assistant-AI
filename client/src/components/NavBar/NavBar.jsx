import React, { useState, useEffect} from 'react'
import UserInfo from "./UserInfo.jsx";
import '../../index.css'
import { useNavigate, Link } from 'react-router-dom'
import {useTokenContext} from "../TokenContext/TokenContext.jsx";

const NavBar = () => {
    const {tokenStatus, userInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const navigate = useNavigate()

    // To Home Page
    const onHome = () => {
        navigate("/")
    }

    // To Tasks Page
    const onMyTasks = () => {
        navigate("/tasks")
    }

    // To Login Page
    const onLogOut = () => {
        navigate("/login")
    }

    return(
        <div className="navBar">
            <div className="navBarLinkBox">
                <ul className="navList">
                    <li><Link to="/" className="navBarLinks">Assistant AI</Link></li>
                    <li><Link to={token ? "/tasks" : "/login"} className="navBarLinks">My Tasks</Link></li>
                </ul>
            </div>
            <UserInfo/>
        </div>
    )
}

export default NavBar;

