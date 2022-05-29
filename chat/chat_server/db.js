const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat');
const conn = mongoose.connection;

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

// 定义 chats 集合的文档结构
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
  // 定义能操作 chats 集合数据的 Model
const ChatModel = mongoose.model('chat', ChatSchema);

conn.on('connected',async function () {
    console.log('数据库连接成功');
    // try {
    //     const one = await StoryModel.findOne(); // 查询数据库是否初始化
    //     if (one === null) {
    //         // 初始化 
    //         // StoryModel.create({
    //         //     creator: 'common',
    //         //     title: '普通用户',
    //         //     content:'dsflkajdffdaf',
    //         //     img:"dsfsdfsdfsdfsdfsdf"
    //         // });      
         
    //     }
    //     // console.log(StoryModel.findOne())
    // } catch (error) {
    //     console.log('数据库初始化失败', error);
    // }
});


function dateTimeToParts(date) {
    let day = date.getDate().toString().length <= 1 ? '0' + date.getDate() : date.getDate();
    let month = date.getMonth().toString().length <= 1 ? `0${parseInt(date.getMonth() + 1)}`: date.getMonth();
    let year = date.getFullYear().toString().length <= 1 ? '0' + date.getFullYear() : date.getFullYear();
    let hours = date.getHours().toString().length <= 1 ? '0' + date.getHours() : date.getHours();
    let minutes = date.getMinutes().toString().length <= 1 ? '0' + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds().toString().length <= 1 ? '0' + date.getSeconds() : date.getSeconds();
    return { day, month, year, hours, minutes, seconds };
}


module.exports = {
    StoryModel: StoryModel,
    ChatModel:ChatModel
}