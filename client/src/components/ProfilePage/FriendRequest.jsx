import React, { ReactNode } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";

/**
 * The React component that displays a friend request container that includes the friend's user information.
 * @component
 * @param {string} username The friend's username.
 * @param {number} points The friend's points. 
 * @param {function} onAccept The function that accepts the friend request.
 * @param {function} onDelete The function that deletes the friend request. 
 * @returns {ReactNode} The React element that renders the friend request container.
 */
const FriendRequest = ({username, points, onAccept, onDelete}) => {
    const navigate = useNavigate()

    return (
        <li>
            <div key={username} className="request">
                <div className="requestInnerBox">
                    <div onClick={() => navigate(`/users/${username}`)} className="nameAndPointsBox">
                        <div className="friendName">
                            {username}
                        </div>
                        <div className="friendPoints">
                            {points} pts
                        </div>
                    </div>

                    <div className="requestActions">
                        <button onClick={onAccept} className="requestAcceptButton">
                            <FontAwesomeIcon icon={faCheck}/>
                        </button>
                        <button onClick={onDelete} className="requestDeleteButton">
                            <FontAwesomeIcon icon={faTimes}/>
                        </button>
                    </div>
                </div>
            </div>
        </li>
    )
        
}

/*
return (
    <li>
        <div key={taskId} className="task">
            <div className="taskInnerBox">
                <div className="titleAndPriorityBox">
                    <div className="taskTitle">
                        <span style={{fontWeight: 'bold'}}>{getDDMM(deadline)}</span> {title}
                    </div>
                    <div className="taskPriorityAndCategory">
                        {priority} | {category}
                    </div>
                </div>

                <div className="taskMsg"></div>
                <div className="taskActions">
                    <button onClick={onEdit} className="taskEditButton">Edit</button>
                    <button onClick={onDelete} className="taskCrossButton"></button>
                    <button onClick={onComplete} className="taskTickButton"></button>
                </div>
            </div>
        </div>
    </li>

 */

export default FriendRequest