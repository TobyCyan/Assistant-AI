const db = require('../Models/dataBase.js')

const User = db.user
const Tasks = db.tasks

// Refer to sequelize.org/master/manual for full API reference of queries.

// Query to add a new user to db.
const addUser = async (req, res) => {
    const data = req.body
    let newUserData = {
        name: data['username'],
        password: data['password']
    }

    const newUser = await User.create(newUserData)
    res.status(200).send(newUser)
    console.log(newUser + ' added to database!')
}

module.exports = {
    addUser,
}



