const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const config = require('../../config');
const isInvalid = (...args) => {
    let result = false;
    args.forEach(item => {
        if (item === undefined || item === '') {
            result = true;
        }
    });
    return result;
};

/*** 用户端 controller */

const register = async (ctx, next) => {
    const { phone, password } = ctx.request.body;
    console.log(ctx.request.body)
    if (isInvalid(phone, password)) {
        ctx.body = {
            code: 1,
            msg: '缺少参数'
        };
        return;
    }
    const findUser = await UserModel.findOne({phone});
    if (findUser !== null) {
        ctx.body = {
            code: 1,
            msg: '该用户名已经被注册'
        };
        return;
    }

    const user = await UserModel.create(ctx.request.body);
    

    if (user !== null) {
        const userInfo=await UserModel.findOne({phone})
        const payload = { phone, time: new Date().getTime(), timeout: 1000 * 60 * 60 * 2};
        //返回前端token，放在request请求头，每次发送的时候带上给服务器判断是否过期
        const token = jwt.sign(payload, config.secret);
        ctx.body = {
            code: 0,
            data:{
                token,
                userInfo
            }
        };
    } else {
        ctx.body = {
            code: 1,
            msg: '注册失败，请联系管理员'
        };
    }
    return
     
};

const login = async (ctx, next) => {
    const { phone, password} = ctx.request.body;
    if (isInvalid(phone, password)) {
        ctx.body = {
            code: 1,
            msg: '缺少参数'
        };
        return;
    }
    
    console.log(await UserModel.find({}).sort({
        "entryTime": -1
      }))
    const findUser = await UserModel.findOne({phone});
    console.log(findUser)
    if (findUser !== null && password==findUser.password) {
        const payload = { phone, time: new Date().getTime(), timeout: 1000 * 60 * 60 * 2};
        const token = jwt.sign(payload, config.secret);
        ctx.body = {
            code: 0,
            data: {
                token,
                userInfo:findUser
            }
        };
    } else {
        ctx.body = {
            code: 1,
            msg: '用户名或密码错误'
        };
    }
};
const change= async (ctx, next) => {
    console.log(ctx.request.body)
    const {_id}=ctx.request.body
   let result= await UserModel.updateOne({ _id }, ctx.request.body);
   let userInfo=await UserModel.findOne({_id})
    // console.log(result)
    ctx.body={
        code: 0,
        msg:"修改成功",
        data:userInfo
    }
    return
}

/*** 管理端 controller */
const user_list = async (ctx, next) => {
    console.log(ctx.request.body)
   let result= await UserModel.find({}).sort({
        "entryTime": -1
      })
    // console.log(result)
    ctx.body={
        code: 0,
        data:result
    }
    return
}
//changeinfo
const change_user = async (ctx, next) => {
    console.log(ctx.request.body)
    const {_id,phone,password}=ctx.request.body
   let result= await UserModel.updateOne({ _id }, {phone,password });

    // console.log(result)
    ctx.body={
        code: 0,
        msg:"修改成功",
        data:result
    }
    return
}
const del_user=async (ctx, next) => {
    console.log('deluser')
    console.log(ctx.request.body) 
    const {_id}=ctx.request.body
    
    await UserModel.deleteOne({_id})
    ctx.body={
        code: 0,
        msg:"删除成功"
        // data:result
    }
    return
}

 

module.exports = {
    register,
    login,
    change,
    user_list,
    change_user,
    del_user
};