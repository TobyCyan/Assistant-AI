const db = require('../Models/dataBase.js')
const jwt = require('jsonwebtoken')

const User = db.user
const Tasks = db.tasks

const secretKey = process.env.Secret_Key

/**
 * Adds a new user to the database.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const addUser = async (req, res) => {
    const data = req.body
    let newUserData = {
        name: data['username'],
        password: data['password'],
        points: data['points'],
        dateOfBirth: data['dateOfBirth']
    }
    console.log(newUserData.dateOfBirth)
    // Username must be unique.
    const findUser = await User.findOne({
        where: {
            name: data['username']
        }
    })
    
    // Sends an Error Messages as Response If User Already Exists.
    if (findUser) {
        res.status(401).send('Username Already Taken!')
        return
    } else {
        // Creates the New User Instance and Signs a JSON Web Token with the Username and Secret Key.
        const newUser = await User.create(newUserData)
        // Remove expiresIn first
        const token = jwt.sign({username: newUser.name, id:newUser.id}, secretKey)

        // Sends an ok Response and the JWT Token to Begin the User's Session.
        res.status(200).send({token})
        console.log(newUser + ' added to database!')
    }
}

/**
 * Logs in the user.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const loginUser = async (req, res) => {
    const { username, password } = req.body

    // Finds the User Instance That Logged In.
    const findUser = await User.findOne(
        {
            where: {
                name: username
            }
        }
    )

    // If User Exists and Credentials Match. 
    if (findUser && findUser.password === password) {
        // JWT was signed with username
        const token = jwt.sign({username: findUser.name, id:findUser.id}, secretKey)
        // Gets the UserId by Username
        // Sends the JWT Token and UserId as a Response.
        res.send({token, userId: findUser.id})
    } else {
        // Sends an Error Message If Credentials are Invalid.
        res.status(401).send('Invalid Credentials')
    }
}

/**
 * Get user's info.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const getUserInfo = async (req, res) => {
    const { id } = req.user
    console.log(id)

    const findUser = await User.findOne(
        {
            where: {
                id: id
            }
        }
    )

    if(findUser) {
        console.log(findUser)
        const userDetails = {
            username: findUser.name,
            id: findUser.id,
            dateOfBirth: findUser.dateOfBirth,
            points: findUser.points
        }
        console.log(userDetails)
        res.send(userDetails)
    } else {
        res.status(404).send('Invalid User')
    }
}

/**
 * Get user's info.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const getUserInfoByUsername = async (req, res) => {
    const username = req.params.username
    console.log(username)

    const findUser = await User.findOne(
        {
            where: {
                name: username
            }
        }
    )

    if(findUser) {
        console.log(findUser)
        const userDetails = {
            username: findUser.name,
            id: findUser.id,
            dateOfBirth: findUser.dateOfBirth,
            points: findUser.points
        }
        console.log(userDetails)
        res.send(userDetails)
    } else {
        res.status(404).send('No Such User in DB')
    }
}



module.exports = {
    addUser,
    loginUser,
    getUserInfo,
    getUserInfoByUsername,
}

