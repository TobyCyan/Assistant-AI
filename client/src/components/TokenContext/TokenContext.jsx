import React, {useState, createContext, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
const TokenContext = createContext()

export const TokenProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('jwt') || '')

    useEffect(() => {
        // This will run after the state update is complete
        console.log(token + "Updated");
    }, [token]);

    return (
        <TokenContext.Provider value={{token, setToken}}>
            {children}
        </TokenContext.Provider>
    )
}

export const useTokenContext = () => useContext(TokenContext)

