const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(process.env.URL)
    console.log("MongoDB connected")
}

module.exports = connectDB