import React, {useState, createContext, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const TokenContext = createContext()

export const TokenProvider = (props) => {
    // localStorage.getItem returns a truthy value - undefined
    const [token, setToken] = useState(null)
    const [userInfo, setUserInfo] = useState({username: null, userId: null})
    const [tasks, setTasks] = useState([])

    // Debugging for token.
    useEffect(() => {
        // This will run after the state update is complete
        console.log('Token Updated as ' + token);
    }, [token]);

    // Debugging for userInfo.
    useEffect(() => {
        // This will run after the state update is complete
        console.log('User Updated as Username: ' + userInfo.username + ', ID: ' + userInfo.userId);
    }, [userInfo]);

    // Debugging for tasks.
    useEffect(() => {
        // This will run after the state update is complete
        console.log('Tasks Updated as Tasks: ' + tasks);
    }, [tasks]);

    return (
        <TokenContext.Provider 
        value={{
            tokenStatus: [token, setToken], 
            userInfo: [userInfo, setUserInfo],
            tasksInfo: [tasks, setTasks]
        }}>
            {props.children}
        </TokenContext.Provider>
    )
}

export const useTokenContext = () => useContext(TokenContext)

