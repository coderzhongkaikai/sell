var express = require('express');
var router = express.Router();
const qs = require('querystring');
const axios = require('axios');

const {
  StoryModel,
  ChatModel
} = require('../db.js');
const {
  response
} = require('../app.js');



var io = require("socket.io")('8888', {
  cors: true
});

router.get('/test', async function (req, res, next) {
  await ChatModel.find({}).exec(function (err, docs) {
    // res.render('index', {code: 0, docs});
    res.send({
      code: 0,
      docs
    });
  })
});

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

/* GET home page. */
router.post('/goRoom', async function (req, res, next) {

  // console.log(req.body)
  // chat(req.body._id)
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
    // console.log("99999")
  } else {

    io[_id] = [name]
    // console.log(name)
    // console.log("mmmm")
    // console.log(io[_id].indexOf(name))
    // console.log("mmmm")

    const room = io.of('/' + _id)
    room.on('connection', (socket) => {
      // console.log("****")
      // 渲染在线人员
      room.emit('disUser', io[_id]);

      // 登录，检测用户名
      socket.on('login', (data) => {
        // roomId = data.roomId
        socket.emit('loginSuc');
        socket.nickname = data.name;

        room.emit('system', {
          name: data.name,
          status: '进入'
        });

        room.emit('disUser', io[_id]);
      });
      // 发送消息事件
      socket.on('sendMsg', (data) => {
        try {
          ChatModel.create(data)

        } catch (error) {
          console.log(error)
        }
        socket.broadcast.emit('receiveMsg', {
          name: socket.nickname,
          //   img: img,
          msg: data.msg,
          // color: data.color,
          //   type: data.type,
          side: 'left'
        });

        socket.emit('receiveMsg', {
          name: socket.nickname,
          //   img: img,
          msg: data.msg,
          color: data.color,
          //   type: data.type,
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

        // socket.leave(roomId);

        // roomId = ''
      });

      // //画画链接
      // socket.on("send", function (data) {
      //     // console.log(data)
      //     io.emit("msg", data)
      // })
      socket.on("send1", function (data) {
        room.emit("msg1", data)
      })
      socket.on("send2", function (data) {
        room.emit("msg2", data)
      })
      socket.on("send3", function (data) {
        room.emit("msg3", data)
      })
      // socket.on('reply', function () {})
    });
  }
});

/* GET home page. */
router.post('/outRoom', async function (req, res, next) {
  let {
    img,
    room
  } = req.body


  await StoryModel.findByIdAndUpdate(room, {
    img: img
  })
  // await StoryModel.findByIdAndUpdate(room,{img:img}).exec(function (err, docs) {
  //   if (!err) {
  //     res.send({
  //       code: 0,
  //       docs
  //     });
  //   }
  // })

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

    if (response.data.error_code == 110) {
            const param = qs.stringify({
              'grant_type': 'client_credentials',
              'client_id': '01sd7fPlENT6Auuif5s7ZGRK',
              'client_secret': 'syMHtWaLEntgUMeCI3hFZQdzE5wjYbgr'
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

router.get('/info')

module.exports = router;


// function img_info(imgUrl) {
//   // api
//   const fs = require('fs')
//   const https = require('https');
//   const qs = require('querystring');
//   const {
//     resolve
//   } = require('path');
//   const param = qs.stringify({
//     'grant_type': 'client_credentials',
//     'client_id': '01sd7fPlENT6Auuif5s7ZGRK',
//     'client_secret': 'syMHtWaLEntgUMeCI3hFZQdzE5wjYbgr'
//   });
//   fs.access('./baidu-token.json', (err) => { //null 代表存在，err对象代表不存在
//     if (err) {
//       // console.log(err)
//       https.get({
//           hostname: 'aip.baidubce.com',
//           path: '/oauth/2.0/token?' + param,
//           agent: false
//         },
//         function (res) {
//           res.pipe(fs.createWriteStream('./baidu-token.json'));
//         })
//     } else {
//       const m = fs.readFileSync('./baidu-token.json', 'utf8')
//       const access_token = JSON.parse(m)['access_token']
//       console.log(access_token)
//       const https = require('https');
//       var options = {
//         hostname: 'aip.baidubce.com',
//         path: '/rest/2.0/image-classify/v2/advanced_general?' + 'access_token=24.e02f0c7f57c43e4a5aa13cb771e0b912.2592000.1651920662.282335-25905027',
//         method: 'POST',
//         body: {
//           'url': 'https://baidu-ai.bj.bcebos.com/image-classify/animal.jpeg'
//         },
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded;'
//         },
//         json: true,
//       };
//       const req = https.request(options, function (res) {
//         console.log(res)
//         // res.pipe(fs.createWriteStream('./dsfasdf.txt'));

//       });
//       req.on("error", function (e) {
//         // console.error("==================" + e);
//       });
//       req.end();


//     };
//   })

// }


//    文件和目录不存在的情况下；
// if (!stat.isDirectory()) {
//       console.log("文件和目录不存在")

// } else {
// const m = fs.readFileSync('./baidu-token.json', 'utf8')
// console.log(JSON.parse(m)['access_token'])
// https.post({
//     hostname: 'aip.baidubce.com',
//     path: '/oauth/2.0/token?' + param,
//     agent: false
//   },
//   function (res) {
//     res.pipe(fs.createWriteStream('./baidu-token.json'));
//   })

// }

// if (m) {} else {


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
// }