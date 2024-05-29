import React from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import {Link, useNavigate} from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        if(!username) {
            setError("Please enter a username")
            return;
        }

        if(!password) {
            setError("Please enter password")
            return;
        }

        setError("")

        //Login API
    }

    return (
        <div>
            <NavBar/>
            <h1>Login</h1>
        </div>
    )
}

export default Login;