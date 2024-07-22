import React, { useState, useEffect } from 'react';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css'

const IntroElement = ({steps, activate, setActivate, setActivateReminder}) => {

    const quitIntro = () => {
        setActivate(false)
        if (setActivateReminder) {
            setActivateReminder(true)
        }
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
                }}
                ref={steps => steps}
                onExit={quitIntro}
            />

        </div>
    )
}

export default IntroElement