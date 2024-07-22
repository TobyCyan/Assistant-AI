const cron = require('node-cron')
const { Op } = require('sequelize');
const db = require('../Models/dataBase')

const Tasks = db.tasks
const Scheduler = db.recurringTasks

const task = async () => {
    try {
        const now = new Date();
        now.setHours(now.getHours() + 8)

        // Fetch recurring tasks that need to be processed (lastCreated was before today)
        const recurringTasks = await Scheduler.findAll({
            where: {
                nextCreation: {
                    [Op.lte]: now
                }
            }
        });

        if(recurringTasks) {
            console.log(`${recurringTasks} retrieved`)
        }

        for (const task of recurringTasks) {
            const {
                id,
                userId,
                title,
                description,
                category,
                priority,
                interval,
                creationToDeadline,
                reminderToDeadline,
                lastCreated,
                nextCreation
            } = task;

            const DayOfCreation = new Date(nextCreation)

            const newDeadline = new Date(DayOfCreation)
            newDeadline.setDate(newDeadline.getDate() + creationToDeadline)

            const newReminder = new Date(DayOfCreation)
            newReminder.setDate(newReminder.getDate() + (interval - reminderToDeadline))

            // Create new tasks in the `tasks` table
            const createdTask = await Tasks.create({
                userId,
                title,
                description,
                category,
                deadline: newDeadline,
                priority,
                reminder: newReminder,
                completed: false,
                dateCompleted: null,
            });

            if(createdTask) {
                console.log(`Node-cron created ${createdTask}`)
            }

            // Calculate the next creation date based on the interval
            const updatedCreation = new Date(DayOfCreation)
            updatedCreation.setDate(updatedCreation.getDate() + interval)

            // Update `lastCreated` to the new date and next Creation Date
            await Scheduler.update({
                    lastCreated: nextCreation,
                    nextCreation: updatedCreation,
                },
                {where:
                        {id}
                }
            );
        }
    } catch (err) {
        console.error('Error occured in adding all tasks', err)
    }
};

cron.schedule('* * * * * *', task)
