import React, {useState, useEffect, ReactNode} from 'react'
import {useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar/NavBar.jsx";
import CryptoJS from 'crypto-js';
import '../index.css'
import RenderError from "../components/RenderError/RenderError";
import {useTokenContext} from "../components/TokenContext/TokenContext.jsx";
import {checkStrongPW} from "../utilities/utilities.js";

/**
 * A Functional React component that displays the sign up page, handles sign up errors, and communicates with the back-end to sign the user up.
 * @component
 * @returns {ReactNode} A React element that renders the sign up page.
 */
function SignUp() {
    const {tokenStatus} = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    /**
     * The current confirmation password and setter function to update it.
     * @type {[string, function]}
     */
    const [confirmPassword, setConfirmPassword] = useState('')

    /**
     * The current error faced by user during sign up and setter function to update it.
     * @type {[string, function]}
     */
    const [error, setError] = useState('')

    /**
     * @function useEffect
     * @description GET method to check for connection with the back-end.
     */
    useEffect(() => {
        fetch('/', {method: 'GET'})
        .then(res => {
            console.log('Hello from Database~!')
        })
    }, [])
    
    /**
     * The current userData state and setter function to update it.
     * @type {[Object, function]}
     */
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        points: 0,
        dateOfBirth: ''
    })

    const navigate = useNavigate()

    /** 
     * Checks whether user and confirmation passwords match.
     * @returns {boolean} true or false.
     */
    function pwMatch() {
        return confirmPassword === userData.password;
    }
    
    /**
     * Update userData with the new username.
     * @param {string} newName Name in the input field.
     * @returns {function} Function that updates the username in the userData object.
     */
    const handleNameChange = (newName) => {
        return setUserData((prevState) => {
              return { ...prevState, username: newName };
            });
      };

    /**
     * Update userData with the new password.
     * @param {string} newPW Password in the input field.
     * @returns Function that updates the password in the userData object.
     */
    const handlePasswordChange = (newPW) => {
        return setUserData((prevState) => {
            return { ...prevState, password: newPW };
        });
    };
    
    /**
     * Update userData with the new birth date.
     * @param {Date} newBirthDate Birth date in the input field.
     * @returns Function that updates the birth date in the userData object.
     */
    const handleBirthDateChange = (newBirthDate) => {
        const birthDateObject = new Date(newBirthDate)
        const formattedDate = birthDateObject.toISOString().split('T')[0];

        return setUserData((prevState) => {
            return { ...prevState, dateOfBirth: formattedDate };
        });
    }

    /**
     * Clears both passwords in the form.
     */
    function clearPW() {
        setUserData((prevState) => {
            return { ...prevState, password: '' };
        })
        setConfirmPassword('')
    }

    /**
     * Updates the sign up error when username is empty.
     */
    function handleEmptyUsername() {
        setError('UsernameError')
    }

    /**
     * Updates the sign up error when passwords do not match.
     */
    function handleDifferentPassword() {
        clearPW()
        setError('MismatchPW')
    }

    /**
     * Updates the sign up error when password is empty.
     */
    function handleEmptyPW() {
        setError('EmptyPW')
    }

    /**
     * Updates the sign up error when birth date is empty.
     */
    function handleEmptyDateOfBirth() {
        setError('EmptyDOB')
    }

    /**
     * Updates the sign up error when birth date is in the future.
     */
    function handleFutureDOB() {
        setError('DOBFuture')
    }

    /**
     * Updates the sign up error when password is weak.
     */
    function handleWeakPassword() {
        setError('WeakPW')
        setConfirmPassword('')
    }

    /**
     * Updates the sign up error when password is weak.
     */
    function handleSpaceUsername() {
        setError('UsernameSpaceError')
    }

    /**
     * Updates the sign up error when password is weak.
     */
    function handleSpacePassword() {
        setError('SpacePW')
    }

    /**
     * Updates the sign up error when username is already taken.
     */
    function handleFailedSignUp(error) {
        if (error == 'Username Already Taken!') {
            clearPW()
            setError('UsernameTaken')
        }
    }

    /** 
     * Sends User to the Home Page.
     */
    function sendToHomePage() {
        navigate('/')
    }


    /**
     * Sends userData to the back-end to insert into database.
     * @async
     * @param {*} e Sign Up event.
     * @returns {Promise<void>} A promise that adds the new user into the database.
     * @throws {Error} Throws an error if user sign up fails.
     */
    const handleSignUp = async (e) => {
        e.preventDefault()
        setError('')

        if (userData.username === '') {
            console.log('Username cannot be empty!')
            handleEmptyUsername()
            return
        }


        if(userData.username.includes(' ')) {
            console.log('Username cannot have space!')
            handleSpaceUsername()
            return;
        }

        if (userData.dateOfBirth == '') {
            console.log('Date of Birth cannot be empty!')
            handleEmptyDateOfBirth()
            return
        }

        const currentDate = new Date()
        const dateOfBirthObj = new Date(userData.dateOfBirth)

        if (dateOfBirthObj > currentDate) {
            console.log('Date of Birth cannot be in future!')
            handleFutureDOB()
            return
        }

        if (userData.password == '') {
            console.log('Password cannot be Empty!')
            handleEmptyPW()
            return
        }

        if(userData.password.includes(' ')) {
            console.log('Spacing not allowed in password')
            handleSpacePassword()
            return
        }

        if (!pwMatch()) {
            console.log('Passwords do not match!')
            handleDifferentPassword()
            return
        }
        
        const isPWStrong = checkStrongPW(userData.password)

        if (!isPWStrong) {
            handleWeakPassword()
            return
        }

        var hashedPW = CryptoJS.SHA512(userData.password).toString();
        const updatedData = {...userData, password: hashedPW};

        const dataToPost = {
            method: 'POST', 
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await fetch('http://localhost:5001/SignUp', dataToPost)

            if(res.ok) {
                console.log('Sign Up Successful!')
                const data = await res.json()
                const resToken = data.token
                localStorage.setItem('token', resToken)
                setToken(resToken)
                sendToHomePage()
                return
            } else {
                const text = await res.text()
                handleFailedSignUp(text)
            }
        } catch (error) {
            console.error('Error occured during Sign Up', error)
        }
    }

    return (
        <>
        <div>
            <NavBar/>
            <div className="accountFormBox">
                <div className="accountFormInnerBox">
                    <form onSubmit={handleSignUp}>
                        <h4 className="accountFormHeader">Sign Up</h4>

                        {RenderError.renderUsernameError(error)}
                        {RenderError.renderSignUpError(error)}
                        <div className="signUpBox">
                            <input type='text'
                                   placeholder="Username"
                                   value={userData.username}
                                   className="usernameInput"
                                   onChange={(e) => handleNameChange(e.target.value)}
                            />
                        </div>

                        {RenderError.renderDateOfBirthError(error)}
                        <div className="dateOfBirthBox">
                            <label id="dateOfBirthLabel">Birthdate</label>
                            <input type='date'
                                   placeholder='dd-mm-yyyy'
                                   value={userData.dateOfBirth}
                                   className='dateOfBirthInput'
                                   onChange={(e) => handleBirthDateChange(e.target.value)}
                            />
                        </div>
                        {RenderError.renderPWError(error)}
                        <div className="signUpBox">
                            <input type='password'
                                   placeholder="Password"
                                   value={userData.password}
                                   className="passwordInput"
                                   onChange={(e) => handlePasswordChange(e.target.value)}
                            />
                        </div>
                        <div className="signUpBox">
                            <input type='password'
                                   placeholder="Confirm Password"
                                   value={confirmPassword}
                                   className="passwordInput"
                                   onChange={(e) => {
                                       setConfirmPassword(e.target.value);
                                   }}
                            />
                        </div>
                        {RenderError.renderWeakPWError(error)}
                        <button type='submit' className="primary-btn">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}

export default SignUp;