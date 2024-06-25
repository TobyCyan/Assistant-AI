import React, {useState, createContext, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const TokenContext = createContext()

export const TokenProvider = (props) => {
    // localStorage.getItem returns a truthy value - undefined
    const [token, setToken] = useState(null)
    const [userData, setUserData] = useState({
        username: null,
        id: null,
        dateOfBirth: null,
        points: null,
    })

    // Debugging for token.
    useEffect(() => {
        // This will run after the state update is complete
        if(localStorage.getItem("token") !== "undefined") {
            setToken(localStorage.getItem("token"))
        }
        console.log('Token Updated as ' + token);
    }, [token]);

    // Debugging for userInfo.
    useEffect(() => {
        // This will run after the state update is complete
        console.log(userData)
        //console.log('User Updated as Username: ' + userInfo.username + ', ID: ' + userInfo.userId);
    }, [userData]);

    return (
        <TokenContext.Provider 
        value={{
            tokenStatus: [token, setToken], 
            userInfo: [userData, setUserData],
        }}>
            {props.children}
        </TokenContext.Provider>
    )
}

export const useTokenContext = () => useContext(TokenContext)

