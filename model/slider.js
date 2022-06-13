const {Schema,model} = require('mongoose')

const slider = new Schema({
    title:String,
    text:String,
    link:String,
    img:String,
    status:{
        type:Number,
        default:0,
    },
    order:{
        type:Number,
        default:0,
    }
})

module.exports = model('Slider',slider)