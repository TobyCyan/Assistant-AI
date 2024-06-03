import {React, useState} from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import {Link, useNavigate} from "react-router-dom";
import '../index.css'
import CryptoJS from 'crypto-js';
import RenderError from "../components/RenderError/RenderError";
import {useTokenContext} from "../components/TokenContext/TokenContext";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('')
    const {token, setToken} = useTokenContext()

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
        const updatedData = {username, hashedPW};

        const dataToPost = {
            method: 'POST',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        fetch('http://localhost:5001/Login', dataToPost)
            .then(res => {
                    // Response is ok if and only if the Response Status is 2xx.
                    if (res.ok) {
                        console.log('Login Successful!')
                        setToken(res.json().token)
                        sendToHomePage()
                        return
                    }

                    // Response status is not ok, obtain the error text and handle it.
                    res.text().then(text => handleFailedLogin(text))
                }
            )
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