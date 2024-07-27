module.exports = (sequelize, DataTypes) => {
    // Defines a user table with its parameters.
    const User = sequelize.define('User', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false
        },
        hasDoneTutorial: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, {
        tableName: 'users',
        schema: 'public', // Specify schema if necessary (default is 'public')
    });

    // Defines a tasks table with its parameters.
    const Tasks = sequelize.define('Task', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
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
            type: DataTypes.DATE,
            allowNull: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dateCompleted: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reminderSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    }, {
        tableName: 'tasks',
        schema: 'public', // Specify schema if necessary (default is 'public')
    });

    const Friendships = sequelize.define('Friendship', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false
        },
        relatingUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        relatedUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'friendships',
        schema: 'public', // Specify schema if necessary (default is 'public')
    });

    const Items = sequelize.define('Item', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        itemId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    }, {
        tableName: 'items',
        schema: 'public', // Specify schema if necessary (default is 'public')
    });

    const RecurringTasks = sequelize.define('RecurringTask', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
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
        priority: {
            type: DataTypes.STRING,
            allowNull: false
        },
        interval: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        creationToDeadline: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reminderToDeadline: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lastCreated: {
            type: DataTypes.DATE,
            allowNull: true
        },
        nextCreation: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'recurringtasks',
        schema: 'public', // Specify schema if necessary (default is 'public')
    });

    // Defines relationships
    User.hasMany(Tasks, { foreignKey: 'userId' });
    Tasks.belongsTo(User, { foreignKey: 'userId' });

    Friendships.belongsTo(User, { foreignKey: 'relatingUser', as: 'RelatingUser' });
    Friendships.belongsTo(User, { foreignKey: 'relatedUser', as: 'RelatedUser' });

    User.hasMany(Items, { foreignKey: 'userId' });
    Items.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(RecurringTasks, { foreignKey: 'userId' });
    RecurringTasks.belongsTo(User, { foreignKey: 'userId' });

    return [User, Tasks, Friendships, Items, RecurringTasks];
};

