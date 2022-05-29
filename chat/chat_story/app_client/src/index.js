import './index.css'

$(function () {

    const axios = require('axios')
    const io = require('socket.io-client')
    //因为所以逻辑都在一个页面，这里先隐藏不需要的
    $(".card_list").hide();
    $(".create_form").hide();
    $(".main").hide();
    // 点击输入昵称，回车，点击登录
    $('#name').keyup((ev) => {
        if (ev.which == 13) {
            inputName();
        }
    });
    $('#nameBtn').click(inputName);



    function inputName() {
        var _name = $('#name').val()
        if (_name.trim() !== '') {
            window.userName = _name
            //登陆成功后，显示列表
            $('.login_card').hide();
            $('.card_list').show();
            $(".user_name").append(_name)
            getList()//获取列表
            getToken()//获取token
        } else {
            alert('请输入登录名！');
            return false;
        }
    }
    //百度百科token
    function getToken() {
        if (localStorage.getItem("token")) {
            
        } else {
            axios({
                method: 'get',
                url: 'token'
            }).then(response=>{
                console.log(response)
                localStorage.setItem("token", response.data.access_token)
            })
        }
    }
    //indexDB
    var request = window.indexedDB.open('room', 2);
    var db;
    request.onerror = function (event) {
        console.log('数据库打开报错');
    };
    request.onsuccess = function (event) {
        db = request.result;
        console.log('数据库打开成功');
        // var objectStore = db.createObjectStore('romm', {
        //     keyPath: '_id'
        // });
        // update();
        // add();
        // read();
    };
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        var objectStore;
        if (!db.objectStoreNames.contains('room')) {
            objectStore = db.createObjectStore('room', {
                keyPath: '_id'
            });
        }
    }

    function getList() {
        axios({
            method: 'get',
            url: 'getList',
        }).then(response=>{
            console.log(response)
            if(response.data.code==0){
                $('.box').empty();//清空html的内容重新渲染
                const docs = response.data.docs
                window.roomList = docs
                var append_html = ''
                for (let i = 0; i < docs.length; i++) {
                    append_html += `
                    <div class="story_info" onclick="switchDiv(${i})">
                    <div class="top_nav">${docs[i].title+'_'+docs[i].creator+'_'+docs[i].createTime}</div>
                    <div class="img">
                    <img style="width: 100%;height: 100%;" src="${docs[i].img}" alt="">
                    </div>
                    <div class="foot">${docs[i].content}</div>
                    </div>      
                `
                }
                if (!append_html) {
                    return
                } else {
                    $('.box').append(append_html)
                }
            }
        })
    }
    //上面的js动态添加html的回调函数，对应这里的全局方法
    window.switchDiv = function (i) {
        console.log(i)
        window.roomClick = window.roomList[i]
        $(".card_list").hide();
        $(".create_form").hide();
        $(".main").show();
        goRoom()
    }

    function goRoom() {
        const {
            _id,
            img
        } = window.roomClick
        //进入房间
        axios({
                method: 'post',
                url: '/goRoom',
                data: {
                    img: img,
                    _id: _id,
                    name: window.userName
                }
            })
            .then(function (response) {
                const left = []
                const right = []
                console.log(response)
                if (response.data.code == 0) {
                    response.data.docs.forEach(element => {
                        console.log(element)
                        if (element.creator == window.userName) {
                            right.push(element)
                        } else {
                            left.push(element)
                        }
                    });

                    msg_init(left, right)
                }

                init_chat()
            }).catch(() => {
                //离线状态
                indexDB_get(_id)
                init_room_top()
            });

    }
    //历史消息的呈现
    function msg_init(left, right) {
        left.forEach(item => {
            $('#messages').append(`
            <li class='left'>
                <div>
                <span>${item.creator}</span>
                <p >${item.msg}</p>
                </div>
            </li>`);
        })
        right.forEach(item => {
            $('#messages').append(`
            <li class='right'>
                <div>
                <span>${item.creator}</span>
                <p >${item.msg}</p>
                </div>
            </li>`);
        })
        // 滚动条总是在最底部
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    }

    function init_chat() {
        // socket = io('ws://localhost:3030/'+window.roomClick._id);
        var socket = io.connect('ws://localhost:8888/' + window.roomClick._id);
        init_room_top(socket)
        // 登录成功 
        socket.on('loginSuc', () => {
            console.log("登录成功")
        })
        // 登录失败
        socket.on('loginError', () => {
            alert('登录失败');
        });
        // 系统提示消息
        socket.on('system', (user) => {
            var data = new Date().toTimeString().substr(0, 8);
            $('#messages').append(`<p class='system'><span>${data}</span><br /><span>${user.name}了聊天室<span></p>`);
            // 滚动条总是在最底部
            $('#messages').scrollTop($('#messages')[0].scrollHeight);

        });
        // 显示在线人员
        socket.on('disUser', (usersInfo) => {
            displayUser(usersInfo, socket);
        });
        // 发送消息
        $('#sub').unbind('click').click(() => {
            sendMsg(socket)
        });
        $('#m').unbind('keyup').keyup((ev) => {
            if (ev.which == 13) {
                sendMsg(socket);
            }
        });

        // 接收消息
        socket.on('receiveMsg', (obj) => {
            console.log(obj)
            // 提取文字中的表情加以渲染
            var msg = obj.msg;
            $('#messages').append(`
                <li class='${obj.side}'>
                    <div>
                    <span>${obj.name}</span>
                    <p >${msg}</p>
                    </div>
                </li>`);
            // 滚动条总是在最底部
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        });
        // 退出
        $('#close_chat').unbind('click').click(() => {
            socket.emit('leave');
            socket.disconnect()
        
            outRoom(window.roomClick._id)
        });
        socket.on('disconnect',function(){
            console.log('断开连接')
        })
 
    }

    function init_room_top(socket) {
        const {
            title,
            creator,
            createTime,
            content,
            img
        } = window.roomClick
        //图片初始化
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        const newImg = new Image()
        newImg.src = img

        newImg.onload = function () {
            $("#canvas").attr({
                'width': newImg.width,
                'height': newImg.height
            });
            context.drawImage(newImg, 0, 0, newImg.width, newImg.height);

            paint(context, socket)
            paint_on(context,socket) //接收

            //创建者可画，参与者接收
            // if (window.userName == window.roomClick.creator) {
            //     paint(context, socket)
            // } else {
            //     paint_on(context, socket)
            // }

            // paint(context);
            $(".chat_info .top_nav").empty();
            $(".chat_info .top_nav").append(title + '_' + creator + '_' + createTime)
            // $(".chat_img").attr("src",img)
            
            $(".chat_info .foot").empty();
            $(".chat_info .foot").append(content)

            socket.emit('login', {
                name: window.userName,
                roomId: window.roomClick._id
                // img: 'image/user' + imgN + '.jpg'
            }); // 触发登录事件

            get_img_info(img)

        }

    }
    //百度百科
    function get_img_info(img) {
        const token = localStorage.getItem('token')
        const _data = 'image=' + encodeURIComponent(img.split(',')[1]) + '&baike_num=5' //固定接口写法
        axios({
            method: 'post',
            url: 'get_img_info',
            data: {
                _data: _data,
                token:token
            }
        }).then(response=>{
            console.log(response)
            if(response.data.code==201){//token过期后的重新存储
                localStorage.setItem('token',response.data.access_token)
            }
            if(window.roomClick){
                init_img_info(response.data.data)
            }
        })

    }
    //百科介绍列表
    function init_img_info(data) {
        console.log(data)
        $('.info_side').empty();
        $('.info_side').show();
        var append_html = ''
        for (let i = 0; i < data.length; i++) {
            if(data[i].baike_info.image_url){//过滤没有图片的
                append_html += `
                <div class="info_item">
                <div class="keyword"><a href="${data[i].baike_info.baike_url}">${data[i].keyword}</a></div>
                <div class="img">
                    <img style="width: 100%;height: 100%;" src="${data[i].baike_info.image_url}" alt="">
                </div>
                <div class="description">
                ${data[i].baike_info.description}
                </div>
                </div>
        `
            }
       
        }
        if (!append_html) {
            return
        } else {
            $('.info_side').append(append_html)
        }



    }
    //离开房间，indexDB的存储，img修改后的保存
    function outRoom(room) {
        //canvas转img
        var mycanvas = document.getElementById("canvas");
        var image = mycanvas.toDataURL("image/png");
        console.log(image)
        axios({
                method: 'post',
                url: '/outRoom',
                data: {
                    img: image,
                    room: room
                }
            })
            .then(function (response) {
                console.log(response)
                if (response.data.code == 0) {
                    $(".main").hide();
                    $(".create_form").hide();
                    $('.info_side').hide();
                    $(".card_list").show();
                    $('#messages').text('');
                    $('.info_side').empty();
                    $('#users').text('')
                    getList()
                    indexDB_save(response.data)
                    window.roomClick=null
                } else {
                    alert("失败")
                }
            }).catch(()=>{
                //离线退出
                $(".main").hide();
                $(".create_form").hide();
                $('.info_side').hide();
                $(".card_list").show();
                $('#messages').text('');
                $('.info_side').empty();
                $('#users').text('')
                $('._span').empty()
                window.roomClick=null
            });

    }

    function indexDB_get(_id) {
        var transaction = db.transaction(['room']);
        var objectStore = transaction.objectStore('room');
        var request = objectStore.get(_id);
        request.onerror = function (event) {
            console.log('事务失败');
        };
        request.onsuccess = function (event) {
            if (request.result) {
                console.log('Name: ' + request.result.chat);
                const left = []
                const right = []
                request.result.chat.forEach(element => {
                    console.log(element)
                    if (element.creator == window.userName) {
                        right.push(element)
                    } else {
                        left.push(element)
                    }
                });
                msg_init(left, right)

            } else {
                console.log('未获得数据记录');
            }
            // init_room_top(request.result.img)
        };
    }

    function indexDB_save(data) {
        const room = {}
        room._id = data._id
        room.chat = data.docs
        room.img = data.img
        console.log(room)
        var request = db.transaction(['room'], 'readwrite')
            .objectStore('room')
            .put(room);

        request.onsuccess = function (event) {
            console.log('数据更新成功');
        };

        request.onerror = function (event) {
            console.log('数据更新失败');
        }
    }


    // 发送消息
    var color = '#000000';
    function sendMsg(socket) {
        if ($('#m').val() == '') {
            alert('请输入内容！');
            return false;
        }
        color = $('#color').val();
        socket.emit('sendMsg', {
            msg: $('#m').val(),
            room: window.roomClick._id,
            creator: window.userName
            // color: color,
            // type: 'text'
        });
        $('#m').val('');
        return false;
    }
    // 显示在线人员
    function displayUser(users, socket) {
        $('#users').text(''); // 每次都要重新渲染
        $('._span').empty()
        if (!users.length) {
            $('.contacts p').show();
        } else {
            $('.contacts p').hide();
        }
        $('#num').text(users.length);
        for (var i = 0; i < users.length; i++) {
            // var $html = `<li>
            //   <img src="${users[i].img}">
            //   <span>${users[i].name}</span>
            // </li>`;
            var $html = `
            <li>
            <span class="_span">${users[i]}</span>
            </li>
            `
            $('#users').append($html);
        }
    }
    //涂鸦
    function paint(context, socket) {
        var temp = false;
        $("canvas").unbind('mousedown').mousedown(function (e) {
            console.log(e.offsetX)
            console.log(e.offsetY)

            temp = true;
            var x = e.offsetX - 8;
            var y = e.offsetY - 8;
            context.moveTo(x, y);
            socket.emit("send1", [x, y])
        })
        $("canvas").unbind('mousemove').mousemove(function (e) {
            var x = e.offsetX - 8;
            var y = e.offsetY - 8;
            socket.emit("send2", [x, y])
            if (temp) {
                context.lineTo(x, y);
                context.stroke();
            }
        })
        $("canvas").unbind('mouseup').mouseup(function (e) {
            temp = false;
            socket.emit("send3", 1)
        })
    }
    //接收涂鸦
    function paint_on(context, socket) {
        var temp = false; //开关
        socket.on('msg1', function (data) {
            temp = true;
            var x = data[0];
            var y = data[1];
            context.moveTo(x, y);
        })
        socket.on('msg2', function (data) {
            var x = data[0];
            var y = data[1];
            if (temp) {
                context.lineTo(x, y);
                context.stroke();
            }
        })
        socket.on("msg3", function (data) {
            if (data == 1) {
                temp = false;
            }
        })
    }





    //创建故事的相关业务逻辑
    $('#createBtn').click(function () {
        $(".create_form").show();
    });

    $('.pop').click(function (event) {
        $('#uploadImg').val('');
        $('#contentInput').val('');
        $('.titleInput').val('');
        $(".create_form").hide();
    });

    $('#btnForm').click(commit);

    function commit() {

        var files = $('#uploadImg').prop('files')
        var content = $('#contentInput').val()
        var title = $('.titleInput').val()
        console.log(content, title)
        if (content == '' || title == '') {
            alert('请输入内容！');
            return false;
        }

        if (files.length == 0) {
            alert('请选择文件');
            return;
        }
        
        var reader = new FileReader(); //新建一个FileReader
        console.log(files[0])
        reader.readAsDataURL(files[0]); //读取文件 
        //文件读取出错的时候触发
        reader.onerror = function () {
            alert('读取文件失败， 请重试！');
        };
        // 读取成功后,
        reader.onload = function () {
            console.log(files)
            var src = reader.result; // 读取结果
            // console.log(src)
            console.log(reader.result)
            axios({
                    method: 'post',
                    url: '/create',
                    data: {
                        content: content,
                        title: title,
                        creator: window.userName,
                        img: src,
                        createTime: new Date().toLocaleString()
                    }
                })
                .then(function (response) {
                    console.log(response)

                    $('#uploadImg').val('');
                    $('#contentInput').val('');
                    $('.titleInput').val('');

                    $(".create_form").hide();
                    getList()  //重新获取列表，更新列表，
                });
        };
    }
});