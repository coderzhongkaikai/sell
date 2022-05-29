const mongoose = require('mongoose');
// const { statusDic } = require('./dictionary');
const { Schema } = mongoose;

const userSchema = new Schema({ // 用户
    username: { // 手机 登陆名
        type: String,
    },
    avatar:{
        type: String,
    },
    phone: { // 手机 登陆名
        type: String,
    },
    password: { // 密码
        type: String,
    },
    role: { //身份权限
        type: String,
        default:'nomal'
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


userSchema.virtual('statusName').get(function () {
    return statusDic[this.status];
});

userSchema.virtual('permissions').get(function () {
    const rolePermissions = this.roleIds.map(role => role.permissions);
    const flatPermissions = rolePermissions[0];
    this.addPermissions.forEach(item => {
        flatPermissions.push(item);
    });
    return flatPermissions.filter(item => !this.noPermissions.includes(item));
});

const UserModel=mongoose.model('user', userSchema);
module.exports = UserModel
