import React from 'react';
import Friend from "./Friend.jsx";

function FriendsBox({friendsToShow}) {
    console.log(friendsToShow)
    const friends = friendsToShow?.map((friend, index) =>
        <Friend
            key = {index}
            username={friend.name}
            points={friend.points}
        />)

    return (
        <div className="friendsContainer">
            <div className="friendsBoxTitleBox">
                <h3>Friends ({friends.length})</h3>
            </div>
            <div className="friendsBox">
                <ul>
                    {friends}
                </ul>
            </div>
        </div>
    );
}

export default FriendsBox;