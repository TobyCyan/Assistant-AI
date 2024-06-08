const jwt = require('jsonwebtoken')

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

module.exports = {
    authenticateToken,
}