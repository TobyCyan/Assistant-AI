const {Sequelize, DataTypes} = require('sequelize')
// const config = require("../config/dbConfig.js")

// const sequelize = new Sequelize({
//     dialect: config.dialect,
//     database: config.db,
//     user: config.user,
//     password: config.password,
//     host: config.host,
// });
const dbURL = process.env.DATABASE_URL;

const sequelize = new Sequelize(`${dbURL}`);

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