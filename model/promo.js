const {Schema,model} = require('mongoose')

const promo = new Schema({
    title:String,
    text:String,
    img:String,
    bigimg:String,
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

module.exports = model('Promo',promo)