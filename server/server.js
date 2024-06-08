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

// Get Request
app.get('/Tasks', getTasks)

const addUser = require('./Methods/userMethods.js').addUser
const loginUser = require('./Methods/userMethods.js').loginUser
const getUserInfo = require('./Methods/userMethods').getUserInfo

// Post Request to Add User
app.post('/SignUp', addUser)

// Post Request to Login User
app.post('/Login', loginUser)

// Get Request of User
app.get('/getUser', authenticateToken(secretKey), getUserInfo)


app.listen(port, () => {
    console.log('App is listening on port 5001.')
})

