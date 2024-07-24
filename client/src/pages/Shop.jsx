import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import { Items, startIntro, setHasFinishedIntroAtPage } from "../utilities/utilities";
import ItemBox from "../components/Shop/ItemBox";
import { useTokenContext } from "../components/TokenContext/TokenContext";
import Modal from "react-modal";
import ExchangeItemsModal from "../components/Shop/ExchangeItemsModal";
import IntroElement from "../components/IntroElements/IntroElement";

const Shop = () => {
    const {tokenStatus, userInfo} = useTokenContext()
    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, ] = tokenStatus

    /**
     * The current user data and setter function to update it.
     * @type {[Object, function]}
     */
    const [userData, setUserData] = userInfo

    /**
     * The list of items user has where itemId matches the index.
     * @type {[Array, function]}
     */
    const [userItems, setUserItems] = useState(new Array(Items.length).fill(false))

    /**
     * The current state of exchangeModal and setter function to update it.
     * @type {[Object, function]}
     */
    const[exchangeModalOpen, setExchangeModalOpen] = useState({
        isShown: false,
        data: null,
    })

    /**
     * The initial state of activating the intro and setter function to update it.
     * @type {[boolean, function]}
     */
    const [activateIntro, setActivateIntro] = useState(false)

    /**
     * The name of the current page.
     * @type {string}
     */
    const page = "Shop"

    /**
     * The Express API URL for this React app.
     * @type {string}
     */
    const expressApiUrl = process.env.REACT_APP_EXPRESS_API_URL

    /**
     * The steps for the webpage intro.
     * @returns {Array<Object>} An array of objects that specify the element to highlight or the intro value.
     */
    const introSteps = () => [
        {
            intro: "Welcome to the Shop!"
        },
        {
            element: ".itemBox",
            intro: "This is where an item like this will be displayed for sale."
        },
        {
            element: ".itemTitle",
            intro: "This is the name of the item."
        },
        {
            element: ".itemPoints",
            intro: "Here is the price of the item in terms of points!"
        },
        {
            element: ".exchangeButton",
            intro: "To exchange for the item, simply click on this button."
        },
        {
            element: ".exchangeButton",
            intro: "Once you have successfully exchanged for the item, it would show as Obtained and you will not be allowed to exchange for it again!"
        },
        {
            element: ".nameAndPoints",
            intro: "Last but not least, let's go to your Profile!"
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

    const handleExchange = (item) => {
        // To receive data
        setExchangeModalOpen({
            isShown: true,
            data: item,
        })
    }

    const closeExchangeModal = () => {
        setExchangeModalOpen({
            isShown: false,
            data: null,
        })
    }
    /**
     * Async GET method to get user info.
     * @async
     * @returns {Promise<void>} A promise that gets the current user"s info.
     * @throws {Error} Throws an error if getting user info fails.
     */
    const getUserInfo = async () => {
        const dataToPost = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        try {
            const res = await fetch(`${expressApiUrl}GetUserInfo`, dataToPost)
            if(res.ok) {
                console.log("UserInfo successfully retrieved")
            } else {
                console.log("Invalid User/Info")
            }

            const data = await res.json()
            if(data) {
                setUserData(data)
            }
        } catch (error) {
            console.error("Failed to Fetch User Info!", error)
        }
    }


    const getUserItems = async () => {
        const dataToPost = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        try {
            const res = await fetch(`${expressApiUrl}Items`, dataToPost)
            if(res.ok) {
                console.log("User Items successfully retrieved")
            } else {
                console.log("Invalid User/Info")
            }

            const data = await res.json()
            if(data) {
                console.log(data)
                console.log(data.items)
                const {items} = data
                const newItems = userItems.slice()
                items.forEach((element, index) => {
                    newItems[element.itemId-1] = true
                })
                setUserItems(newItems)
                // use slicing
            }
        } catch (error) {
            console.error("Failed to Fetch User Items!", error)
        }
    }

    // Call get user info if there is a token
    useEffect(() => {
        if(token) {
            getUserInfo()
            getUserItems()
        }
    }, [token])

    const itemsInGrid = (
        <div className="itemsGridBox">
            {Items.map((item, index) => (
                <ItemBox
                    key = {index}
                    item={item}
                    isObtained={userItems[index]}
                    onExchange={() => handleExchange(item)}
                />
            ))}
        </div>
    )

    return (
        <>
            <NavBar />
            <IntroElement steps={introSteps} activate={activateIntro} setActivate={setActivateIntro} hasDoneTutorial={userData.hasDoneTutorial} endIntro={false} setUserData={setUserData} page={page} />
            <div className="shopPageContainer">
                {itemsInGrid}
            </div>
            <Modal
                isOpen={exchangeModalOpen.isShown}
                onRequestClose={() => {
                    closeExchangeModal()
                }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                    },
                }}
                contentLabel=""
                className="CompDelTaskModal"
            >
                <ExchangeItemsModal
                    itemData={exchangeModalOpen.data}
                    onClose={closeExchangeModal}
                    getUserInfo={getUserInfo}
                    getUserItems={getUserItems}
                />
            </Modal>
        </>

    )
}

export default Shop