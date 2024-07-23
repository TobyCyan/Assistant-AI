const express = require("express")
const cors = require("cors")
const {authenticateToken} = require("./utilities/utilities")

require("dotenv").config()
require("./cronScheduler/cronScheduler.js")

const app = express()
const port = process.env.PORT

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

const secretKey = process.env.Secret_Key

// Server Methods
const addUser = require("./Methods/userMethods.js").addUser
const loginUser = require("./Methods/userMethods.js").loginUser
const getUserInfo = require("./Methods/userMethods.js").getUserInfo
const getUserInfoByUsername = require("./Methods/userMethods.js").getUserInfoByUsername

// User Methods
const getTasks = require("./Methods/taskMethods.js").getTasks
const addTask = require("./Methods/taskMethods.js").addTask
const editTask = require("./Methods/taskMethods.js").editTask
const deleteTask = require("./Methods/taskMethods.js").deleteTask
const completeTask = require("./Methods/taskMethods.js").completeTask
const unCompleteTask = require("./Methods/taskMethods.js").uncompleteTask
const userCompleteTutorial = require("./Methods/userMethods.js").setUserCompleteTutorial

// Friend Methods
const getFriends = require("./Methods/friendshipMethods.js").getFriends
const getFriendRequests = require("./Methods/friendshipMethods.js").getFriendRequests
const createFriendRequest = require("./Methods/friendshipMethods.js").createFriendRequest
const updateFriendRequest = require("./Methods/friendshipMethods.js").updateFriendRequest
const deleteFriendRequest = require("./Methods/friendshipMethods.js").deleteFriendRequest

// Item Methods
const getItems = require("./Methods/itemMethods").getItems
const createUserItem = require("./Methods/itemMethods").createUserItem

// Recurring Task Methods
const getRecurringTasks = require("./Methods/recurringTaskMethods.js").getRecurringTasks
const addRecurringTask = require("./Methods/recurringTaskMethods.js").addRecurringTask
const editRecurringTask = require("./Methods/recurringTaskMethods.js").editRecurringTask
const deleteRecurringTask = require("./Methods/recurringTaskMethods.js").deleteRecurringTask

// User Related Requests
// Post Request to Add User.
app.post("/SignUp", addUser)

// Post Request to Login User.
app.post("/Login", loginUser)

// Get Request to Get All User Info.
app.get("/GetUserInfo", authenticateToken(secretKey), getUserInfo)

// Get Request to get User Info by Username.
app.get("/user/:username", authenticateToken(secretKey), getUserInfoByUsername)

// Get Request to set user complete tutorial status.
app.get("/SetUserCompleteTutorial", authenticateToken(secretKey), userCompleteTutorial)


// Task-related Requests
// Get User Tasks.
app.get("/Tasks", authenticateToken(secretKey), getTasks)

// Add Task.
app.post("/AddTask", authenticateToken(secretKey), addTask)

// Edit Task.
app.put("/EditTask",  authenticateToken(secretKey), editTask)

// Delete Task.
app.delete("/DeleteTask", authenticateToken(secretKey), deleteTask)

// Complete Task.
app.put("/CompleteTask",  authenticateToken(secretKey), completeTask)

// Uncomplete Task.
app.put("/UncompleteTask",  authenticateToken(secretKey), unCompleteTask)


// Friendship-related requests
// Get Method for friends.
app.get("/Friends", authenticateToken(secretKey), getFriends)

// Get Method for sent / received friend requests.
app.get("/FriendRequests", authenticateToken(secretKey), getFriendRequests)

//Post Method for new friend request.
app.post("/requests/:username", authenticateToken(secretKey), createFriendRequest)

//Update Method for accept request.
app.put("/requests/:username", authenticateToken(secretKey), updateFriendRequest)

//Delete Method for friend request.
app.delete("/request/:username", authenticateToken(secretKey), deleteFriendRequest)

// Item-related requests.
app.get("/Items", authenticateToken(secretKey), getItems)

app.post("/CreateUserItem", authenticateToken(secretKey), createUserItem)


// Recurring Task Requests
// Get User Rec Tasks.
app.get("/RecurringTasks", authenticateToken(secretKey), getRecurringTasks)

// Add Rec Task.
app.post("/AddRecTask", authenticateToken(secretKey), addRecurringTask)

// Edit RecTask.
app.put( "/EditRecTask",  authenticateToken(secretKey), editRecurringTask)

// Delete Rec Task.
app.delete("/DeleteRecTask", authenticateToken(secretKey), deleteRecurringTask)


app.listen(port, () => {
    console.log("App is listening on port 5001")
})

