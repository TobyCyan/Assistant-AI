const db = require('../Models/dataBase.js')

const User = db.users
const Friendships = db.friendships
const {Op} = require('sequelize')

const getFriends = async (req, res) => {
    const { id } = req.user

    // Finds All Task Instances of the User.
    const friendships = await Friendships.findAll({
        where: {
            type: 'friend',
            [Op.or]: [
                { relatingUser: id },
                { relatedUser: id }
            ]
        },
        include: [
            {
                model: User,
                as: 'RelatingUser',
                attributes: ['id', 'name', 'points']
            },
            {
                model: User,
                as: 'RelatedUser',
                attributes: ['id', 'name', 'points']
            }
        ]
    });

    if(friendships) {
        console.log(friendships)
        const friends = friendships.map(friendship => {
            if (friendship.relatingUser === id) {
                // If the current user is the relatingUser, get the relatedUser's information
                return {
                    id: friendship.RelatedUser.id,
                    name: friendship.RelatedUser.name,
                    points: friendship.RelatedUser.points
                };
            } else {
                // If the current user is the relatedUser, get the relatingUser's information
                return {
                    id: friendship.RelatingUser.id,
                    name: friendship.RelatingUser.name,
                    points: friendship.RelatingUser.points
                };
            }
        });
        console.log(friends)
        res.send({friends})
    } else {
        res.status(400).send('Unable to retrieve user friends')
    }
}

const getFriendRequests = async (req, res) => {
    const { id } = req.user

    // Finds All Request Instances of the User.
    const requests = await Friendships.findAll({
        where: {
            type: 'request',
            [Op.or]: [
                { relatingUser: id },
                { relatedUser: id }
            ]
        },
        include: [
            {
                model: User,
                as: 'RelatingUser',
                attributes: ['id', 'name', 'points']
            },
            {
                model: User,
                as: 'RelatedUser',
                attributes: ['id', 'name', 'points']
            }
        ]
    });

    // Sends the List of TaskModals as a Response If TaskModals Found.
    if (requests) {
        console.log(requests)
        //Relating user is always the requester
        const sentRequests = requests.filter(request => request.relatingUser === id).map(request => {
            const formattedRequest = {
                id: request.RelatedUser.id,
                name: request.RelatedUser.name,
                points: request.RelatedUser.points,
            }

            return formattedRequest
        })
        console.log(sentRequests)
        //Related user is the receiver
        const receivedRequests = requests.filter(request => request.relatedUser === id).map(request => {
            const formattedRequest = {
                id: request.RelatingUser.id,
                name: request.RelatingUser.name,
                points: request.RelatingUser.points,
            }

            return formattedRequest
        })
        console.log(receivedRequests)
        res.send({sentRequests, receivedRequests})
    } else {
        // Sends an Error Message If The User is Invalid or TaskModals are Not Found.
        res.status(404).send('Invalid friendship requests')
    }
}


/**
 * Adds A New Task to the Task Table.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const createFriendRequest = async (req, res) => {
    const receiverName = req.params.username
    const { id } = req.user

    /**
     * Data of the New Task.
     * @type {Object}
     */

    const receiver = await User.findOne({
        where: {
            name: receiverName
        }
    })

    //Relating user is always the requester
    if(receiver) {
        const request = {
            relatingUser: id,
            relatedUser: receiver.id,
            type: 'request'
        }

        // Create the New Task Instance.
        const newRequest = await Friendships.create(request)
        if(newRequest) {
            // Sends the Added Task as a Response to be Added into the Task List.
            res.status(201).send({newRequest})
            console.log(`Request from ${ id } to ${receiver}  added to database!`)
        } else {
            res.status(400).send('Invalid Request')
        }
    } else {
        res.status(404).send('Could not find receiver')
    }
}


/**
 * Edits the Given Task and Updates its Data.
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const updateFriendRequest = async (req, res) => {
    const requesterName = req.params.username
    const { id } = req.user

    const requester = await User.findOne({
        where: {
            name: requesterName
        }
    })

    if(requester) {
        // Data of the Request
        const request = {
            relatingUser: requester.id,
            relatedUser: id,
            type: 'friend'
        }

        // Updates the Task Instance.
        const updateRequest = await Friendships.update(request,
            {
                where: {
                    relatingUser: requester.id,
                    relatedUser: id
                }
            }
        )

        if(updateRequest) {
            // Sends the Added Task as a Response to be Added into the Task List.
            res.status(200).send({request})
            console.log(`Request from ${requester} to ${ id } accepted!`)
        } else {
            res.status(400).send('Invalid Request')
        }
    } else {
        res.status(404).send('Could not find requester')
    }
}

const deleteFriendRequest = async (req, res) => {
    const { id } = req.user
    const requesterName = req.params.username

    const requester = await User.findOne({
        where: {
            name: requesterName
        }
    })

    if(requester) {
        const result = await Friendships.destroy({
            where: {
                relatingUser: requester.id,
                relatedUser: id
            }
        }).catch(err => {
            console.error('Error Deleting Request / No Such Request', err)
        })

        if (result) {
            if(result > 0) {
                console.log("Deleted Successfully");
                res.send({ message: "Request deleted successfully" });
            } else {
                console.log("No request found to delete");
                res.status(404).send({ error: "Request not found" });
            }
        }
    }
}


module.exports = {
    getFriends,
    getFriendRequests,
    createFriendRequest,
    updateFriendRequest,
    deleteFriendRequest,
}