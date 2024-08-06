// To be included later in gitignore

module.exports = {
    host: 'localhost',
    user: 'root',
    password: 'Test1234',
    db: 'AssistantAI',
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
