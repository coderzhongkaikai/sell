const jwt = require('jsonwebtoken');
const RoleManagerModel = require('../models/role');
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





const login = async (ctx, next) => {
    console.log(ctx.request.body)
    const { rolename, password} = ctx.request.body;
    if (isInvalid(rolename, password)) {
        ctx.body = {
            code: 1,
            msg: '缺少参数'
        };
        return;
    }
    const findUser = await RoleManagerModel.findOne({ rolename });
    console.log(findUser)
    if (findUser !== null && password==findUser.password) {
        const payload = { rolename, time: new Date().getTime(), timeout: 1000 * 60 * 60 * 2};
        const token = jwt.sign(payload, config.secret);
        ctx.body = {
            code: 0,
            data: {
                token,
                roleInfo:findUser
            }
        };
    } else {
        ctx.body = {
            code: 1,
            msg: '用户名或密码错误'
        };
    }
};



const role_list=async (ctx, next) => {
    console.log(ctx.request.body)
   let result= await RoleManagerModel.find({}).sort({
        "entryTime": -1
      })
    ctx.body={
        code: 0,
        data:result
    }
    return
};
const role_add = async (ctx, next) => {
    const { rolename } = ctx.request.body;
    console.log(ctx.request.body)
    const findUser = await RoleManagerModel.findOne({rolename});
    if (findUser !== null) {
        ctx.body = {
            code: 1,
            msg: '该用户名账号已经被注册'
        };
        return;
    }

    const user = await RoleManagerModel.create(ctx.request.body);
    ctx.body = {
        code: 0,
        // data: {
        //     token
        // }
    };
    return 
};
const role_change = async (ctx, next) => {
    console.log(ctx.request.body)
    const {_id,rolename,password,role}=ctx.request.body
   let result= await RoleManagerModel.updateOne({ _id }, {rolename,password,role});
    // console.log(result)
    ctx.body={
        code: 0,
        msg:"修改成功",
        data:result
    }
    return
}
const role_del=async (ctx, next) => {
    console.log(ctx.request.body) 
    const {_id}=ctx.request.body
    await RoleManagerModel.deleteOne({_id})
    ctx.body={
        code: 0,
        msg:"删除成功"
        // data:result
    }
    return
}



 

module.exports = {
    login,
    role_list,
    role_add,
    role_change,
    role_del
};