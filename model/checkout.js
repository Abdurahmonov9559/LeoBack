const {Schema, model} = require('mongoose')

const checkout = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    name:String,
    lname:String,
    phone:String,
    email:String,

    createdAt:{
        type:Date,
        default: Date.now()
    },
    status: {
        type:Number,
        default:0
    },
    cart: [
        {
            _id: {
                type:Schema.Types.ObjectId,
                ref:'Product'
            },
            count: {
                type:Number,
                default:1
            }
        }
    ],
    city:String,
    delivery:String,
    date:Date,
    street:String,
    time:String,
    flat:String,
    comment:String,
    payment:Number,

})

module.exports = model('Checkout',checkout)