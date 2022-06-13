const {Schema,model} = require('mongoose')

const feedback = new Schema({
    name:String,
    phone:String,
    text:String,
    type:{
        type:Number,
        default:0
    },
    status: {
        type:Number,
        default:0
    },
    createdAt: {
        type:Date,
        default:Date.now()
    }
})

module.exports = model('Feedback',feedback)