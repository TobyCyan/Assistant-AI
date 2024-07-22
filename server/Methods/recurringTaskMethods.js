const db = require('../Models/dataBase.js')
const User = db.user
const RecurringTasks = db.recurringTasks
const {getTodayDate, getDaysDifference, addDays} = require('../utilities/utilities')

/**
 * Gets All the User's TaskModals by the userId.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const getRecurringTasks = async (req, res) => {
    const {id} = req.user
    console.log(id)

    // Finds All Task Instances of the User.
    const recurringTasks = await RecurringTasks.findAll(
        {
            where: {
                userId: id
            }
        }
    )
    console.log(recurringTasks)

    // Sends the List of TaskModals as a Response If TaskModals Found.
    if (recurringTasks) {
        res.send({recurringTasks})
    } else {
        // Sends an Error Message If The User is Invalid or TaskModals are Not Found.
        res.status(404).send('Invalid User/ TaskModals')
    }
}

const addRecurringTask = async (req, res) => {
    const {id} = req.user
    const data = req.body

    // Today in 00: 00 :00
    const interval = data['interval']
    const today = new Date(getTodayDate())

    /**
     * Data of the New Task.
     * @type {Object}
     */
    let newRecurringTask = {
        userId: id,
        title: data['title'],
        description: data['description'],
        category: data['category'],
        priority: data['priority'],
        creationToDeadline: data['creationToDeadline'],
        reminderToDeadline: data['reminderToDeadline'],
        interval,
        lastCreated: null,
        nextCreation: today,
    }

    console.log(newRecurringTask)

    // Create the New Task Instance.
    const createdRecurringTask = await RecurringTasks.create(newRecurringTask)
    if(createdRecurringTask) {
        // Sends the Added Task as a Response to be Added into the Task List.
        res.status(201).send({createdRecurringTask})
        console.log(createdRecurringTask.title + ' added to database!')
    } else {
        res.status(400).send('Invalid User/ TaskModals')
    }
}

const editRecurringTask = async (req, res) => {
    const {id} = req.user
    const data = req.body

    // Today in 00: 00 :00
    const interval = data['interval']
    const today = new Date(getTodayDate())
    const deadline = new Date(data['deadline'])
    const reminder = new Date(data['reminder'])
    const creationToDeadline = getDaysDifference(today, deadline)
    const creationToReminder = getDaysDifference(today, reminder)
    const nextCreation = addDays(today, interval)

    /**
     * Data of the New Task.
     * @type {Object}
     */
    let newRecurringTask = {
        userId: id,
        title: data['title'],
        description: data['description'],
        category: data['category'],
        priority: data['priority'],
        lastCreated: today,
        nextCreation,
        creationToDeadline,
        creationToReminder,
        interval,
    }
    // Create the New Task Instance.
    const createdRecurringTask = await RecurringTasks.create(newRecurringTask)
    if(createdRecurringTask) {
        // Sends the Added Task as a Response to be Added into the Task List.
        res.status(201).send({createdRecurringTask})
        console.log(createdRecurringTask.title + ' added to database!')
    } else {
        res.status(400).send('Invalid User/ TaskModals')
    }
}

const deleteRecurringTask = async (req, res) => {
    const {id} = req.user
    const {recTaskId} = req.body

    // Deletes the Task Instance from the Task Table.
    const result = await RecurringTasks.destroy({
        where: {
            id: recTaskId,
            userId: id
        }
    }).catch(err => {
        console.error('Error Deleting Task / No Such Task', err)
    })

    if (result) {
        if(result > 0) {
            console.log("Deleted Successfully");
            res.send({ message: "Task deleted successfully" });
        } else {
            console.log("No task found to delete");
            res.status(404).send({ error: "Task not found" });
        }
    }
}

module.exports = {
    getRecurringTasks,
    addRecurringTask,
    editRecurringTask,
    deleteRecurringTask,
}