import React, {useState, createContext, useContext, useEffect} from "react";


const TokenContext = createContext()

/**
 * @typedef {Object} TokenContext
 * @property {string} tokenStatus - The token status of the user.
 * @property {Object} userInfo - The information about the user.
 */
export const TokenProvider = (props) => {
    // localStorage.getItem returns a truthy value - undefined
    const [token, setToken] = useState(null)
    const [userData, setUserData] = useState({
        username: null,
        id: null,
        dateOfBirth: null,
        points: null,
    })

    useEffect(() => {
        // This will run after the state update is complete
        if(localStorage.getItem("token") !== "undefined") {
            setToken(localStorage.getItem("token"))
        }
    }, [token]);

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

/**
 * Use TokenContext as the context.
 * @returns {TokenContext} The token context object.
 */
export const useTokenContext = () => useContext(TokenContext)

