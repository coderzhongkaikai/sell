const mongoose = require('mongoose');
// const { statusDic } = require('./dictionary');
const { Schema } = mongoose;

const chatSchema = new Schema({  
    creator: { //
        type: String,
    },
    username:{ // 
        type: String,
    },
    avatar:{ // 
        type: String,
    },
    content: { // 
        type: String,
        default:''
    },
    imgs: { // 
        type: [String],
        default: []
    },
    like: { // 
        type: [String],
        default: []
    },
    state: { //状态0 1置顶
        type: Number,
        default:0
    },
    commentstate: { //状态0 1置顶
        type: Number,
        default:0
    },
    entryTime: {
        type: Date,
        default: Date.now
    }, // 注册的时间
});

const commentSchema = new Schema({ //
    chat_id:{
        type: String,
    },
    creator: { // 
        type: String,
    },
    username:{ // 
        type: String,
    },
    avatar:{ // 
        type: String,
    },
    content: { //状态0 1置顶
        type: String,
        default:''
    },
    entryTime: {
        type: Date,
        default: Date.now
    }, // 注册的时间
});


 

const ChatModel=mongoose.model('chat', chatSchema);
const CommentModel=mongoose.model('comment', commentSchema);

module.exports = {
    ChatModel,CommentModel
}
