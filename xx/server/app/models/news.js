

const mongoose = require('mongoose');
// const { statusDic } = require('./dictionary');
const { Schema } = mongoose;
 

const newsSchema = new Schema({ // 用户
    title: { // 
        type: String,
    },
    content: { //状态0 1置顶
        type: String,
        default:''
    },
    tag:{
        type: String,
        default:''
    },
    entryTime: {// 注册的时间
        type: Date,
        default: Date.now
    }, 
},{ timestamps: true });


 

const NewsModel=mongoose.model('news', newsSchema);

module.exports = {
    NewsModel
}
