var express = require('express');
var app = express();
var https = require('https');
var http = require('http').Server(app);
const fs = require('fs')
// 思考：socket.io作为一个函数，当前http作为参数传入生成一个io对象？
// io-server
var io = require("socket.io")(http);

var users = []; // 储存登录用户
var usersInfo = []; // 存储用户姓名和头像

// 路由为/默认www静态文件夹
app.use('/', express.static(__dirname + '/www'));





// 每个连接的用户都有专有的socket
/* 
   io.emit(foo); //会触发所有用户的foo事件
   socket.emit(foo); //只触发当前用户的foo事件
   socket.broadcast.emit(foo); //触发除了当前用户的其他用户的foo事件
*/
io.on('connection', (socket) => {
    // 渲染在线人员
    io.emit('disUser', usersInfo);

    // 登录，检测用户名
    socket.on('login', (user) => {
        console.log("+++++++++")
        if (users.indexOf(user.name) > -1) {
            socket.emit('loginError');
        } else {
            users.push(user.name);
            usersInfo.push(user);

            socket.emit('loginSuc');
            socket.nickname = user.name;
            io.emit('system', {
                name: user.name,
                status: '进入'
            });
            io.emit('disUser', usersInfo);
            console.log(users.length + ' user connect.');
        }
    });

    // 发送窗口抖动
    socket.on('shake', () => {
        socket.emit('shake', {
            name: '您'
        });
        socket.broadcast.emit('shake', {
            name: socket.nickname
        });
    });

    // 发送消息事件
    socket.on('sendMsg', (data) => {
        var img = '';
        for (var i = 0; i < usersInfo.length; i++) {
            if (usersInfo[i].name == socket.nickname) {
                img = usersInfo[i].img;
            }
        }
        socket.broadcast.emit('receiveMsg', {
            name: socket.nickname,
            img: img,
            msg: data.msg,
            color: data.color,
            type: data.type,
            side: 'left'
        });
        socket.emit('receiveMsg', {
            name: socket.nickname,
            img: img,
            msg: data.msg,
            color: data.color,
            type: data.type,
            side: 'right'
        });
    });

    // 断开连接时
    socket.on('disconnect', () => {
        var index = users.indexOf(socket.nickname);
        if (index > -1) { // 避免是undefined
            users.splice(index, 1); // 删除用户信息
            usersInfo.splice(index, 1); // 删除用户信息

            io.emit('system', { // 系统通知
                name: socket.nickname,
                status: '离开'
            });

            io.emit('disUser', usersInfo); // 重新渲染
            console.log('a user left.');
        }
    });



    //画画链接
    socket.on("send", function (data) {
        // console.log(data)
        io.emit("msg", data)
    })
    socket.on("send1", function (data) {
        io.emit("msg1", data)
    })
    socket.on("send2", function (data) {
        io.emit("msg2", data)
    })
    socket.on("send3", function (data) {
        io.emit("msg3", data)
    })
    socket.on('reply', function () {})
});



http.listen(3000, function () {
    console.log('listen 3000 port.');
});


// api
var qs = require('querystring');
const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': '01sd7fPlENT6Auuif5s7ZGRK',
    'client_secret': 'syMHtWaLEntgUMeCI3hFZQdzE5wjYbgr'
});
const m = fs.readFileSync('./baidu-token.json', 'utf8')
if (m) {
    console.log(JSON.parse(m)['access_token'])
} else {
    https.get({
            hostname: 'aip.baidubce.com',
            path: '/oauth/2.0/token?' + param,
            agent: false
        },
        function (res) {
            res.pipe(fs.createWriteStream('./baidu-token.json'));

            //POST  https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general
            //Content-Type: application/x-www-form-urlencoded    
            //body:( image )  url=https://baidu-ai.bj.bcebos.com/image-classify/animal.jpeg  &  baike_num=5//返回百科信息的结果数，默认不返回

            //POST https://aip.baidubce.com/api/v1/solution/direct/imagerecognition/combination?access_token=
            //Content-Type: application/json;charset=utf-8
            // body{
            // {"imgUrl":"https://baidu-ai.bj.bcebos.com/image-classify/animal.jpeg",
            //   "scenes":["advanced_general","object_detect","multi_object_detect","currency","animal","plant","logo_search","ingredient","dish_search","dishs","red_wine","landmark"]}
            // }
            //{"result": {"plant": {"result": [{"score": 0.4765125,"name": "非植物"}],"log_id": 1510970639325284718},"animal": {"result": [{"score": "0.208929","name": "美国短毛猫"},{"score": "0.139112","name": "家猫"},{"score": "0.0580069","name": "布偶猫"},{"score": "0.0542856","name": "波米拉猫"},{"score": "0.0482468","name": "英国短毛猫"},{"score": "0.0471158","name": "欧洲短毛猫"}],"log_id": 1510970637924536637},"currency": {"result": {"currencyName": "","hasdetail": 0},"log_id": 1510970638231888106}},"log_id": 16490784469614425}
        }
    );
}