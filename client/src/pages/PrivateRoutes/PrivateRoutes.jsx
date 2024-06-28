import React from 'react';
import {useTokenContext} from "../../components/TokenContext/TokenContext.jsx";
import {Navigate, Outlet} from 'react-router-dom'

function PrivateRoutes() {
    const {tokenStatus} = useTokenContext()
    const [token, setToken] = tokenStatus

    return (
        token ? <Outlet/> : <Navigate to="/login"/>
    );
}

export default PrivateRoutes;