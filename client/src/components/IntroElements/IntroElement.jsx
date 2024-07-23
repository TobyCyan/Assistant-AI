import React, { useState, useEffect } from 'react';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css'
import { useTokenContext } from '../TokenContext/TokenContext';

/**
 * A React component that displays the page intro.
 * @component
 * @returns {ReactNode} A React element that renders the intro.
 */
const IntroElement = ({steps, activate, setActivate, hasDoneTutorial, endIntro, page}) => {
    const {tokenStatus, } = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    // /**
    //  * Async GET method to get user data.
    //  * @async
    //  * @returns {Promise<void>} A promise that gets the current user"s data.
    //  * @throws {Error} Throws an error if getting user data fails.
    //  */
    // const setUserCompleteTutorial = async () => {
    //     const dataToPost = {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${token}`
    //         }
    //     };

    //     try {
    //         const res = await fetch("http://localhost:5001/SetUserCompleteTutorial", dataToPost)
    //         if (res.ok) {
    //             console.log("Tutorial Completed!")
    //         }
    //     } catch (error) {
    //         console.error("Failed to Complete Tutorial!", error.message)
    //     }
    // }

    /**
     * Set the intro at the current page to be finished.
     */
    const quitIntro = () => {
        localStorage.setItem(`finishedIntroAt${page}`, true)
        setActivate(false)

        // To check how many users have actually finished the intro.
        // if (!hasDoneTutorial && endIntro) {}      
        //     //setUserCompleteTutorial()
        // }
    }

    return (
        <div>
            <Steps 
                enabled={activate}
                steps={steps}
                initialStep={0}
                options={{
                    tooltipClass: 'introToolTip',
                    scrollToElement: true,
                    showStepNumbers: true,
                    tooltipPosition: 'auto',
                    exitOnOverlayClick: false,
                    nextToDone: false,
                    exitOnEsc: false,
                    // skipLabel: '',
                }}
                ref={steps => steps}
                onExit={quitIntro}
            />

        </div>
    )
}

export default IntroElement