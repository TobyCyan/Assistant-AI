import React, {useState, createContext, useContext} from "react";

const TokenContext = createContext()

export const TokenProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('jwt') || '')

    return (
        <TokenContext.Provider value={{token, setToken}}>
            {children}
        </TokenContext.Provider>
    )
}

export const useTokenContext = () => useContext(TokenContext)

