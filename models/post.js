const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    Date: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }

})

module.exports= mongoose.model('Post',postSchema,'posts')