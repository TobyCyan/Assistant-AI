const {and} = require('sequelize')
const db = require('../Models/dataBase.js')
const jwt = require('jsonwebtoken')

const {authenticateToken} = require("../utilities/utilities")

const { user } = require('../config/dbConfig.js')


const User = db.user
const Tasks = db.tasks

// Secret Key Must Not Be Leaked for Security Purposes.
const secretKey = 'aSsiSTaNTAIiSAlwAYsHErEtOhelP020620241aM*$^0^'

// Refer to sequelize.org/master/manual for full API reference of queries.

// Gets UserID by the Username.
const getIdByUsername = async (username) => {
    const userData = await User.findOne({
        where: {
            name: username
        }
    })
    return userData.dataValues.id
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
    const findUser = await User.findOne({
        where: {
            name: data['username']
        }
    })
    
    if (findUser) {
        res.status(401).send('Username Already Taken!')
        return
    } else {
        const newUser = await User.create(newUserData)
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
    const findUser = await User.findOne({
        where: {
            name: username
        }
    })

    if (findUser && findUser.password === hashedPW) {
        // JWT was signed with username
        const token = jwt.sign({username}, secretKey)
        const userId = await getIdByUsername(username)
        res.send({token: token, userId: userId})
    } else {
        res.status(401).send('Invalid Credentials')
    }
}

//Get User Details
const getUserInfo = async (req, res) => {
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

const getTasks = async (req, res) => {
    const {userId} = req.body
    const tasks = await Tasks.findAll({
        where: {
            userId: userId
        }
    })

    if (tasks) {
        res.send({tasks: tasks})
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
    res.send({newTask: newTask})
    console.log(newTask + ' added to database!')
}

const editTask = async (req, res) => {
    const data = req.body
    let editTaskData = {
        title: data['title'],
        description: data['description'],
        category: data['category'],
        deadline: data['deadline'],
        priority: data['priority'],
        reminder: data['reminder']
    }

    const editTask = await Tasks.update(editTaskData, {
            where: {
                userId: data['userId'],
                id: data['taskId']
            }
        }
    )

    res.send({editTask: editTask})
    console.log(editTask + ' edited!')
}

const updateTask = async (req, res) => {
    // TODO
    // use Tasks.update

}

const deleteTask = async (req, res) => {
    const {taskId, userId} = req.body
    const deleteTask = await Tasks.destroy({
        where: {
            id: taskId,
            userId: userId
        }
    })
    .catch(err => console.error('Error Deleting Task', err))

    console.log('Task Successfully Deleted!')

}

module.exports = {
    addUser,
    loginUser,
    getTasks,
    addTask,
    editTask,
    updateTask,
    deleteTask,
    getUserInfo
}



