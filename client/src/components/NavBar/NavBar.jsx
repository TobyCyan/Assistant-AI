import React, { ReactNode } from "react"
import UserInfo from "./UserInfo.jsx";
import ReminderBell from "./ReminderBell.jsx";
import "../../index.css"
import { Link } from "react-router-dom"
import { useTokenContext } from "../TokenContext/TokenContext.jsx";
import logoImg from "../../AppImages/Mei Chibi Icons/Mei_Chibi_Icon.png";

/**
 * A React component that displays relevant information on the navigation bar depending on the user state.
 * @component
 * @returns {ReactNode} A React element that renders the navigation bar.
 */
const NavBar = ({overduedTasks, remindersTasks, upcomingTasks, priorityTasks}) => {
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
                    <li>
                    <Link to="/" className="navBarLinks"><img src={logoImg} className="navBarLogo" /> abc </Link>
             
                    </li>
                    <li><Link to="/" className="navBarLinks">Assistant MEI</Link></li>
                    {token && <li><Link to={token ? "/tasks" : "/login"} className="navBarLinks navBarMyTasks">My Tasks</Link></li>}
                    {token && <li><Link to={token ? "/recurringTasks" : "/login"} className="navBarLinks navBarRecurringTasks">Recurring Tasks</Link></li>}
                    {token && <li><Link to={token ? "/shop" : "/login"} className="navBarLinks navBarShop">Shop</Link></li>}
                </ul>
            </div>
            <div className="navBarRightContainer">
                {token && <ReminderBell overduedTasks={overduedTasks} remindersTasks={remindersTasks}
                               upcomingTasks={upcomingTasks} priorityTasks={priorityTasks}/>}
                <UserInfo />
            </div>
        </div>
    )
}

export default NavBar;

