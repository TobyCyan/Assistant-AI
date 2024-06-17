module.exports = (sequelize, DataTypes) => {
    // Defines a user table with its parameters.
    const User = sequelize.define('users', {
        id : {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'users'
    })

    // Defines a tasks table with its parameters.
    const Tasks = sequelize.define('task', {
        userId : {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: false
        },
        priority: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reminder: {
            type: DataTypes.DATE
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: 'task'
    })

    // Defines a one-to-many relationship between a user and their tasks.
    User.hasMany(Tasks, {
        foreignKey: 'userId',
    })
    Tasks.belongsTo(User, {
        foreignKey: 'userId',
    }
    )

    // Returns the 2 tables in an array.
    return [User, Tasks]
}