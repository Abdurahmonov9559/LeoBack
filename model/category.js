const {Schema, model} = require('mongoose')

const category = new Schema({
    title:String,
    img:{
        type:String,
        default: '/images/default.png'
    },
    status:{
        type:Number,
        default:0
    },
    order: {
        type:Number,
        default:0
    }

})

module.exports = model('Category',category)