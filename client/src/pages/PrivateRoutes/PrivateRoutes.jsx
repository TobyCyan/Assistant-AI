import React, {ReactNode, useEffect} from 'react';
import {useTokenContext} from "../../components/TokenContext/TokenContext.jsx";
import {Navigate, Outlet} from 'react-router-dom'
import { parseToken } from '../Login.jsx';

/**
 * A Functional React component that redirects user to the outlet if a login token exists.
 * @component
 * @returns {ReactNode} A React element that renders the outlet of navigation component depending on the token.
 */
function PrivateRoutes() {
    const {tokenStatus, userInfo, userTasks} = useTokenContext()

    /**
     * The current token and setter function to update it.
     * @type {[string, function]}
     */
    const [token, setToken] = tokenStatus

    /**
     * The current user data and setter function to update it.
     * @type {[Object, function]}
     */
    const [userData, setUserData] = userInfo

    /**
     * The current user tasks and setter function to update it.
     * @type {[Object, function]}
     */
    const [tasks, setTasks] = userTasks
    const localToken = localStorage.getItem('token')

    /** 
     * @function useEffect
     * @description Set the token if there is token.
     */
    useEffect(() => {
        if (localToken) {
            setToken(localToken)
            getUserInfo()
            getUserTasks()
        }
    }, [])

    /** 
     * @function useEffect
     * @description Get User Info and User Tasks if there is token.
     */
    useEffect(() => {
        if (token) {
            console.log("Token Set")
            localStorage.setItem('token', token);
            getUserInfo();
            getUserTasks();
        }
    }, [token]);
    
    /** 
     * Async GET method to get user tasks.
     * @async
     * @returns {Promise<void>} A promise that gets the current user's tasks.
     * @throws {Error} Throws an error if getting user tasks fails.
     */
    const getUserTasks = async () => {
        const dataToPost = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localToken}`
            }
        };

        try {
            const res = await fetch('http://localhost:5001/Tasks', dataToPost)
            if(res.ok) {
                console.log("Tasks successfully retrieved")
            } else {
                console.log("Invalid User/Tasks")
            }

            const data = await res.json()
            console.log('data: ' + data)
            if(data) {
                console.log('Type of Tasks: ' + typeof data.tasks + ', Tasks: ' + data.tasks + ', isArray? ' + Array.isArray(data.tasks))
                setTasks(data.tasks)
                console.log(data.tasks)
            }
        } catch (err) {
            console.error('Failed to Fetch Tasks!', err)
        }
    }

    /** 
     * Async GET method to get user data.
     * @async
     * @returns {Promise<void>} A promise that gets the current user's data.
     * @throws {Error} Throws an error if getting user data fails.
     */
    const getUserInfo = async () => {

        const dataToPost = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localToken}`
            }
        };

        try {
            const res = await fetch('http://localhost:5001/GetUserInfo', dataToPost)
            if(res.ok) {
                console.log("UserInfo successfully retrieved")
            } else {
                console.log("Invalid User/Info")
            }

            const data = await res.json()
            if(data) {
                console.log(data)
                setUserData(data)
            }
        } catch (err) {
            console.error('Failed to Fetch User Info!', err)
        }
    }

    return (
        localToken ? <Outlet/> : <Navigate to="/login"/>
    );

}

export default PrivateRoutes;