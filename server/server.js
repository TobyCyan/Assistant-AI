const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const {authenticateToken} = require('./utilities/utilities')

const app = express()
const port = process.env.PORT || 5001

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

// Secret Key Must Not Be Leaked for Security Purposes.
const secretKey = 'aSsiSTaNTAIiSAlwAYsHErEtOhelP020620241aM*$^0^'

// Server Methods
const addUser = require('./Methods/serverMethods.js').addUser
const loginUser = require('./Methods/serverMethods.js').loginUser
const getTasks = require('./Methods/serverMethods.js').getTasks
const getUserInfo = require('./Methods/serverMethods.js').getUserInfo

// User Methods
const addTask = require('./Methods/userMethods.js').addTask
const editTask = require('./Methods/userMethods.js').editTask
const deleteTask = require('./Methods/userMethods.js').deleteTask
const completeTask = require('./Methods/userMethods.js').completeTask
const unCompleteTask = require('./Methods/userMethods.js').uncompleteTask

// Post Request to Get User Tasks by Username
// app.post('/Tasks', getTasks)
app.get('/Tasks', authenticateToken(secretKey), getTasks)

// Post Request to Get All User Info
app.get('/GetUserInfo', authenticateToken(secretKey), getUserInfo)

// Post Request to Add User
app.post('/SignUp', addUser)

// Post Request to Login User
app.post('/Login', loginUser)

// Task-related Post Requests
app.post('/AddTask', authenticateToken(secretKey), addTask)
app.put('/EditTask',  authenticateToken(secretKey), editTask)
app.delete('/DeleteTask', authenticateToken(secretKey), deleteTask)
app.put('/CompleteTask',  authenticateToken(secretKey), completeTask)
app.put('/UncompleteTask',  authenticateToken(secretKey), unCompleteTask)


app.listen(port, () => {
    console.log('App is listening on port 5001.')
})

