import React, { useEffect, useState } from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import { useTokenContext } from '../../TokenContext.jsx'

const MyTasks = () => {
    const [token, setToken] = useTokenContext()
    const [tasks, setNewTasks] = useState({})

    // Is called whenever a new task gets added, deleted or updated.
    // GET request to get all tasks from the database.
    useEffect(() => {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]))
        const username = tokenPayload?.username
        
        // Sends a request with the username as payload.
        fetch('/Tasks', {
            method: 'GET', 
            body: JSON.stringify(username),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            // Sets the tasks if response is ok.
            if (res.ok) {
                setNewTasks(res.json())
                console.log('Tasks Successfully Fetched!')
                console.log(tasks)
            }     
        })
        .catch(err => console.log('Failed to Fetch Tasks!'))
    }, [tasks])

    return (
        <div>
            <NavBar/>
            <h1>Tasks</h1>
        </div>
    )
}

export default MyTasks;