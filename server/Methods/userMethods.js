const {and} = require('sequelize')
const db = require('../Models/dataBase.js')
const jwt = require('jsonwebtoken')
<<<<<<< Updated upstream:server/Methods/userMethods.js
const {authenticateToken} = require("../utilities/utilities")
=======
const { user } = require('../config/dbConfig.js')
>>>>>>> Stashed changes:Methods/userMethods.js

const User = db.user
const Tasks = db.tasks

// Secret Key Must Not Be Leaked for Security Purposes.
const secretKey = 'aSsiSTaNTAIiSAlwAYsHErEtOhelP020620241aM*$^0^'

// Refer to sequelize.org/master/manual for full API reference of queries.

const getIdByUsername = async (username) => {
    const userData = await User.findOne({
        where: {
            name: username
        }
    })
    return userData[0].id
}

// Query to add a new user to db.
const addUser = async (req, res) => {
    const data = req.body
    let newUserData = {
        name: data['username'],
        password: data['password'],
        points: data['points'],
        dateOfBirth: data['dateOfBirth']
    }
    // Username must be unique.
    const findUser = await User.findOne({attributes: ['name'],
                                        where: {
                                            name: data['username']
                                        }
                                    })
    
    if (findUser) {
        res.status(401).send('Username Already Taken!')
        return
    } else {
        const newUser = await User.create(newUserData)
<<<<<<< Updated upstream:server/Methods/userMethods.js
        const token = jwt.sign({username: newUserData.name}, secretKey, {expiresIn: 5 * 60})
        res.status(200).send(token)
        console.log(newUser + ' added to database!')
    }
}

// Query to login the user.
// TODO
// Somehow findUser isn't returning properly.
const loginUser = async (req, res) => {
    const {username, hashedPW} = req.body
    const findUser = await User.findOne({where: {name: username}})

    if (findUser && findUser.password === hashedPW) {
        // JWT was signed with username
        const token = jwt.sign({username}, secretKey)
        return res.json({
            token
        })
    } else {
        res.status(401).send('Invalid Credentials')
    }
}

<<<<<<< Updated upstream:server/Methods/userMethods.js
//Get User Details
const getUserInfo = async(req, res) => {
    console.log("Started fetch")
    console.log(req)
    console.log(req.user)
    const username = req.user

    const findUser = await User.findOne({where: {name: username}})

    if(findUser) {
        console.log("Found User")
        return res.json({
            user: {
                id: findUser.id,
                username: findUser.name,
                points: findUser.points,
                dateOfBirth: findUser.dateOfBirth,
            }
        })
    } else {
        res.status(401).send('Error, no such user found in DB')
    }
}

module.exports = {
    addUser,
    loginUser,
    getUserInfo,
=======
const getTasks = async (req, res) => {
    const userId = await getIdByUsername(req.body)
    const tasks = await Tasks.findAll({userId: userId})

    if (tasks) {
        res.send({tasks})
    } else {
        res.status(401).send('Invalid User/ Tasks')
    }
}

const addTask = async (req, res) => {
    const data = req.body
    let newTaskData = {
        userId: data['userId'],
        title: data['title'],
        description: data['description'],
        category: data['category'],
        deadline: data['deadline'],
        priority: data['priority'],
        reminder: data['reminder']
    }
    const newTask = await Tasks.create(newTaskData)
    console.log(newUser + ' added to database!')
}

const editTask = async (req, res) => {
// TODO

}

const updateTask = async (req, res) => {
// TODO
// use Tasks.update

}

module.exports = {
    addUser,
    loginUser,
    getTasks,
    addTask,
    editTask,
    updateTask,
>>>>>>> Stashed changes:Methods/userMethods.js
}



