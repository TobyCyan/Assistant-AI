import React, { useState, useEffect} from 'react'
import UserInfo from "./UserInfo.jsx";
import '../../index.css'
import { useNavigate, Link } from 'react-router-dom'
import { useTokenContext } from '../../../TokenContext.jsx';

const NavBar = () => {
    const {token, setToken} = useTokenContext()
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

    const handleTaskBar = () => {
        if (token) {
            return (
            <li>
                <Link to="/tasks" className="navBarLinks">My Tasks</Link>
            </li>
            )
        } else {
            <li>
                <Link to="/login" className="navBarLinks">My Tasks</Link>
            </li>
        }
    }

    return(
        <div className="navBar">
            <div className="navBarLinkBox">
                <ul className="navList">
                    <li><Link to="/" className="navBarLinks">Assistant AI</Link></li>
                    {handleTaskBar()}
                    
                </ul>
            </div>
            <UserInfo/>
        </div>
    )
}

export default NavBar;

