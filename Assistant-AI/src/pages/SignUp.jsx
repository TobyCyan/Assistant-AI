import React, {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar/NavBar.jsx";
// import CryptoJS from 'crypto-js';
import '../index.css'

function SignUp() {
    // Used to check whether the passwords match.
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetch('/', {method: 'GET'})
        .then(res => {
            console.log('Hello from Database~!')
        })
}, [])
    
    // userData state will be used to send user info to the back-end.
    const [userData, setUserData] = useState({
        username: '',
        password: ''
    })

    const navigate = useNavigate()

    // Checks whether the passwords match.
    function handleConfirmPassword() {
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
    
    function sendToHomePage() {
        //TODO
        // Sends User to the Home Page
        navigate('/')
    }

    // TODO
    // Sends userData to the back-end to insert into database.
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (handleConfirmPassword()) {
            if (userData.username != '') {
                var hashedPW = CryptoJS.SHA512(userData.password).toString();
                const updatedData = {...userData, password: hashedPW};

                const dataToPost = {
                    method: 'POST', 
                    body: JSON.stringify(updatedData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                fetch('http://localhost:5000/SignUp', dataToPost)
                .then(res => {
                        if (res.ok) {
                            console.log('Sign Up Successful!')
                            sendToHomePage()
                        }
                    }
                );

            } else {
                console.log('Username must not be empty!');
            }
        } else {
            console.log('Passwords do not match!');
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
                        <div>
                            <input type='text'
                                   placeholder="Username"
                                   value={userData.username}
                                   className="usernameInput"
                                   onChange={(e) => handleNameChange(e.target.value)}
                            />
                        </div>
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