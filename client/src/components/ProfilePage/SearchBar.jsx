import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useTokenContext} from "../TokenContext/TokenContext.jsx";

const SearchBar = () => {
    const {tokenStatus} = useTokenContext()
    const [token, setToken] = tokenStatus

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5001/user/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('User not found'); // Handle non-2xx status codes
            }
            const exists = await response.json();
            if (exists) {
                navigate(`/${username}`);
                setError('')
            } else {
                setError(`User '${username}' not found`);
            }
        } catch (error) {
            console.error('Error searching for user:', error);
            setError('Error searching for user. Please try again.');
        }
    };

    const handleInputChange = (event) => {
        setUsername(event.target.value);
    };

    const handleKeyDown = (event) => {
        if(event.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Enter username..."
                value={username}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>
                S
            </button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default SearchBar;
