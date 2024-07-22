const jwt = require('jsonwebtoken')

/**
 * Authenticates the JSON Web Token (JWT) using the secret key.
 * @param {string} secretKey secret key to authenticate the JWT.
 * @returns {*} Returns a error coded response to the front-end.
 */
const authenticateToken = (secretKey) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) return res.sendStatus(401)

        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.sendStatus(401)
            req.user = user
            next()
        })
    }
}

/**
 * Gets today's date.
 * @returns {string} Today's date as a string.
 */
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().substring(0, 10);
}

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

/**
 * Difference in days, returns negative if date2 is earlier / date 1 is later.
 * @param {Date} date1 First date.
 * @param {Date} date2 Second date.
 * @returns {number} The floored difference between both dates in days.
 */
const getDaysDifference = (date1, date2) => {
    const timeDiff = date2.getTime() - date1.getTime()

    return Math.floor(timeDiff / (1000 * 3600 * 24))
}

module.exports = {
    authenticateToken,
    getTodayDate,
    addDays,
    getDaysDifference,
}