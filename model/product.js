const {Schema, model} = require('mongoose')

const product = new Schema({
    title: String,
    category: {
        type: Schema.Types.ObjectId,
        ref:'Category'
    },
    price:Number,
    sale:Number,
    text:String,
    order:Number,
    leo:Number,
    gidrox:Number,
    count: {
        type: Number,
        default: 1
    },
    news:{
        type:Number,
        default:0
    },
    top:{
        type:Number,
        default:0
    },
    view:Number,
    review:[
        {
            name:String,
            createdAt:{
                type:Date,
                default: Date.now()
            },
            mark:{
                type:Number,
                default:0
            },
            title:String,
            text:String,
            status: {
                type:Number,
                default:1
            }
        }
    ],
    img:[String],
    atributes: [
        {
            atribut: {
                type:Schema.Types.ObjectId,
                ref:'Atribut'
            },
            value:String,
        }
    ],
    status:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
    
})

module.exports = model('Product',product)