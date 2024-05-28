module.exports = {
    host: 'localhost',
    user: 'root',
    password: '',
    db: 'test',
    dialect: 'mysql',

    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
