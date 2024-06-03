import React, {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar/NavBar.jsx";
import CryptoJS from 'crypto-js';
import '../index.css'
import RenderError from "../components/RenderError/RenderError";

function SignUp() {
    // Used to check whether the passwords match.
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/', {method: 'GET'})
        .then(res => {
            console.log('Hello from Database~!')
        })
    }, [])
    
    // userData state will be used to send user info to the back-end.
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        points: 0,
        dateOfBirth: ''
    })

    const navigate = useNavigate()

    // Checks whether the passwords match.
    function pwMatch() {
        return confirmPassword === userData.password;
    }
    
    // Update userData with the new username.
    const handleNameChange = (newName) => {
        return setUserData((prevState) => {
              return { ...prevState, username: newName };
            });
      };

    // Update userData with the new password.
    const handlePasswordChange = (newPW) => {
        return setUserData((prevState) => {
            return { ...prevState, password: newPW };
        });
    };
    
    // Update userData with the new birth date.
    const handleBirthDateChange = (newBirthDate) => {
        const birthDateObject = new Date(newBirthDate)
        const formattedDate = birthDateObject.toISOString().split('T')[0];

        return setUserData((prevState) => {
            return { ...prevState, dateOfBirth: formattedDate };
        });
    }

    // Clears both passwords in the form.
    function clearPW() {
        setUserData((prevState) => {
            return { ...prevState, password: '' };
        })
        setConfirmPassword('')
    }

    function handleEmptyUsername() {
        setError('UsernameError')
    }

    function handleDifferentPassword() {
        clearPW()
        setError('MismatchPW')
    }

    function handleEmptyPW() {
        setError('EmptyPW')
    }

    function handleEmptyDateOfBirth() {
        setError('EmptyDOB')
    }

    function handleFailedSignUp(error) {
        if (error == 'Username Already Taken!') {
            clearPW()
            setError('UsernameTaken')
        }
    }

    // Sends User to the Home Page
    function sendToHomePage() {
        navigate('/')
    }

    // TODO
    // Sends userData to the back-end to insert into database.
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('')

        if (userData.username == '') {
            console.log('Username cannot be empty!')
            handleEmptyUsername()
            return
        }

        if (userData.dateOfBirth == '') {
            console.log('Date of Birth cannot be empty!')
            handleEmptyDateOfBirth()
            return
        }

        if (userData.password == '') {
            console.log('Password cannot be Empty!')
            handleEmptyPW()
            return
        }

        if (!pwMatch()) {
            console.log('Passwords do not match!')
            handleDifferentPassword()
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

        fetch('http://localhost:5001/SignUp', dataToPost)
        .then(res => {
            // Response is ok if and only if the Response Status is 2xx.
            if (res.ok) {
                console.log('Sign Up Successful!')
                localStorage.setItem('jwt', res.json().token)
                sendToHomePage()
                return
            }
            
            // Response status is not ok, obtain the error text and handle it.
            res.text().then(text => handleFailedSignUp(text))
            }
        );
    }

    return (
        <>
        <div>
            <NavBar/>
            <div className="accountFormBox">
                <div className="accountFormInnerBox">
                    <form onSubmit={handleSignUp}>
                        <h4 className="accountFormHeader">Sign Up</h4>

                        {RenderError.renderEmptyUsernameError(error)}
                        {RenderError.renderSignUpError(error)}
                        <div>
                            <input type='text'
                                   placeholder="Username"
                                   value={userData.username}
                                   className="usernameInput"
                                   onChange={(e) => handleNameChange(e.target.value)}
                            />
                        </div>

                        {RenderError.renderDateOfBirthError(error)}
                        <div>
                            <input type='date' 
                                    placeholder='dd-mm-yyyy'
                                    value={userData.dateOfBirth}
                                    className='dateOfBirthInput'
                                    onChange={(e) => handleBirthDateChange(e.target.value)}
                            />
                        </div>
                        {RenderError.renderPWError(error)}
                        <div>
                            <input type='password'
                                   placeholder="Password"
                                   value={userData.password}
                                   className="passwordInput"
                                   onChange={(e) => handlePasswordChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <input type='password'
                                   placeholder="Confirm Password"
                                   value={confirmPassword}
                                   className="passwordInput"
                                   onChange={(e) => {
                                       setConfirmPassword(e.target.value);
                                   }}
                            />
                        </div>
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