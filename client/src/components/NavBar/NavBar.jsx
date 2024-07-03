import React, { ReactNode } from 'react'
import UserInfo from "./UserInfo.jsx";
import '../../index.css'
import { useNavigate, Link } from 'react-router-dom'
import {useTokenContext} from "../TokenContext/TokenContext.jsx";

/**
 * A React component that displays relevant information on the navigation bar depending on the user state.
 * @component
 * @returns {ReactNode} A React element that renders the navigation bar.
 */
const NavBar = () => {
    const {tokenStatus, userInfo} = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    /**
     * The current user data and setter function to update it.
     * @type {[Object, function]}
     */
    const [userData, setUserData] = userInfo
    const navigate = useNavigate()

    /**
     * Redirects to Home page.
     */
    const onHome = () => {
        navigate("/")
    }

    /**
     * Redirects to Task page.
     */
    const onMyTasks = () => {
        navigate("/tasks")
    }

    return(
        <div className="navBar">
            <div className="navBarLinkBox">
                <ul className="navList">
                    <li><Link to="/" className="navBarLinks">Assistant AI</Link></li>
                    {token && <li><Link to={token ? "/tasks" : "/login"} className="navBarLinks">My Tasks</Link></li>}
                    {token && <li><Link to={token ? "/reminder" : "/login"} className="navBarLinks">Reminder</Link></li>}
                    {token && <li><Link to={token ? "/ChatPage" : "/login"} className="navBarLinks">Totally Not Arona</Link></li>}
                </ul>
            </div>
            <UserInfo/>
        </div>
    )
}

export default NavBar;

