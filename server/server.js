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

// User Methods
const addUser = require('./Methods/userMethods.js').addUser
const loginUser = require('./Methods/userMethods.js').loginUser
const getUserInfo = require('./Methods/userMethods.js').getUserInfo
const getTasks = require('./Methods/userMethods.js').getTasks
const addTask = require('./Methods/userMethods.js').addTask
const editTask = require('./Methods/userMethods.js').editTask
const deleteTask = require('./Methods/userMethods.js').deleteTask

// Get Request of User
app.get('/getUser', authenticateToken(secretKey), getUserInfo)

// Post Request to Get User Tasks by Username
app.post('/Tasks', getTasks)

// Post Request to Add User
app.post('/SignUp', addUser)

// Post Request to Login User
app.post('/Login', loginUser)

// Task-related Post Requests
app.post('/AddTask', addTask)
app.post('/EditTask', editTask)
app.post('/DeleteTask', deleteTask)


app.listen(port, () => {
    console.log('App is listening on port 5001.')
})

