const {Schema,model} = require('mongoose')

const oneclick = new Schema({
    name:String,
    address:String,
    phone:String,
    createdAt:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:Number,
        default:0
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    }
})

module.exports = model('Oneclick',oneclick)