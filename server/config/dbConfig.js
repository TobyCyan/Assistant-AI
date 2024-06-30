// To be included later in gitignore

module.exports = {
    host: 'localhost',
    user: 'user',
    password: '',
    db: 'AssistantAI',
    dialect: 'mysql',

    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
