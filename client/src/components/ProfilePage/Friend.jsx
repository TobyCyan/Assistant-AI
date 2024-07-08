import React from 'react';
import {getDDMM} from "../../utilities/utilities.js";
import {useNavigate} from "react-router-dom";

function Friend({username, points}) {
    const navigate = useNavigate()

    return (
        <li>
            <div key={username} className="friend">
                <div className="friendInnerBox">
                    <div onClick={() => navigate(`/${username}`)} className="nameAndPointsBox">
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
    );
}

export default Friend;