const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    username: {
        type: String,
        required : true,
    },
    title: {
        type : String,
        required: true
    },
    desc: {
        type : String,
        required: true
    },
    lat : {
        type: Number,
        required: true
    },
    long : {
        type: Number,
        required: true
    },
    rating : {
        type: Number,
        required: true,
        min : 0,
        max : 5
    }
},{
    timestamps : true
})

const Post = mongoose.model('post', postSchema)

module.exports = Post