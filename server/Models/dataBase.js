const dbConfig = require('../config/dbConfig.js');
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.db,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

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
db.user = require('./userAndTasksModel.js')(sequelize, DataTypes)[0]
db.tasks = require('./userAndTasksModel.js')(sequelize, DataTypes)[1]
db.friendships = require('./userAndTasksModel.js')(sequelize, DataTypes)[2]
db.recurringTasks = require('./userAndTasksModel.js')(sequelize, DataTypes)[4]
db.items = require('./userAndTasksModel.js')(sequelize, DataTypes)[3]

// Force is false to prevent database from being recreated repeatly.
db.sequelize.sync({force: false})
.then(() => {
    console.log('Re-Synced!')
})

// Exports the db.
module.exports = db