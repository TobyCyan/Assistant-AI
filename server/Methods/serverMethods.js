const db = require('../Models/dataBase.js')
const jwt = require('jsonwebtoken')

const User = db.user
const Tasks = db.tasks

// Secret Key Must Not Be Leaked for Security Purposes.
const secretKey = 'aSsiSTaNTAIiSAlwAYsHErEtOhelP020620241aM*$^0^'

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
    
    // Sends an Error Messages as Response If User Already Exists.
    if (findUser) {
        res.status(401).send('Username Already Taken!')
        return
    } else {
        // Creates the New User Instance and Signs a JSON Web Token with the Username and Secret Key.
        const newUser = await User.create(newUserData)
        const token = jwt.sign({username: newUserData.name}, secretKey, {expiresIn: 5 * 60})
        
        // Sends an ok Response and the JWT Token to Begin the User's Session.
        res.status(200).send(token)
        console.log(newUser + ' added to database!')
    }
}

// Query to login the user.
const loginUser = async (req, res) => {
    const { username, hashedPW } = req.body

    // Finds the User Instance That Logged In.
    const findUser = await User.findOne(
        {
            where: {
                name: username
            }
        }
    )

    // If User Exists and Credentials Match. 
    if (findUser && findUser.password === hashedPW) {
        // JWT was signed with username
        const token = jwt.sign({username: findUser.name, id:findUser.id}, secretKey)
        // Gets the UserId by Username
        // Sends the JWT Token and UserId as a Response.
        res.send({token: token, userId: findUser.id})
    } else {
        // Sends an Error Message If Credentials are Invalid.
        res.status(401).send('Invalid Credentials')
    }
}

// Gets All the User's Tasks by the UserId.
const getTasks = async (req, res) => {
    const { id } = req.user

    // Finds All Task Instances of the User.
    const tasks = await Tasks.findAll(
        {
            where: {
                userId: id
            }
        }
    )

    // Sends the List of Tasks as a Response If Tasks Found.
    if (tasks) {
        res.send({tasks: tasks})
    } else {
        // Sends an Error Message If The User is Invalid or Tasks are Not Found.
        res.status(401).send('Invalid User/ Tasks')
    }
}

// Gets All of User Info
const getUserInfo = async (req, res) => {
    const { id } = req.user

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
        res.status(401).send('Invalid User')
    }
}


module.exports = {
    addUser,
    loginUser,
    getTasks,
    getUserInfo
}

