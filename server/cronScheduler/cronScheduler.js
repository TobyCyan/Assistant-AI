
/*
const cron = require('node-cron')
const { Op } = require('sequelize');
const db = require('../Models/dataBase')

const Tasks = db.tasks
const RecurringTasks = db.recurringTasks

cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));

        // Fetch recurring tasks that need to be processed (lastCreated was before today)
        const recurringTasks = await RecurringTasks.findAll({
            where: {
                nextCreation: {
                    [Op.lte]: today
                }
            }
        });

        for (const task of recurringTasks) {
            const { id, userId, title, description, category, priority, interval, lastCreated } = task;

            // Calculate the next creation date based on the interval
            const nextCreationDate = new Date(lastCreated);
            nextCreationDate.setDate(nextCreationDate.getDate() + interval);

            // Create new tasks in the `tasks` table
            await Tasks.create({
                userId,
                title,
                description,
                category,
                priority,
                dueDate: today // or set a specific due date if needed
            });

            // Update `lastCreated` to the new date
            await RecurringTasks.update(
                { lastCreated: nextCreationDate },
                { where: { id } }
            );
        }
    } catch (err) {
        console.error('Error occured in adding all tasks', err)
    }
})
*/