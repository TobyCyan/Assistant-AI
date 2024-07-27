import React from "react";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css"
import { useTokenContext } from "../TokenContext/TokenContext";

/**
 * A React component that displays the page intro.
 * @component
 * @param {function} steps A function that returns the intro steps.
 * @param {boolean} activate Boolean to determine whether or not the IntroElement is activated.
 * @param {function} setActivate Setter function to activate the intro.
 * @param {boolean} hasDoneTutorial Boolean to determine whether the user has done the tutorial.
 * @param {boolean} endIntro Boolean to determine whether to end the intro in the current page.
 * @param {string} page The current page name. 
 * @returns {ReactNode} A React element that renders the intro.
 */
const IntroElement = ({steps, activate, setActivate, hasDoneTutorial, endIntro, page}) => {
    const {tokenStatus, } = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    /**
     * Set the intro at the current page to be finished.
     */
    const quitIntro = () => {
        localStorage.setItem(`finishedIntroAt${page}`, true)
        setActivate(false)
    }

    return (
        <div>
            <Steps 
                enabled={activate}
                steps={steps()}
                initialStep={0}
                options={{
                    tooltipClass: "introToolTip",
                    scrollToElement: true,
                    showStepNumbers: true,
                    tooltipPosition: "auto",
                    exitOnOverlayClick: false,
                    nextToDone: false,
                    exitOnEsc: false,
                }}
                ref={steps => steps}
                onExit={quitIntro}
            />

        </div>
    )
}

export default IntroElement