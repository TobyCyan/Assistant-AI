const cron = require('node-cron')
const { Op } = require('sequelize');
const db = require('../Models/dataBase')
const nodemailer = require('nodemailer')

const Users = db.user
const Tasks = db.tasks
const Scheduler = db.recurringTasks

const email = process.env.NODEMAILER_EMAIL
const password = process.env.NODEMAILER_PW

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    pool: true,
    auth: {
        user: email,
        pass: password,
    }
});

const recurringTask = async () => {
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

            console.log(`${DayOfCreation} for ${title}`)

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

const sendReminderEmails = async () => {
    try {
        const now = new Date();
        now.setHours(now.getHours() + 8)

        // Fetch recurring tasks that need to be processed (lastCreated was before today)
        const reminders = await Tasks.findAll({
            where: {
                reminder: {
                    [Op.lte]: now
                },
                reminderSent: false,
                completed: false,
            }
        });

        if(reminders) {
            console.log(`${reminders} retrieved`)
        }

        for (const task of reminders) {
            try {
                const user = await Users.findOne({
                    where: {
                        id: task.userId
                    },
                });

                if (!user) {
                    console.log(`User with id ${task.userId} not found`);
                    continue; // Skip to the next task if the user is not found
                }

                const deadline = new Date(task.deadline)
                deadline.setHours(23, 59, 59, 999);

                const mailOptions = {
                    to: user.email,
                    subject: `Reminder: ${task.title} due on ${deadline}`,
                    text: `Reminder from Assistant AI: Your task "${task.title}" is due on ${deadline}!`
                };

                // Send email using your preferred email service
                // For example, using nodemailer:
                await transporter.sendMail(mailOptions);
                console.log(`Reminder sent to ${user.email} for task "${task.title}"`);

                await Tasks.update(
                    { reminderSent: true },
                    {where: {
                        id: task.id
                        }
                    }
                )
                console.log(`Task ${task.id} updated to reminderSent = true`);

            } catch (error) {
                console.error('Error processing task reminder:', error);
                // Handle the error appropriately
            }
        }
    } catch (err) {
        console.error('Error occured in sending reminders', err)
    }
}

cron.schedule('* * * * * *', recurringTask)
cron.schedule('0 * * * *', sendReminderEmails)
