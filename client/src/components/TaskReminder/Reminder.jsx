import React, {useEffect, useState, useRef} from "react";
import RecognitionConfig from "./RecognitionConfig";
import NavBar from "../NavBar/NavBar";

export const Reminder = () => {
    const [texts, setTexts] = useState('')
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef(null)

    useEffect(() => {
        window.SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition
        if (!window.SpeechRecognition) {
            console.error('Window Speech Recognition Not Found!', err)
        }

        const recognition = new window.SpeechRecognition()
        recognitionRef.current = recognition
        recognition.interimResults = true;
        recognition.lang = 'en-US' || RecognitionConfig.lang
        recognition.continuous = false || RecognitionConfig.continuous

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
        };

        if (isListening) {
            console.log('listening')
            recognitionRef.current.start()
            recognitionRef.current.addEventListener('test', (e) => {
                console.log(e.result)
            })
        }

        return () => {
            recognitionRef.current.stop();
            recognitionRef.current.removeEventListener('test', (e) => {
                console.log(e.result)
            });
        };
    }, [isListening])

    const startStopListening = () => {
        isListening ? stopListening() : startListening()
    }

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setIsListening(true)
            recognitionRef.current.start()
        }
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            setIsListening(false)
            recognitionRef.current.stop()
        }
    }

    return (
        <>
        <NavBar />
        <button onClick={() => startStopListening()}>{!isListening? 'Start Listening' : 'Stop Listening'} </button>
        <div>{texts}</div>
        </>
    )
}