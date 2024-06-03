import React from 'react'
import '../../index.css'
import {useNavigate} from "react-router-dom";

const UserInfo = ({userInfo}) => {
    const navigate = useNavigate()

    const onLogOut = () => {
        navigate("/login")
    }

    const onSignUp = () => {
        navigate("/SignUp")
    }

    if(!userInfo) {
        return(
            <div className="userInfo">
                <p>User Name</p>
                <button onClick={onLogOut} className="navBarBtn">Log Out</button>
            </div>
        )
    } else {
        return (
            <div className="userInfo">
                <button onClick={onLogOut} className="navBarBtn">Login</button>
                <button onClick={onSignUp} className="navBarBtn">Sign Up</button>
            </div>
        )
    }
}
export default UserInfo;