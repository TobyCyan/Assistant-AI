import React, {ReactNode, useEffect} from 'react';
import {useTokenContext} from "../../components/TokenContext/TokenContext.jsx";
import {Navigate, Outlet} from 'react-router-dom'

/**
 * A Functional React component that redirects user to the outlet if a login token exists.
 * @component
 * @returns {ReactNode} A React element that renders the outlet of navigation component depending on the token.
 */
function PrivateRoutes() {
    const {tokenStatus, userInfo} = useTokenContext()
    const [token, setToken] = tokenStatus

    const localToken = localStorage.getItem('token')

    /**
     * @function useEffect
     * @description Set the token if there is token.
     */
    useEffect(() => {
        if (localToken) {
            setToken(localToken)
        }
    }, [])

    /**
     * @function useEffect
     * @description Get User Info and User TaskModals if there is token.
     */
    useEffect(() => {
        if (token) {
            console.log("Token Set")
            localStorage.setItem('token', token);
        }
    }, [token]);


    return (
        localToken ? <Outlet/> : <Navigate to="/login"/>
    );
}

export default PrivateRoutes;