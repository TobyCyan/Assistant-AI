import React, {ReactNode} from 'react'
import UserInfo from "./UserInfo.jsx";
import '../../index.css'
import {Link} from 'react-router-dom'
import {useTokenContext} from "../TokenContext/TokenContext.jsx";

/**
 * A React component that displays relevant information on the navigation bar depending on the user state.
 * @component
 * @returns {ReactNode} A React element that renders the navigation bar.
 */
const NavBar = () => {
    const {tokenStatus} = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    return(
        <div className="navBar">
            <div className="navBarLinkBox">
                <ul className="navList">
                    <li><Link to="/" className="navBarLinks">Assistant AI</Link></li>
                    {token && <li><Link to={token ? "/tasks" : "/login"} className="navBarLinks">My Tasks</Link></li>}
                    {token && <li><Link to={token ? "/recurringTasks" : "/login"} className="navBarLinks">Recurring Tasks</Link></li>}
                    {token && <li><Link to={token ? "/shop" : "/login"} className="navBarLinks">Shop</Link></li>}
                </ul>
            </div>
            <UserInfo/>
        </div>
    )
}

export default NavBar;

