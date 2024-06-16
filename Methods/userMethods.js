const {and} = require('sequelize')
const db = require('../Models/dataBase.js')
const jwt = require('jsonwebtoken')
const { user } = require('../config/dbConfig.js')

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
        const token = jwt.sign({username: newUserData.name}, secretKey)
        res.status(200).send(token)
        console.log(newUser + ' added to database!')
    }
}

// Query to login the user.
const loginUser = async (req, res) => {
    const {username, password} = req.body
    const findUser = await User.findOne({username})

    // TODO
    // Somehow findUser isn't returning properly.
    if (findUser && findUser.password === password) {
        const token = jwt.sign(username, secretKey)
        res.send({token})
    } else {
        res.status(401).send('Invalid Credentials')
    }
}

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
}



