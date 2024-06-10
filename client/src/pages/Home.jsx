import React, {useEffect, useState} from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import '../index.css'
import TasksBox from "../components/TasksBox/TasksBox";
import Modal from 'react-modal';
import AddEditTasks from "../components/Tasks/AddEditTasks";
import {useTokenContext} from "../components/TokenContext/TokenContext";

function Home() {
    const {tokenStatus, userInfo} = useTokenContext()
    const [token, setToken] = tokenStatus
    const [userData, setUserData] = userInfo


    return (
        <>
        <NavBar/>
        {userData.username ? ( 
            <h2>Welcome Back {userData.username}!</h2> 
        ) : ( 
            <h2>Welcome Back User!</h2> 
        )}
        </>
    )
}

export default Home;