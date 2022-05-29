const mongoose = require('mongoose');
// const { statusDic } = require('./dictionary');
const { Schema } = mongoose;

const RoleManagerSchema = new Schema({ // 用户
    rolename: { // 手机 登陆名
        type: String,
    },
    password: { // 密码
        type: String,
    },
    role: { //身份权限
        type:String,
    },
    entryTime: {
        type: Date,
        default: Date.now
    }, // 注册的时间
    // roleIds: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'role'
    // }], // 所有的角色的id
});
//new,comment,order,user,admin

const RoleManagerModel=mongoose.model('role', RoleManagerSchema);
module.exports = RoleManagerModel
