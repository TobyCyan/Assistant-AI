module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('user', {
        id : {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
            
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING
        }
    })

    const Notes = sequelize.define('notes', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        reminderDate: {
            type: DataTypes.DATE
        },
        reminderTime: {
            type: DataTypes.TIME
        }
    })

    User.hasMany(Notes)
    Notes.belongsTo(User)

    return [User, Notes]
}