const {Schema,model} = require('mongoose')

const blog = new Schema({
    title:String,
    text:String,
    img:String,
    description:String,
    createdAt:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:Number,
        default:0
    },
    order:{
        type:Number,
        default:0,
    }
})

module.exports = model('Blog',blog)