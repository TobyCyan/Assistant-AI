const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
const port = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

// Get Request
app.get('/', (req, res) => {
    res.send('Server is running fine lololol')
})

const addUser = require('../Methods/userMethods.js').addUser
const loginUser = require('../Methods/userMethods.js').loginUser
// Post Request to Add User
app.post('/SignUp', addUser)

// Post Request to Login User
app.post('/Login', loginUser)



app.listen(port, () => {
    console.log('App is listening on port 5000.')
})

