import React from 'react';
import {getDDMM} from "../../utilities/utilities.js";

function Friend({username, points}) {
    return (
        <li>
            <div key={username} className="friend">
                <div className="friendInnerBox">
                    <div className="nameAndPointsBox">
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