const jwt = require('jsonwebtoken');
const config = require('../../config');
async function checkToken(ctx, next) {
    // console.log(ctx.session);
    const roleList = ['/user/getcaptcha'];
    //是否在白名单url里
    if (roleList.some(item => ctx.request.url.indexOf(item) > -1)) {
        const token = ctx.request.headers['x-token'];
        let decoded = null;
        try {
            //加工jwt
            decoded = jwt.verify(token, config.secret);
        } catch (e) {
            ctx.body = {
                code: 1,
                msg: e.message
            };
            return;
        }
        console.log(decoded)
        //这里如果有user的id的话每次传参，需要绑定用户id就可以不用每次发送userinfo了。本地也不用localStorage等保存用户信息
        const { time, timeout, username, permissions } = decoded;
        //是否过期
        if (Date.now() - time < timeout) {
            ctx.request.username = username; // 将username解析到request对象中
            // ctx.request.permissions = permissions;
            await next();
        } else {
            ctx.body = {
                code: 50014,
                msg: 'token过期'
            };
        }
    } else {
    //url访问需要验证对应登陆状态
    // console.log("ctx--------------------------------------")
    // console.log(ctx)
    // console.log("request--------------------------------------")
    // console.log(ctx.request)

    await next();
 
    }
}

module.exports = checkToken;