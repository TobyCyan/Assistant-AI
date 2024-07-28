const {Sequelize, DataTypes} = require('sequelize')
require('dotenv').config()

// Enter name of database, user, password and port (psql default - 5432)

const sequelize = new Sequelize({
    dialect: 'postgres',
    database: `${process.env.DATABASE}`,
    user: `${process.env.USER}`,
    password: `${process.env.PASSWORD}`,
    host: 'localhost',
    port: 5432,
    ssl: true,
    clientMinMessages: 'notice',
});

sequelize.authenticate()
.then(() => {
    console.log('Authenticated!')
})
.catch((err) => {
    console.log('Authentication Error!')
})

// Initialize a database.
const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

// Define the tables in the db.
db.users = require('./userAndTasksModel.js')(sequelize, DataTypes)[0]
db.tasks = require('./userAndTasksModel.js')(sequelize, DataTypes)[1]
db.friendships = require('./userAndTasksModel.js')(sequelize, DataTypes)[2]
db.items = require('./userAndTasksModel.js')(sequelize, DataTypes)[3]
db.recurringtasks = require('./userAndTasksModel.js')(sequelize, DataTypes)[4]

// Force is false to prevent database from being recreated repeatly.
db.sequelize.sync({force: false})
.then(() => {
    console.log('Re-Synced!')
})

// Exports the db.
module.exports = db