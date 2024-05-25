import React from 'react'
import UserInfo from "./UserInfo.jsx";
import '../../index.css'
import { Link } from 'react-router-dom'
import {useNavigate} from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate()

    const onHome = () => {
        navigate("/")
    }

    const onMyTasks = () => {
        navigate("/tasks")
    }

    const onLogOut = () => {
        navigate("/login")
    }

    return(
        <div className="navBar">
            <div className="navBarLinkBox">
                <ul className="navList">
                    <li><Link to="/" className="navBarLinks">Assistant AI</Link></li>
                    <li><Link to="/tasks" className="navBarLinks">My Tasks</Link></li>
                </ul>
            </div>
            <UserInfo/>
        </div>
    )
}

export default NavBar;

