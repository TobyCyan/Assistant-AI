const db = require('../Models/dataBase.js')
const { user } = require('../config/dbConfig.js')

const User = db.user
const Notes = db.notes

// Refer to sequelize.org/master/manuel for full API reference of queries.

// Query to add a new user to db.
const addUser = async (req, res) => {
    let newUserData = {
        username: req.params['username'],
        password: req.params['password']
    }

    const newUser = await User.create(newUserData)
    res.status(200).send(newUser)
    console.log(newUser)
}

// Exports all methods to be used by the server.
module.exports = {
    addUser,
}


