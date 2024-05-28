const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5173

var corOptions = {
    origin: 'http://localhost:5173'
}

app.use(cors(corOptions))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.json('Hello!')
})

app.post('/', (req, res) => {
    const {parcel} = req.body
    if (!parcel) {
        console.log('Not Received!')
    }
})

app.listen(port, () => {
    console.log('App is listening on port 5173.')
})
