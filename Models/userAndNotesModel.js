module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
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
        },
    }, {
        tableName: 'users'
    })

    const Notes = sequelize.define('note', {
        userId : {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
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
    }, {
        tableName: 'note'
    })

    User.hasMany(Notes, {
        foreignKey: 'userId',
    })
    Notes.belongsTo(User, {
        foreignKey: 'userId',
    }
    )


    return [User, Notes]
}