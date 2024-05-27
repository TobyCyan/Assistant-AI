const {createPool} = require('mysql');
import CryptoJS from 'crypto-js';

// Creates a pool of connections to the database 'test'
// which queries can be done parallelly
export const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
    connectionLimit: 10
})

// P.S. Install XAMPP to see the tables in localhost/phpmyadmin/
// Query to create the Users table with the UserID, Name and Password.
const createUsersTable = `CREATE TABLE if not exists Users (UserID int primary key auto_increment, Name varchar(255), Password varchar(255))`

// Query to create the Notes table with the Content, Reminder Date and Time, UserID as its Foreign Key.
const createNotesTable = `CREATE TABLE if not exists Note (Content varchar(255), ReminderDate DATE, ReminderTime TIME, UserID int, FOREIGN KEY (UserID) REFERENCES Users (UserID) ON DELETE CASCADE)`

// Executes the createUsersTable Query.
pool.query(createUsersTable, function(err, results, fields) {
    if (err) {
        console.log("Error Creating User Table!");
    } else {
        console.log("User Table Created!");
    }
});

// Executes the createNotesTable Query.
pool.query(createNotesTable, function(err, results, fields) {
    if (err) {
        console.log("Error Creating Notes Table!");
    } else {
        console.log("Notes Table Created!");
    }
});

function handleSignUp() {
    if (userData.username != '') {
        var hashedPW = CryptoJS.SHA512(password).toString();
        const addUser = `INSERT INTO Users (Name, Password) VALUES ('${username}', '${hashedPW}')`
        
        pool.query(addUser, function(err, results, fields) {
            if (err) {
                console.log("Error Adding User!");
            } else {
                console.log("User Successfully Added!");
            }
        })
    
    } else {
        console.log('Username cannot be empty!');
    }
}
