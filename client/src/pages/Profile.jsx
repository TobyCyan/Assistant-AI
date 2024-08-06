import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useTokenContext } from "../components/TokenContext/TokenContext.jsx";
import { getDDMMYY, startIntro, setHasFinishedIntroAtPage } from "../utilities/utilities.js";
import SearchBar from "../components/ProfilePage/SearchBar.jsx";
import FriendReqsBox from "../components/ProfilePage/FriendReqsBox.jsx";
import FriendsBox from "../components/ProfilePage/FriendsBox.jsx";
import Modal from "react-modal";
import RequestModal from "../components/ProfilePage/RequestModal.jsx";
import IntroElement from "../components/IntroElements/IntroElement.jsx";
import ItemCollectionBox from "../components/ProfilePage/ItemCollectionBox";
import { Items, isIconOwned } from "../utilities/ShopItemUtilities.js";

const Profile = () => {
    const navigate = useNavigate()

    const {tokenStatus, userInfo, userIcon} = useTokenContext()
    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, ] = tokenStatus

    /**
     * The current user data and setter function to update it.
     * @type {[Object, function]}
     */
    const [userData, ] = userInfo
    const {username} = useParams()
    const [displayUser, setDisplayUserInfo] = useState(null)

    /**
     * The current user profile icon string.
     * @type {[string, ]}
     */
    const [profileIcon, setProfileIcon] = userIcon
    const [icon, setIcon] = useState(null)

    /**
     * The list of items user has where itemId matches the index.
     * @type {[Array, function]}
     */
    const [displayUserItems, setDisplayUserItems] = useState([])

    /**
     * The initial state of activating the intro and setter function to update it.
     * @type {[boolean, function]}
     */
    const [activateIntro, setActivateIntro] = useState(false)

    /**
     * The name of the current page.
     * @type {string}
     */
    const page = "Profile"

    /**
     * The Express API URL for this React app.
     * @type {string}
     */
    const expressApiUrl = import.meta.env.VITE_EXPRESS_API_URL

    /**
     * The steps for the webpage intro.
     * @returns {Array<Object>} An array of objects that specify the element to highlight or the intro value.
     */
    const introSteps = () => [
        {
            intro: "Welcome to your Profile!"
        },
        {
            element: ".userProfileBox",
            intro: "This section shows your information that I have taken note when you signed up!"
        },
        {
            element: ".profilePic",
            intro: "This is your profile picture which you may set up yourself!"
        },
        {
            element: ".profileUsernameBox",
            intro: "Your name is right here! I think I got the spelling right..."
        },
        {
            element: ".profilePointsBox",
            intro: "This is the total amount of points you currently have. Be sure to do your tasks on time to get more!"
        },
        {
            element: ".profileDateOfBirthBox",
            intro: "Your special day! Be prepared for a surprise when it comes~"
        },
        {
            element: ".itemCollectionBox",
            intro: "This is your item collection box! Items that you have exchanged for will appear here!"
        },
        {
            element: ".socialBox",
            intro: "Next up, here is your social box!"
        },
        {
            element: ".friendsContainer",
            intro: "You can make friends and see their profiles here!"
        },
        {
            element: ".friendRequestsContainer",
            intro: "If someone sends you a friend request, it will show up here where you can choose to accept, or reject it!"
        },
        {
            element: ".friendRequestsContainer",
            intro: "I think making friends is very important~"
        },
        {
            element: ".searchBarBox",
            intro: "You may use this search bar here to search for a friend to add!"
        },
        {
            intro: "That sums up my intro! Hope you enjoy your time here!"
        },
    ]

    /**
     * @function useEffect
     * @description Sets a time out which waits for a certain duration before automatically starting the intro if the user has not done the intro.
     */
    useEffect(() => {
        startIntro(userData, setActivateIntro, page)
    }, [userData])

    useEffect(() => {
        setHasFinishedIntroAtPage(page)
    }, [])

    const[requestModalOpen, setRequestModalOpen] = useState({
        isShown: false,
        type: "accept",
        data: null,
    })

    /*
    const[friends, setFriends] = useState([{
        name: "Test",
        points: 0},
        {
            name: "Test2",
            points: 1},
    ])

     */

    /*
    const[friendReqs, setFriendReqs] = useState([{
        name: "Test",
        points: 0},
        {
            name: "Test2",
            points: 1
        },
    ])
     */

    const[friends, setFriends] = useState([])
    const[friendReqs, setFriendReqs] = useState([])
    const[sentReqs, setSentReqs] = useState([])


    /**
     * Opens the modal to create the  friend request.
     * @param {Object} taskData Data of the selected task to delete.
     */
    /*
    const handleNewFriendRequest = (requestData) => {
        setRequestModalOpen({
            isShown: true,
            type: "add",
            data: requestData,
        })
    }
    */

    /**
     * Opens the modal to accept the friend request.
     * @param {Object} requestData Data of the selected task to complete.
     */
    const handleAcceptFriendRequest = (requestData) => {
        setRequestModalOpen({
            isShown: true,
            type: "accept",
            data: requestData,
        })
    }

    /**
     * Opens the modal to delete the friend request.
     * @param {Object} requestData Data of the selected task to uncomplete.
     */
    const handleDeleteFriendRequest = (requestData) => {
        setRequestModalOpen({
            isShown: true,
            type: "delete",
            data: requestData,
        })
    }

    /**
     * Closes the friend request modal.
     */
    const closeRequestModal = () => {
        setRequestModalOpen({
            isShown: false,
            type: "accept",
            data: null,
        })
    }

    const getUserDataByUsername = async () => {
        try {
            const response = await fetch(`${expressApiUrl}user/${username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("User not found");
            }

            const data = await response.json();
            setDisplayUserInfo(data.userDetails);
            setDisplayUserItems(data.userItems);
            await importIcon(data.userItems);
        } catch (err) {
            console.log(`Error getting by username`)
        }
    }


    const getUserFriends = async () => {
        try {
            const res = await fetch(`${expressApiUrl}Friends`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if(!res.ok) {
                throw new Error("Friend cannot be retrieved")
            }

            const data = await res.json()
            // console.log("Array" + data.friends)
            setFriends(data.friends)
            // console.log(friends)
        } catch (err) {
            console.log("Error getting user friends")
        }
    }

    const getUserFriendRequests = async () => {
        try {
            const res = await fetch(`${expressApiUrl}FriendRequests`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if(!res.ok) {
                throw new Error("Requests cannot be retrieved")
            }

            const data = await res.json()
            setFriendReqs(data.receivedRequests)
            setSentReqs(data.sentRequests)
            // console.log(friendReqs)
            // console.log(sentReqs)
            // console.log("Successfully retrieved friend reqs!")
        } catch (err) {
            console.log("Error getting user friend requests")
        }
    }


    const createFriendRequest = async () => {
        try {
            const res = await fetch(`${expressApiUrl}requests/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if(res.ok) {
                console.log(`Friend request successfully sent!`)
            }
            getUserFriendRequests()
        } catch (err) {
            console.log("Error sending friend request")
        }
    }

    useEffect(() => {
        if (token) {
            getUserFriends()
            getUserFriendRequests()
        }
    }, [])

    useEffect(() => {
        if (token) {
            getUserDataByUsername()
            getUserFriends()
            getUserFriendRequests()
        }
    }, [username, userData, token]);

    /**
     * @function useEffect
     * @description Updates the icon whenever a new one is equipped.
     */
    useEffect(() => {
        const updateIcon = async () => {
            const icon = await import(`../AppImages/Profile Icons/${profileIcon}.png`)
            setIcon(icon.default)
        }
        updateIcon()
    }, [profileIcon])

    /**
     * Imports the user's profile icon.
     * @param {Array<Object>} items The list of items owned by the user.
     */
    const importIcon = async (items) => {
        try {
            /**
             * The list of items owned by the user based on the itemId.
             * @type {Array<Object>}
             */
            const mappedItems = [...items].map(each => Items[each.itemId-1])
            const storageIcon = localStorage.getItem("profileIcon")
            if (storageIcon && isIconOwned(storageIcon, mappedItems)) {
                const icon = await import(`../AppImages/Profile Icons/${storageIcon}.png`)
                setIcon(icon.default)
                setProfileIcon(storageIcon)
                localStorage.setItem("profileIcon", storageIcon)
            } else {
                const defaultName = "Default"
                const icon = await import(`../AppImages/Profile Icons/${defaultName}.png`)  
                setIcon(icon.default)
                setProfileIcon(defaultName)
                localStorage.setItem("profileIcon", defaultName)
            }  
        } catch (err) {
            console.error("Failed to Import Icon: ", err.message)
        }
    }

    const isUser = displayUser?.username === userData?.username
    const isFriend = friends.some(friend => friend.name === username)
    const requestFrom = friendReqs.some(request => request.name === username)
    const requestSent = sentReqs.some(request => request.name === username)

    const acceptRequest = (
        <button onClick={() => handleAcceptFriendRequest(friendReqs.find(request => request.name === username))}>Accept Request</button>
    )

    const addFriend = (
        <button onClick={createFriendRequest}>Add Friend</button>
    )

    /*
    const updateProfileDetails = (
        <button onClick={()=>navigate("/updateprofile")}>Update Profile</button>
    )
    */

    return (
        <>
            <NavBar/>
            <IntroElement steps={introSteps} activate={activateIntro} setActivate={setActivateIntro} hasDoneTutorial={userData.hasDoneTutorial} endIntro={true} page={page} />
            <div className="profileContainer">
                <div className="profileInnerBox">
                    <div className="userProfileBox">
                        <SearchBar />

                        <div className="userDetailsBox">
                            <div className="friendStatus">
                                {isUser ? (<p>Profile</p>) : isFriend ? (<p>Friends</p>) : requestSent ? (<p>Friend Request Sent</p>) : requestFrom ? acceptRequest : addFriend}
                            </div>
                            <div className="profilePic">
                               { icon ? <img src={icon} /> : <p>Loading Icon...</p>} 
                            </div>
                            <div className="profileUsernameBox">
                                {displayUser?.username}
                            </div>
                            <div className="profilePointsBox">
                                {displayUser?.points} pts
                            </div>
                            <div className="profileDateOfBirthBox">
                                {displayUser && displayUser.dateOfBirth && getDDMMYY(displayUser.dateOfBirth)}
                            </div>
                        </div>

                        <ItemCollectionBox items={displayUserItems}/>

                    </div>
                    <div className="socialBox">
                        <FriendsBox
                            key="Friends"
                            friendsToShow={friends}
                        />
                        <FriendReqsBox
                            key="Friend Requests"
                            friendRequests={friendReqs}
                            onAccept={handleAcceptFriendRequest}
                            onDelete={handleDeleteFriendRequest}
                        />
                    </div>
                </div>
            </div>
            <Modal
                isOpen={requestModalOpen.isShown}
                onRequestClose={() => {
                    closeRequestModal()
                }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    },
                }}
                contentLabel=""
                className="RequestModal"
            >
                <RequestModal
                    request={requestModalOpen.data}
                    type={requestModalOpen.type}
                    onClose={closeRequestModal}
                    getAllFriends={getUserFriends}
                    getAllFriendRequests={getUserFriendRequests}
                />
            </Modal>
        </>
    );

}

export default Profile;