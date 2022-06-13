const {Schema,model} = require('mongoose')

const user = new Schema({
    name:String,
    email:{
        type:String,
        unique:true
    },
    phone:{
        type:String,
        unique:true
    },
    password:String,
    token:String,
    tokenExp:Date,
    createdAt:{
        type:Date,
        default:Date.now()
    },
    avatar:String,
    address:String,
    city:String,
    index:String,
    loginDate:[Date],
    payment:{
        type:Number,
        default:0,
    },
    delivery:{
        type:Number,
        default:0
    }
})

module.exports = model('User',user)