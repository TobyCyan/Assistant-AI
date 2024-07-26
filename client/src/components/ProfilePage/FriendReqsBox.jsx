import React, { ReactNode } from 'react';
import FriendRequest from "./FriendRequest.jsx";

/**
 * The React component that displays the list of friend requests in a box in the Profile page.
 * @component
 * @param {Array} friendRequests The array of friend requests.
 * @param {function} onAccept The function that accepts the friend request.
 * @param {function} onDelete The function that deletes the friend request.
 * @returns {ReactNode} The react element that renders the friend request box.
 */
const FriendReqsBox = ({friendRequests, onAccept, onDelete}) => {

    const requests = friendRequests?.map((request, index) => (
        <FriendRequest
            key = {index}
            username={request.name}
            points={request.points}
            onAccept={() => onAccept(request)}
            onDelete={() => onDelete(request)}
        />
        )
    )

    return (
        <div className="friendRequestsContainer">
            <div className="friendRequestsBoxTitleBox">
                <h3>Friend Requests ({requests.length})</h3>
            </div>
            <div className="requestsBox">
                <ul>
                    {requests}
                </ul>
            </div>
        </div>
    )
}

export default FriendReqsBox