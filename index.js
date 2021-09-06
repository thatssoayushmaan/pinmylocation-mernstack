require('dotenv').config()

const express = require('express')
const app = express()

const pinRoute = require('./routes/pin')
const userRoute = require('./routes/users')

//Middleware
app.use(express.json())

const connectDB = require('./config/db.js')
connectDB()

app.use('/api/pins', pinRoute)
app.use('/api/users', userRoute)

app.listen(process.env.PORT || 5000, () => {
    console.log("Server up and running")
})


