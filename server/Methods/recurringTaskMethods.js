const db = require('../Models/dataBase.js')

const RecurringTasks = db.recurringtasks

/**
 * Gets All the User's TaskModals by the userId.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const getRecurringTasks = async (req, res) => {
    const { id } = req.user
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
    const { id } = req.user
    const data = req.body

    // Today in 00: 00 :00
    const interval = data['interval']

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
        nextCreation: data['nextCreation'],
    }

    console.log(newRecurringTask.nextCreation + '!!!!!!!!!!!!!!!!!!!!')

    // Create the New Task Instance.
    const createdRecurringTask = await RecurringTasks.create(newRecurringTask)
    if(createdRecurringTask) {
        // Sends the Added Task as a Response to be Added into the Task List.
        res.status(201).send({createdRecurringTask})
        console.log(createdRecurringTask.title + ' added to database!')
    } else {
        res.status(400).send('Failed to add recurring task')
    }
}

const editRecurringTask = async (req, res) => {
    const { id } = req.user
    const data = req.body

    // Today in 00: 00 :00
    const taskId = data.taskId

    /**
     * Data of the New Task.
     * @type {Object}
     */
    let updatedRecurringTask = {
        title: data['title'],
        description: data['description'],
        category: data['category'],
        priority: data['priority'],
        nextCreation: data['nextCreation'],
        creationToDeadline: data['creationToDeadline'],
        reminderToDeadline: data['reminderToDeadline'],
        interval: data['interval'],
    }
    // Create the New Task Instance.
    const editedRecurringTask = await RecurringTasks.update(updatedRecurringTask,
        {
            where: {
                id: taskId,
                userId: id,
            }
        }
    )

    if(editedRecurringTask) {
        // Sends the Added Task as a Response to be Added into the Task List.
        res.status(200).send({updatedRecurringTask})
        console.log(updatedRecurringTask.title + ' added to database!')
    } else {
        res.status(400).send('Failed to edit recurring task')
    }
}

const deleteRecurringTask = async (req, res) => {
    const { id } = req.user
    const {taskId} = req.body

    // Deletes the Task Instance from the Task Table.
    const result = await RecurringTasks.destroy({
        where: {
            id: taskId,
            userId: id,
        }
    }).catch(err => {
        console.error('Error Deleting Recurring Task / No Such Task', err)
    })

    if (result) {
        if(result > 0) {
            console.log("Deleted Successfully");
            res.send({ message: "Recurring Task deleted successfully" });
        } else {
            console.log("No task found to delete");
            res.status(404).send({ error: "Recurring Task not found" });
        }
    }
}

module.exports = {
    getRecurringTasks,
    addRecurringTask,
    editRecurringTask,
    deleteRecurringTask,
}