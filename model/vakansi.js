const {Schema,model} = require('mongoose')

const vakansi = new Schema({
    title:String,
    text:String,
   
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
    },
    condi:[{
        name:String,
        sname:String,
        fname:String,
        phone:String,
        file:String,
        text:String,
        status:{
            type:Number,
        default:0},
        createdAt:{
        type:Date,
        default:Date.now()

        }

    }]
    
   
})

module.exports = model('Vakansi',vakansi)