const db = require('../Models/dataBase.js')
const User = db.user
const Tasks = db.tasks

// Refer to sequelize.org/master/manual for full API reference of queries.

// Adds A New Task to the Task Table.
const addTask = async (req, res) => {
    const {id} = req.user
    const data = req.body

    // Data of the New Task.
    let newTaskData = {
        userId: id,
        title: data['title'],
        description: data['description'],
        category: data['category'],
        deadline: data['deadline'],
        priority: data['priority'],
        reminder: data['reminder'],
        completed: data['completed'],
    }
    // Create the New Task Instance.
    const newTask = await Tasks.create(newTaskData)
    // Sends the Added Task as a Response to be Added into the Task List.
    res.send({newTask: newTask})
    console.log(newTask + ' added to database!')
}

// Edits the Given Task and Updates its Data.
const editTask = async (req, res) => {
    console.log(req.body)
    const data = req.body
    const {id} = req.user

    // Data of the Edited Task.
    let editTaskData = {
        title: data['title'],
        description: data['description'],
        category: data['category'],
        deadline: data['deadline'],
        priority: data['priority'],
        reminder: data['reminder'],
        completed: data['completed'],
    }
    // Updates the Task Instance.
    const editTask = await Tasks.update(editTaskData, 
        {
            where: {
                userId: id,
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
    const {id} = req.user
    const completedTask = req.body
    console.log(completedTask)

    // Finds the User Instance That Completed the Task.
    const userData = await User.findOne(
        {
            where: {
                id
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

    // Update the Completion Status of the Task.
    await Tasks.update(completedTask,
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

    // Sends an ok Response.
    res.status(200).send('Task Completed!')
    console.log('Points Successfully Added!')

}

// UnCompletes the Given Task.
const uncompleteTask = async (req, res) => {
    const {id} = req.user
    const {uncompletedTask, toDeduct} = req.body

    // Finds the User Instance That InCompleted the Task.
    const userData = await User.findOne(
        {
            where: {
                id
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

    // Update the Completion Status of the Task.
    await Tasks.update(uncompletedTask,
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

    // Sends an ok Response.
    res.status(200).send('Task Uncompleted!')
    console.log('Points Successfully Deducted!')
}

// Deletes the Given Task.
const deleteTask = async (req, res) => {
    const {id} = req.user
    const {taskId} = req.body
    console.log(id)
    console.log(taskId)

    // Deletes the Task Instance from the Task Table.
    try {
        const result = await Tasks.destroy({
            where: {
                id: taskId,
                userId: id
            }
        })
        if (result > 0) {  // Check if any rows were deleted
            console.log("Deleted Successfully");
            res.send({ message: "Task deleted successfully" });
        } else {
            console.log("No task found to delete");
            res.status(404).send({ error: "Task not found" });
        }
    } catch(error) {
        console.error('Error Deleting Task', error)
    }
    console.log('Task Deleted Phase over!')

}


module.exports = {
    addTask,
    editTask,
    completeTask,
    uncompleteTask,
    deleteTask,
}



