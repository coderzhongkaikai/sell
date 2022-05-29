const mongoose = require('mongoose');
//连接数据库的chat表
mongoose.connect('mongodb://localhost:27017/chat');

const conn = mongoose.connection;

//定义一个story故事模型对象，用来表示每个故事
const StorySchema = mongoose.Schema({
    creator: {
        type: String
    },
    title: {
        type: String
    },
    img: {
        type: String
    },
    content: {
        type: String
    },
    createTime:{
        type: String
    }
},{ timestamps: true })
 
const StoryModel = mongoose.model('story', StorySchema);

// 定义 chat来存放每条信息
const ChatSchema = mongoose.Schema({
    creator: {
        type: String
    },
    room: {
        type: String
    },
    msg: {
        type: String
    },
  },{ timestamps: true });
const ChatModel = mongoose.model('chat', ChatSchema);

conn.on('connected',async function () {
    console.log('数据库连接成功');
});
module.exports = {
    StoryModel: StoryModel,
    ChatModel:ChatModel
}