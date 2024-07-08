import React from 'react';
import FriendRequest from "./FriendRequest.jsx";

function FriendReqsBox({friendRequests, onAccept, onDelete}) {
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
    );
}

export default FriendReqsBox;