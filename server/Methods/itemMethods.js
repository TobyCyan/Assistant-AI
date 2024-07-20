const db = require('../Models/dataBase.js')
const jwt = require('jsonwebtoken')

const User = db.user
const Items = db.items

const secretKey = process.env.Secret_Key

/**
 * Adds a new user to the database.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */

const getItems = async (req, res) => {
    const { id } = req.user
    console.log(id)

    // Finds All Task Instances of the User.
    const items = await Items.findAll(
        {
            where: {
                userId: id
            }
        }
    )
    console.log(items)

    // Sends the List of TaskModals as a Response If TaskModals Found.
    if (items) {
        res.send({items})
    } else {
        // Sends an Error Message If The User is Invalid or TaskModals are Not Found.
        res.status(404).send('Invalid User/ TaskModals')
    }
}

const createUserItem = async(req, res) => {
    const {id} = req.user
    console.log(id)
    const {itemId, points} = req.body

    let userItem = {
        userId: id,
        itemId,
    }

    // Finds the User Instance That Completed the Task.
    const userData = await User.findOne(
        {
            where: {
                id: id
            }
        }
    )

    // Increments the User's Points.
    const updatePoints = await userData.decrement(
        'points',
        {
            by: points
        }
    ).catch(err => console.error('Error Updating Points', err))

    if(updatePoints) {
        console.log('User Points deducted!')
    }

    const createdUserItem = await Items.create(userItem)
    if(createdUserItem) {
        res.status(201).send({createdUserItem})
        console.log(`User ${id} has item ${itemId} relationship added to database`)
    } else {
        console.log('Could not create userItem relationship')
    }
}

module.exports = {
    getItems,
    createUserItem,
}