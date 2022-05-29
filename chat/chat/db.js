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
})
const StoryModel = mongoose.model('story', StorySchema);



conn.on('connected',async function () {
    console.log('database is connected successfully !!!');
    try {
        const one = await StoryModel.findOne(); // 查询数据库是否初始化
        if (one === null) {
            // 初始化 
            StoryModel.create({
                creator: 'common',
                title: '普通用户',
                content:'dsflkajdffdaf',
                img:"dsfsdfsdfsdfsdfsdf"
            });      
            console.log('数据库初始化成功');
        }
    
        // console.log(StoryModel.findOne())
    } catch (error) {
        console.log('数据库初始化失败', error);
    }
});
module.exports = {
    storyModel: StoryModel
}