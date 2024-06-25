import {React, useState} from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import {Link, useNavigate} from "react-router-dom";
import '../index.css'
import CryptoJS from 'crypto-js';
import RenderError from "../components/RenderError/RenderError";
import {useTokenContext} from "../components/TokenContext/TokenContext";

export const parseToken = (token) => {
    const tokenPayload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    const username = tokenPayload?.username
    const userId = tokenPayload?.userId
    return [username, userId]
}

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('')
    const {tokenStatus, userInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo

    const navigate = useNavigate()

    // Sends User to the Home Page
    function sendToHomePage() {
        navigate('/')
    }

    function handleFailedLogin(error) {
        if (error == 'Invalid Credentials') {
            setUsername('')
            setPassword('')
            setError('InvalidCreds')
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        if(username == '') {
            setError('UsernameError')
            return;
        }

        if(password == '') {
            setError('EmptyPW')
            return;
        }

        setError("")

        //Login API
        var hashedPW = CryptoJS.SHA512(password).toString();
        const updatedData = {username, password: hashedPW};

        const dataToPost = {
            method: 'POST',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        fetch('http://localhost:5001/Login', dataToPost)
            .then(res => {
                if (res.ok) {
                    console.log('Login Successful!');
                    return res.json()
                } else {
                    res.text().then(text => handleFailedLogin(text));
                }
            })
            .then(tokenResponse => {
                if (tokenResponse) {
                    console.log(tokenResponse);
                    const token = tokenResponse.token
                    localStorage.setItem('token', token);
                    setToken(token)
                    const tokenData = parseToken(token)
                    setUserData({username: tokenData[0], userId: tokenData[1]})
                    sendToHomePage();
                }
            })
            .catch(error => {
                console.error('Login failed:', error);
            });
    }

    return (
        <div>
            <NavBar/>

            <div className="accountFormBox">
                <div className="accountFormInnerBox">
                    <form onSubmit={handleLogin}>
                        <h4 className="accountFormHeader">Login</h4>

                        {RenderError.renderEmptyUsernameError(error)}
                        {RenderError.renderInvalidCredentialsError(error)}
                        <input
                            type="text"
                            placeholder="Username"
                            className="usernameInput"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />

                        {RenderError.renderPWError(error)}
                        <input
                            type="password"
                            placeholder="Password"
                            className="passwordInput"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <button type="submit" className="primary-btn">
                            Login
                        </button>
                        <div>
                            <Link to="/signUp" className="signUpButton">Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;