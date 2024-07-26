/*
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
*/
const {Sequelize, DataTypes} = require('sequelize')

/*
const sequelize = new Sequelize({
    dialect: 'postgres',
    database: 'assistantai2',
    user: 'daryl',
    password: '790800',
    host: 'localhost',
    port: 5432,
    ssl: true,
    clientMinMessages: 'notice',
});
*/

const sequelize = new Sequelize('postgresql://postgres.zbtrxoctfmzcwrznhcdp:JoshuAIOrbital123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres');

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