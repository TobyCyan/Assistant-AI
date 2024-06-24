import React, { useState, useEffect} from 'react'
import UserInfo from "./UserInfo.jsx";
import '../../index.css'
import { useNavigate, Link } from 'react-router-dom'
import {useTokenContext} from "../TokenContext/TokenContext.jsx";

const NavBar = () => {
    const {tokenStatus, userInfo, tasksInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = tasksInfo
    const navigate = useNavigate()

    // To Home Page
    const onHome = () => {
        navigate("/")
    }

    // To Tasks Page
    const onMyTasks = () => {
        navigate("/tasks")
    }

    return(
        <div className="navBar">
            <div className="navBarLinkBox">
                <ul className="navList">
                    <li><Link to="/" className="navBarLinks">Assistant AI</Link></li>
                    <li><Link to={token ? "/tasks" : "/login"} className="navBarLinks">My Tasks</Link></li>
                    <li><Link to={token ? "/reminder" : "/login"} className="navBarLinks">Reminder</Link></li>
                </ul>
            </div>
            <UserInfo/>
        </div>
    )
}

export default NavBar;

