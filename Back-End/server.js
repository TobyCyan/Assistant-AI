const express = require('express')
const app = express()
const port = 5000

app.get('/api', (req, res) => {
    res.json('Hello!')
})

app.listen(port, () => {
    console.log('App is listening on port 5000.')
})
