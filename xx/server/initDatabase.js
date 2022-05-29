const mongoose = require('mongoose');

const RoleManagerModel = require('./app/models/role');

mongoose.set('useFindAndModify', false)
mongoose.connect('mongodb://localhost:27017/gztc', {
    useNewUrlParser: true,
    useUnifiedTopology: true //这个即是报的警告
});
const conn = mongoose.connection;
conn.on('connected', async function () {
    console.log('数据库连接成功');
    try {
        const one = await RoleManagerModel.findOne(); // 查询数据库是否初始化
        if (one === null) {
            // 初始化 
            //后台管理系统默认登陆: 
            const roles = ['news', 'comment', 'order', 'user', 'admin']
            const newMange = {
                rolename: 'news',
                password: 'news',
                role: 'news'
            }
            for (let i = 0; i < roles.length; i++) {
                RoleManagerModel.create({
                    rolename: roles[i],
                    password: roles[i],
                    role: roles[i]
                })
            }
            console.log('数据库初始化成功', error);
        }
    } catch (error) {
        console.log('数据库初始化失败', error);
    }
});

 
// module.exports = 