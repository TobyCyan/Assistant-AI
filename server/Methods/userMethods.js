const db = require('../Models/dataBase.js')
const User = db.user
const Tasks = db.tasks

// Refer to sequelize.org/master/manual for full API reference of queries.

// Adds A New Task to the Task Table.
const addTask = async (req, res) => {
    const data = req.body

    // Data of the New Task.
    let newTaskData = {
        userId: data['userId'],
        title: data['title'],
        description: data['description'],
        category: data['category'],
        deadline: data['deadline'],
        priority: data['priority'],
        reminder: data['reminder'],
        completed: data['completed']
    }
    // Create the New Task Instance.
    const newTask = await Tasks.create(newTaskData)
    // Sends the Added Task as a Response to be Added into the Task List.
    res.send({newTask: newTask})
    console.log(newTask + ' added to database!')
}

// Edits the Given Task and Updates its Data.
const editTask = async (req, res) => {
    const data = req.body

    // Data of the Edited Task.
    let editTaskData = {
        title: data['title'],
        description: data['description'],
        category: data['category'],
        deadline: data['deadline'],
        priority: data['priority'],
        reminder: data['reminder']
    }
    // Updates the Task Instance.
    const editTask = await Tasks.update(editTaskData, 
        {
            where: {
                userId: data['userId'],
                id: data['taskId']
            }
        }
    )

    // Sends the Edited Task as a Response to be Added into the Task List.
    res.send({editTask: editTask})
    console.log(editTask + ' edited!')
}

// Completes the Given Task.
const completeTask = async (req, res) => {
    const { taskId, userId, points } = req.body

    // Data of the Completed Task.
    const completeTaskData = {
        completed: true
    }

    // Finds the User Instance That Completed the Task.
    const userData = await User.findOne(
        {
            where: {
                id: userId
            }
        }
    )

    // Increments the User's Points.
    await userData.increment(
        'points',
        {
            by: points
        }
    )
    .catch(err => console.error('Error Updating Points', err))

    // Update the Completion Status of the Task.
    await Tasks.update(completeTaskData,
        {
            where: {
                userId: userId,
                id: taskId
            }
        }
    )
    .catch(err => {
        console.error('Error Completing Task', err)
        return
    })

    // Sends an ok Response.
    res.status(200).send('Task Completed!')
    console.log('Points Successfully Added!')

}

// InCompletes the Given Task.
const inCompleteTask = async (req, res) => {
    const { taskId, userId, pointsToBeDeducted } = req.body

    // Data of the InCompleted Task.
    const inCompleteTaskData = {
        completed: false
    }

    // Finds the User Instance That InCompleted the Task.
    const userData = await User.findOne(
        {
            where: {
                id: userId
            }
        }
    )

    // Decrements the User's Points
    await userData.decrement(
        'points',
        {
            by: pointsToBeDeducted
        }
    )
    .catch(err => console.error('Error Updating Points', err))

    // Update the Completion Status of the Task.
    await Tasks.update(inCompleteTaskData,
        {
            where: {
                userId: userId,
                id: taskId
            }
        }
    )
    .catch(err => {
        console.error('Error InCompleting Task', err)
        return
    })

    // Sends an ok Response.
    res.status(200).send('Task InCompleted!')
    console.log('Points Successfully Deducted!')
}

// Deletes the Given Task.
const deleteTask = async (req, res) => {
    const {taskId, userId} = req.body

    // Deletes the Task Instance from the Task Table.
    await Tasks.destroy({
        where: {
            id: taskId,
            userId: userId
        }
    })
    .catch(err => console.error('Error Deleting Task', err))

    console.log('Task Successfully Deleted!')

}

module.exports = {
    addTask,
    editTask,
    completeTask,
    inCompleteTask,
    deleteTask,
}



