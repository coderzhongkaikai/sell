

const mongoose = require('mongoose');
// const { statusDic } = require('./dictionary');
const { Schema } = mongoose;
 

const orderSchema = new Schema({ // 用户
    place: { // 
        type: String,
    },
    creator: { // 
        type: String,
    },
    date: { // 
        type: String,
    },
    name:{
        type: String,
        default:''
    },
    phone:{
        type: String,
        default:''
    },
    num:{
        type: Number,
        default:''
    },
    money:{
        type: Number,
    },
    state:{
        type: Number,
        default:0   
    },
    entryTime: {// 注册的时间
        type: Date,
        default: Date.now
    }, 
},{ timestamps: true });


 

const OrderModel=mongoose.model('order', orderSchema);

module.exports = {
    OrderModel
}
