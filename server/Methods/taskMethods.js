const db = require('../Models/dataBase.js')
const User = db.user
const Tasks = db.tasks
const {getTodayDate} = require('../utilities/utilities')

// Refer to sequelize.org/master/manual for full API reference of queries.

/**
 * Gets All the User's Tasks by the userId.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const getTasks = async (req, res) => {
    const { id } = req.user
    console.log(id)

    // Finds All Task Instances of the User.
    const tasks = await Tasks.findAll(
        {
            where: {
                userId: id
            }
        }
    )
    console.log(tasks)

    // Sends the List of Tasks as a Response If Tasks Found.
    if (tasks) {
        res.send({tasks})
    } else {
        // Sends an Error Message If The User is Invalid or Tasks are Not Found.
        res.status(404).send('Invalid User/ Tasks')
    }
}

/**
 * Adds A New Task to the Task Table.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const addTask = async (req, res) => {
    const {id} = req.user
    const data = req.body

    /** 
     * Data of the New Task.
     * @type {Object}
     */
    let newTaskData = {
        userId: id,
        title: data['title'],
        description: data['description'],
        category: data['category'],
        deadline: data['deadline'],
        priority: data['priority'],
        reminder: data['reminder'],
        completed: data['completed'],
        dateCompleted: null,
    }
    // Create the New Task Instance.
    const newTask = await Tasks.create(newTaskData)
    if(newTask) {
        // Sends the Added Task as a Response to be Added into the Task List.
        res.status(201).send({newTask})
        console.log(newTask.title + ' added to database!')
    } else {
        res.status(400).send('Invalid User/ Tasks')
    }
}


/**
 * Edits the Given Task and Updates its Data.
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 */
const editTask = async (req, res) => {
    const {id} = req.user
    const data = req.body

    // Data of the Edited Task.
    let updateFields = {
        title: data['title'],
        description: data['description'],
        category: data['category'],
        deadline: data['deadline'],
        priority: data['priority'],
        reminder: data['reminder'],
        completed: data['completed'],
    }
    // Updates the Task Instance.
    const editTask = await Tasks.update(updateFields,
        {
            where: {
                userId: id,
                id: data['taskId']
            }
        }
    )

    if(editTask) {
        // Sends the Edited Task as a Response to be Added into the Task List.
        res.status(200).send({updateFields})
        console.log(`${editTask[0]} task edited!`)
    }
}

/**
 * Completes the Given Task.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 * @throws {Error} Throws an error if the task completion fails.
 */
const completeTask = async (req, res) => {
    const {id} = req.user
    console.log(id)
    const completedTask = req.body
    const updateFields = {
        completed: completedTask.completed,
        points: completedTask.points,
        dateCompleted: getTodayDate(),
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
    await userData.increment(
        'points',
        {
            by: completedTask.points
        }
    )
    .catch(err => console.error('Error Updating Points', err))

    console.log(completedTask)
    // Update the Completion Status of the Task.
    const updated = await Tasks.update(updateFields,
        {
            where: {
                userId: id,
                id: completedTask.id
            }
        }
    )
    .catch(err => {
        console.error('Error Completing Task', err)
    })

    if(updated) {
        // Sends an ok Response.
        res.status(200).send({completedTask, userUpdatedPoints: userData.points})
        console.log('Points Successfully Added!')
    }
}

/**
 * Uncompletes the Given Task.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 * @throws {Error} Throws an error if the task uncompletion fails.
 */
const uncompleteTask = async (req, res) => {
    const { id } = req.user
    const {uncompletedTask, toDeduct} = req.body
    const updateFields = {
        completed: uncompletedTask.completed,
        points: 0,
        dateCompleted: null,
    }

    // Finds the User Instance That InCompleted the Task.
    const userData = await User.findOne(
        {
            where: {
                id: id
            }
        }
    )

    // Decrements the User's Points
    await userData.decrement(
        'points',
        {
            by: toDeduct
        }
    )
    .catch(err => console.error('Error Updating Points', err))

    console.log(id)

    // Update the Completion Status of the Task.
    updated = await Tasks.update(updateFields,
        {
            where: {
                userId: id,
                id: uncompletedTask.id
            }
        }
    )
    .catch(err => {
        console.error('Error InCompleting Task', err)
        return
    })

    if(updated) {
        // Sends an ok Response.
        res.status(200).send({uncompletedTask, userUpdatedPoints: userData.points})
        console.log('Points Successfully Deducted!')
    }
}

/**
 * Deletes the Given Task.
 * @async
 * @param {*} req The request from the front-end.
 * @param {*} res The response to the front-end.
 * @throws {Error} Throws an error if the task deletion fails.
 */
const deleteTask = async (req, res) => {
    const {id} = req.user
    const {taskId} = req.body

    // Deletes the Task Instance from the Task Table.
    const result = await Tasks.destroy({
        where: {
            id: taskId,
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
    getTasks,
    addTask,
    editTask,
    completeTask,
    uncompleteTask,
    deleteTask,
}



