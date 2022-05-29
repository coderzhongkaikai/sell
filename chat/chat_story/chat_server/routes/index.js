var express = require('express');
var router = express.Router();
const qs = require('querystring');
const axios = require('axios');

const {
  StoryModel,
  ChatModel
} = require('../db.js');
//以8888端口作为全局io，允许跨域
var io = require("socket.io")('8888', {
  cors: true
});

//获取故事列表
router.get('/getList', async function (req, res, next) {
  await StoryModel.find({}).sort({
    "createdAt": -1
  }).exec(function (err, docs) {

    res.send({
      code: 0,
      docs
    });
  })
});
//创建故事
router.post('/create', function (req, res, next) {
  console.log(req.body)
  try {
    StoryModel.create(req.body, (err, doc) => {
      if (!err) {
        console.log(doc)
        console.log('成功');
        res.send({
          code: 0
        });
      } else {
        console.log(err)
      }
    });
  } catch (error) {
    console.log(error)
  }


  // storyModel.find({},function(err,docs){
  //   console.log(docs)
  //   // res.render('index', {code: 0, docs});
  //   res.send({code: 0, docs});
  //   // res.render({code: 0, docs});
  // })

  // res.render('index', { title: 'Express' });
});

/*  通过id来进入房间 */
router.post('/goRoom', async function (req, res, next) {
  let {
    name,
    _id
  } = req.body
  await ChatModel.find({
    'room': _id
  }).exec(function (err, docs) {
    if (!err) {
      res.send({
        code: 0,
        docs
      });
    }
  })
  // console.log(io[_id])
  if (Array.isArray(io[_id]) && io[_id].indexOf(name) == -1) {
    io[_id].push(name)
  } else {
    io[_id] = [name]
    const room = io.of('/' + _id)
    room.on('connection', (socket) => {
      // 渲染在线人员
      room.emit('disUser', io[_id]);
      // 登录 
      socket.on('login', (data) => {
        // roomId = data.roomId
        socket.emit('loginSuc');
        socket.nickname = data.name;
        room.emit('system', {
          name: data.name,
          status: '进入'
        });
        //更新房间人数
        room.emit('disUser', io[_id]);
      });
      // 发送消息事件
      socket.on('sendMsg', (data) => {
        try {
          //聊天记录，存储数据库
          ChatModel.create(data)
        } catch (error) {
          console.log(error)
        }
        //广播消息
        socket.broadcast.emit('receiveMsg', {
          name: socket.nickname,
          msg: data.msg,
          side: 'left'
        });
        //自己接受的消息
        socket.emit('receiveMsg', {
          name: socket.nickname,
          msg: data.msg,
          color: data.color,
          side: 'right'
        });

      });

      // 断开连接时
      socket.on('leave', (data) => {
        console.log("+++++++++++")
        var index = io[_id].indexOf(socket.nickname);
        if (index > -1) { // 避免是undefined
          io[_id].splice(index, 1); // 删除用户信息
          room.emit('system', { // 系统通知
            name: socket.nickname,
            status: '离开'
          });
          room.emit('disUser', io[_id]); // 重新渲染
          console.log('a user left.');
        }
      });

      //画画涂鸦链接
      socket.on("send1", function (data) {
        socket.broadcast.emit("msg1", data)
      })
      socket.on("send2", function (data) {
        socket.broadcast.emit("msg2", data)
      })
      socket.on("send3", function (data) {
        socket.broadcast.emit("msg3", data)
      })



    });

   
  }
});

/* 离开房间，存储房间的图片和消息，返回历史消息给前端indexDB缓存 */
router.post('/outRoom', async function (req, res, next) {
  let {
    img,
    room
  } = req.body


  await StoryModel.findByIdAndUpdate(room, {
    img: img
  })
  await ChatModel.find({
    'room': room
  }).exec(function (err, docs) {
    if (!err) {
      res.send({
        code: 0,
        docs,
        _id: room,
        img
      });
    }
  })

});
//获取token
router.get('/token', async function (req, res, next) {
  const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': '01sd7fPlENT6Auuif5s7ZGRK',
    'client_secret': 'syMHtWaLEntgUMeCI3hFZQdzE5wjYbgr'
  });
  axios.get('https://aip.baidubce.com/oauth/2.0/token?' + param).then(response => {
      console.log(response.data);
      res.send({
        access_token: response.data.access_token
      })
    })
    .catch(error => {
      console.log(error);
    });
});
//获取图片的百科
router.post('/get_img_info', async function (req, res, next) {

  const axios = require('axios');
  let {
    token,
    _data
  } = req.body
  axios({
    method: 'post',
    url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + token,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: _data,
  }).then(function (response) {
    console.log(response)

    if (response.data.error_code == 110) {//token过期,重新获取。
            const param = qs.stringify({
              'grant_type': 'client_credentials',
              'client_id': 'rMiX7TGnV6mUzHMQiWSPheSV',
              'client_secret': '6R6DkrW2tzqaKcttE4LERlMAXClDtWVB'
              // 'client_id': 'mINrXFnxPOH1WCCjfhAHxikG',
              // 'client_secret': 'tvfzXS9hu2LHQQxlz8dr5BOqCu2Hfjlg'
            });
            axios.get('https://aip.baidubce.com/oauth/2.0/token?' + param).then(response => {
                console.log(response.data);
                const newToken=response.data.access_token
                    axios({
                      method: 'post',
                      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' +newToken,
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      data: _data,
                    }).then((response)=>{
                          console.log(response)
                          res.send({
                            access_token:newToken,
                            data: response.data.result,
                            code:201
                          })
      
                    })
              }).catch(error => {
                console.log(error);
              });
    } else {
      res.send({
        code: 0,
        data: response.data.result
      })
    }

    //  data: {      
    //   error_code: 110,//110token过期
    //   error_msg: 'Access token invalid or no longer valid'
    // }
  }).catch(err => {
    console.log(err)
  })


  // axios.get('https://aip.baidubce.com/oauth/2.0/token?'+param).then(response => {
  //   console.log(response.data);

  // })
  // .catch(error => {
  //   console.log(error);
  // });
});


module.exports = router;

