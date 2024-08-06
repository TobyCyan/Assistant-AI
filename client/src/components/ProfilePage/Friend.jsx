import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

/**
 * A React component that displays a friend's information.
 * @component
 * @param {string} username The friend's username.
 * @param {number} points The friend's points. 
 * @returns {ReactNode} The React element that renders a friend's information.
 */
const Friend = ({username, points}) => {
    const navigate = useNavigate()

    return (
        <li>
            <div key={username} className="friend">
                <div className="friendInnerBox">
                    <div onClick={() => navigate(`/users/${username}`)} className="nameAndPointsBox">
                        <div className="friendName">
                            {username}
                        </div>
                        <div className="friendPoints">
                            {points} pts
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}

export default Friend