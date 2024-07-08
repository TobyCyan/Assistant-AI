const express = require('express')
const cors = require('cors')
const {authenticateToken} = require('./utilities/utilities')

const app = express()
const port = process.env.PORT

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

const secretKey = process.env.Secret_Key

// Server Methods
const addUser = require('./Methods/userMethods.js').addUser
const loginUser = require('./Methods/userMethods.js').loginUser
const getUserInfo = require('./Methods/userMethods.js').getUserInfo
const getUserInfoByUsername = require('./Methods/userMethods.js').getUserInfoByUsername

// User Methods
const getTasks = require('./Methods/taskMethods.js').getTasks
const addTask = require('./Methods/taskMethods.js').addTask
const editTask = require('./Methods/taskMethods.js').editTask
const deleteTask = require('./Methods/taskMethods.js').deleteTask
const completeTask = require('./Methods/taskMethods.js').completeTask
const unCompleteTask = require('./Methods/taskMethods.js').uncompleteTask

// Friend Methods
const getFriends = require('./Methods/friendshipMethods.js').getFriends
const getFriendRequests = require('./Methods/friendshipMethods.js').getFriendRequests
const createFriendRequest = require('./Methods/friendshipMethods.js').createFriendRequest
const updateFriendRequest = require('./Methods/friendshipMethods.js').updateFriendRequest
const deleteFriendRequest = require('./Methods/friendshipMethods.js').deleteFriendRequest

// User Related Requests
// Post Request to Add User
app.post('/SignUp', addUser)

// Post Request to Login User
app.post('/Login', loginUser)

// Get Request to Get All User Info
app.get('/GetUserInfo', authenticateToken(secretKey), getUserInfo)

// Get Request to get User Info by Username
app.get('/user/:username', authenticateToken(secretKey), getUserInfoByUsername)


// Task-related Requests
// Get User TaskModals
app.get('/Tasks', authenticateToken(secretKey), getTasks)
// Add Task
app.post('/AddTask', authenticateToken(secretKey), addTask)
// Edit Task
app.put('/EditTask',  authenticateToken(secretKey), editTask)
// Delete Task
app.delete('/DeleteTask', authenticateToken(secretKey), deleteTask)
// Complete Task
app.put('/CompleteTask',  authenticateToken(secretKey), completeTask)
// Uncomplete Task
app.put('/UncompleteTask',  authenticateToken(secretKey), unCompleteTask)

// Friendship-related requests
// Get Method for friends
app.get('/Friends', authenticateToken(secretKey), getFriends)
// Get Method for sent / received friend requests
app.get('/FriendRequests', authenticateToken(secretKey), getFriendRequests)
//Post Method for new Friend Request
app.post('/requests/:username', authenticateToken(secretKey), createFriendRequest)
//Update Method for accept request
app.put('/requests/:username', authenticateToken(secretKey), updateFriendRequest)
//Delete Method for friend request
app.delete('/request/:username', authenticateToken(secretKey), deleteFriendRequest)

app.listen(port, () => {
    console.log('App is listening on port 5001')
})

