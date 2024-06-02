const { and } = require('sequelize')
const db = require('../Models/dataBase.js')
const jwt = require('jsonwebtoken')

const User = db.user
const Tasks = db.tasks

// Secret Key Must Not Be Leaked for Security Purposes.
const secretKey = 'aSsiSTaNTAIiSAlwAYsHErEtOhelP020620241aM*$^0^'

// Payload to be sent to front-end.
const payload = {
    'Remember To Do': 'Your Tasks',
}

// Refer to sequelize.org/master/manual for full API reference of queries.

// Query to add a new user to db.
const addUser = async (req, res) => {
    const data = req.body
    let newUserData = {
        name: data['username'],
        password: data['password'],
        points: data['points']
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
        const token = jwt.sign(payload, secretKey)
        res.status(200).send(token)
        console.log(newUser + ' added to database!')
    }
}

// Query to login the user.
const loginUser = async (req, res) => {
    const {username, password} = req.body
    const findUser = await User.findOne({username})

    if (findUser && findUser.password === password) {
        const token = jwt.sign(payload, secretKey)
        res.send({token})
    } else {
        res.status(401).send('Invalid Username or Password!')
    }
}

module.exports = {
    addUser,
    loginUser,
}



