module.exports = function (io,roomId) {
    var users = []; // 储存登录用户
    var usersInfo = []; // 存储用户姓名和头像
    var roomId 

    // 每个连接的用户都有专有的socket
    /* 
       io.emit(foo); //会触发所有用户的foo事件
       socket.emit(foo); //只触发当前用户的foo事件
       socket.broadcast.emit(foo); //触发除了当前用户的其他用户的foo事件
    */
    // const http= require('http').Server(app);
    console.log("_______")

    console.log(roomId)
    
 
    // io.join()
    const room=io.of('/'+roomId)
    room.on('connection', (socket) => {
        console.log("+++++++++")
        // 渲染在线人员
        room.emit('disUser', usersInfo);

        // 登录，检测用户名
        socket.on('login', (data) => {
            roomId = data.roomId

            // socket.join(roomId);

            if (users.indexOf(data.name) > -1) {
                socket.emit('loginError');
            } else {

                // users.push(data.name);
                // usersInfo.push(data);

                socket.emit('loginSuc');
                socket.nickname = data.name;

                room.emit('system', {
                        name: data.name,
                        status: '进入'
                    });

                room.emit('disUser', io._id);

                // socket.broadcast.to(roomId).emit('system', {
                //     name: data.name,
                //     status: '进入'
                // });
                // socket.emit('system', {
                //     name: data.name,
                //     status: '进入'
                // });
                // socket.broadcast.to(roomId).emit('disUser', usersInfo);
                // socket.emit('disUser', usersInfo);
                //   console.log(users.length + ' user connect.');
            }
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
                //   img: img,
                msg: data.msg,
                color: data.color,
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
            var index = io._id.indexOf(socket.nickname);
            if (index > -1) { // 避免是undefined
                io._id.splice(index, 1); // 删除用户信息

                room.emit('system', { // 系统通知
                    name: socket.nickname,
                    status: '离开'
                });

                room.emit('disUser', io._id); // 重新渲染
                console.log('a user left.');

            }

            // socket.leave(roomId);

            roomId = ''
        });

        // //画画链接
        // socket.on("send", function (data) {
        //     // console.log(data)
        //     io.emit("msg", data)
        // })
        socket.on("send1", function (data) {
            socket.broadcast.to(roomId).emit("msg1", data)
        })
        socket.on("send2", function (data) {
            socket.broadcast.to(roomId).emit("msg2", data)
        })
        socket.on("send3", function (data) {
            socket.broadcast.to(roomId).emit("msg3", data)
        })
        socket.on('reply', function () {})
    });
}


console.log(io[_id])
if(Array.isArray(io[_id])&&io[_id].indexOf(name)==-1){
  io[_id].push(name)
  console.log("99999")
}else{

  io[_id]=[name]
  console.log(name)
  console.log("mmmm")
  console.log(io[_id].indexOf(name))
  console.log("mmmm")

  const room=io.of('/'+_id)
  room.on('connection', (socket) => {
      console.log("****")
      // 渲染在线人员
      room.emit('disUser', io[_id]);

      // 登录，检测用户名
      socket.on('login', (data) => {
          // roomId = data.roomId

          // socket.join(roomId);

       
          // if (io[_id].indexOf(data.name) > -1) {
          //     socket.emit('loginError');
          // } else {

          //     // users.push(data.name);
          //     // usersInfo.push(data);


          //     // socket.broadcast.to(roomId).emit('system', {
          //     //     name: data.name,
          //     //     status: '进入'
          //     // });
          //     // socket.emit('system', {
          //     //     name: data.name,
          //     //     status: '进入'
          //     // });
          //     // socket.broadcast.to(roomId).emit('disUser', usersInfo);
          //     // socket.emit('disUser', usersInfo);
          //     //   console.log(users.length + ' user connect.');
          // }


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
          // var img = '';
          // for (var i = 0; i < usersInfo.length; i++) {
          //     if (usersInfo[i].name == socket.nickname) {
          //         img = usersInfo[i].img;
          //     }
          // }
          socket.broadcast.emit('receiveMsg', {
              name: socket.nickname,
              //   img: img,
              msg: data.msg,
              color: data.color,
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
      socket.on('reply', function () {})
  });
}