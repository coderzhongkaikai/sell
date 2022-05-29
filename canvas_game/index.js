const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bgCanvas = document.getElementById("background");
const foreCanvas = document.getElementById("foreground");
const width = canvas.clientWidth;
const height = canvas.clientHeight;
let isGaming = false;
var game_state = true

//背景画板
const bgPaint = {
    ctx: bgCanvas.getContext("2d"),
    drawBg() {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, width, height);
        this.ctx.fillStyle = "#ce574f";
        this.ctx.fill();
        const perHeight = height / 4;
        const end = 650;
        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "#e6b322";
        this.ctx.moveTo(end, 0);
        this.ctx.lineTo(end, height);
        this.ctx.closePath();
        this.ctx.stroke();
    }
};
//底部画板
const _bottom = {
    ctx: document.getElementById("bottom").getContext("2d"),
    draw(text) {
        this.ctx.beginPath();
        this.ctx.rect(0, 432, 800, 80);
        this.ctx.fillStyle = "#ce574f";
        this.ctx.fill();
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "#e6b322";
        this.ctx.moveTo(0, 432);
        this.ctx.lineTo(800, 80);
        this.ctx.closePath();
        this.ctx.stroke();
    },
    showBefor() {
        this.clear()
        this.draw()
        this.ctx.font = '20px "微软雅黑"';
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#ffff";
        this.ctx.fillText('开始游戏后，按住d前进,a后退,w向上,s向下,尽可能的远离黑色的障碍物。', 400, 470);

    },
    showText(a_Game) {
        const {
            lv = 0, score = 0, use_time = 0
        } = a_Game
        this.clear()
        this.draw()
        this.ctx.font = '20px "微软雅黑"';
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#ffff";
        this.ctx.fillText('第' + lv + '关', 70, 470);
        this.ctx.fillText('总分:' + score, 300, 470);
        this.ctx.fillText('用时:' + use_time + 's', 580, 470);
    },
    clear() {
        this.ctx.clearRect(0, 432, 800, 80);
    },
};
//交互画板
const forePaint = {
    ctx: foreCanvas.getContext("2d"),
    drawButton(text) {
        const btnW = 120;
        const btnH = 48;
        this.ctx.beginPath();
        this.ctx.rect((width - btnW) / 2, 250, btnW, btnH);
        this.ctx.strokeStyle = "#ccc";
        this.ctx.stroke();
        this.ctx.font = '20px "微软雅黑"';
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText(text, width / 2, 250 + btnH / 2);
    },
    drawStart() {
        this.drawButton("开始");
    },
    drawWin(a_Game) {
        const {
            lv = 0, score = 0
        } = a_Game
        this.ctx.font = '32px "微软雅黑"';
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#fff";

        if (lv < 4) {
            this.ctx.fillText("得分: " + score, width / 2, 150);
            this.drawButton("下一关");
        }
        if (lv == 4) {
            this.ctx.fillText("通关总分: " + score, width / 2, 150);
            this.drawButton("重新开始");
        }
    },
    drawLose(a_Game) {
        game_state = false
        const {
            lv = 0, score = 0
        } = a_Game
        this.ctx.font = '32px "微软雅黑"';
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText("总分: " + score, width / 2, 150);
        this.drawButton("重新开始");
    },
    drawInfo() {

    },
    clear() {
        this.ctx.clearRect(0, 0, width, height);
    }
};
//倒计时画板
const fore_time = {
    ctx: foreCanvas.getContext("2d"),
    drawButton(text) {
        const btnW = 120;
        const btnH = 48;
        this.ctx.beginPath();
        this.ctx.rect(670, 290, btnW, btnH);
        this.ctx.strokeStyle = "#dfb446";
        this.ctx.stroke();
        this.ctx.font = '20px "微软雅黑"';
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#dfb446";
        this.ctx.fillText(text, 730, 314);
    },
    drawStart(text) {
        this.clear()
        this.drawButton(text);
    },
    clear() {
        this.ctx.clearRect(0, 0, width, height);
    },
};
//裁判
const judge = {
    image: new Image(),
    init() {
        this.image.onload = () => {
            this.draw();
        };
        this.image.src = "727fc27ee8b9a6e7.png";
    },
    turn(isLeft) {
        ctx.clearRect(700, (height - 96) / 2, 64, 96);
        this.draw(isLeft);
    },
    draw(isLeft) {
        ctx.drawImage(
            this.image,
            64,
            isLeft ? 48 : 96,
            32,
            48,
            700,
            (height - 96) / 2,
            64,
            96);

    }
};

class Block {
    constructor(ctx, options = {}) {
        const {
            width = 5,
                block_index = 0,
                height = 48 * 1.5,
                x = 0,
                y = 0,
                speed = 1,
                // moveY = 0,
                character = null,
                game = null,
                moveTimer = null,
                canMove = false
        } = options;
        this.ctx = ctx;
        this.width = width;
        this.speed = speed
        this.height = height;
        this.game = game;
        this.x = x;
        this.y = y;
        this.character = character;
        // this.moveY = moveY;
        this.moveTimer = moveTimer;
        this.canMove = canMove;
        this.init();
    }
    init() {
        let {
            ctx,
            x,
            y,
            width,
            height,
            canMove,
        } = this
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(x, y, width, height);
        if (canMove) {
            this.moveTimer = setInterval(() => {
                this.move()
            }, 800)
        }
    }
    move() {
        let {
            ctx,
            x,
            y,
            width,
            height,
            speed
        } = this
        ctx.fillStyle = "#ce574f"; //还原背景颜色
        ctx.fillRect(x, y, width, height);
        let new_Y = y >= 360 ? 0 : y + speed * height
        this.y = new_Y
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(x, new_Y, width, height);
        this._judge()
    }
    _judge() {
        let {
            x,
            y,
        } = this
        if (this.game.lv == 4) {
            //无敌
            return
        }
        if (y == this.character.top) {
            if (this.character.moveX > x && Math.abs(x - this.character.moveX) < 2) {
                this.game.gameFail()
                console.log("xxxxxxx")
            }
            if (this.character.moveX < x && Math.abs(x - this.character.moveX) < 48) {
                this.game.gameFail()
                console.log("mmmmmmmm")
            }
        }
        // if(y==this.character.top&& Math.abs(x-this.character.moveX)<40){
        // //    console.log(x,this.character.moveX,x-this.character.moveX)
        //     this.game.gameFail()
        // }

    }
}
class Character {
    constructor(context, options = {}) {
        const {
            src,
            width = 32,
            height = 48,
            top = 48 * 1.5,
            listener
        } = options;
        this.ctx = context;
        this.src = src;
        this.width = width;
        this.height = height;
        this.top = top;
        this.actionIndex = 0;
        this.moveX = 0;
        this.timer = null;
        this.isMove = false;
        this.listener = listener;
        this.init();
    }
    init() {
        this.image = new Image();
        this.image.onload = () => {
            this.ctx.drawImage(
                this.image,
                this.actionIndex * this.width,
                this.height * 2,
                this.width,
                this.height,
                0, //x
                this.top, //y
                this.width * 1.5,
                this.height * 1.5);

        };
        this.image.src = this.src;
    }
    walk_up() {
        this.actionIndex = (this.actionIndex + 1) % 4;
        this.ctx.clearRect(this.moveX, this.top, this.width * 1.5, this.height * 1.5); //800是整张图的大小，这里清除画板宽度决定效果
        this.top = this.top > 0 ? this.top - 48 * 1.5 : 0
        this.ctx.drawImage(
            this.image,
            this.actionIndex * this.width, //图片的x
            this.height * 2,
            this.width,
            this.height,
            this.moveX, //x
            this.top, //y
            this.width * 1.5,
            this.height * 1.5);
        this.listener && this.listener(this.moveX, this.top, 'up');
    }
    walk_down() {
        this.actionIndex = (this.actionIndex + 1) % 4;
        this.ctx.clearRect(this.moveX, this.top, this.width * 1.5, this.height * 1.5); //800是整张图的大小，这里清除画板宽度决定效果
        this.top = this.top >= 360 ? 360 : this.top + 48 * 1.5
        this.ctx.drawImage(
            this.image,
            this.actionIndex * this.width, //图片的x
            this.height * 2,
            this.width,
            this.height,
            this.moveX,
            this.top,
            this.width * 1.5,
            this.height * 1.5);
        this.listener && this.listener(this.moveX, this.top, 'down');
    }
    walk_left() {
        this.actionIndex = (this.actionIndex + 1) % 4;
        this.ctx.clearRect(this.moveX, this.top, this.width * 1.5, this.height * 1.5); //800是整张图的大小，这里清除画板宽度决定效果
        this.moveX = this.moveX < 0 ? 0 : this.moveX - 5;

        this.ctx.drawImage(
            this.image,
            this.actionIndex * this.width, //图片的x
            this.height * 2,
            this.width,
            this.height,
            this.moveX,
            this.top,
            this.width * 1.5,
            this.height * 1.5);
        this.listener && this.listener(this.moveX, this.top, 'left');
    }
    walk_right() {
        this.actionIndex = (this.actionIndex + 1) % 4;
        this.ctx.clearRect(this.moveX, this.top, this.width * 1.5, this.height * 1.5); //800是整张图的大小，这里清除画板宽度决定效果
        this.moveX = this.moveX + 5;
        this.ctx.drawImage(
            this.image,
            this.actionIndex * this.width, //图片的x
            this.height * 2,
            this.width,
            this.height,
            this.moveX,
            this.top,
            this.width * 1.5,
            this.height * 1.5);
        this.listener && this.listener(this.moveX, this.top, 'right');
    }
    stop() {
        this.isMove = false;
        // clearInterval(this.timer);
    }
}
class Audio {
    constructor(options = {}) {
        const {
            audio_src = '',
                text = '',
                playbackRate = 1,
                duration = 0
        } = options;
        const myAudio_source = document.getElementById("myAudio_source");
        const myAudio = document.getElementById("myAudio");
        const base_src = 'http://tts.youdao.com/fanyivoice?le=zh&keyfrom=speaker-target&word=';
        this.myAudio = myAudio;
        this.myAudio_source = myAudio_source
        this.audio_src = base_src + audio_src;
        this.playbackRate = playbackRate;
        this.duration = duration;
        this.text = text,
            this.text_timer = null;
        this.init();
    }
    init() {

    }
    create() {
        console.log(this.audio_src)
        this.myAudio.currentTime = 0
        this.myAudio_source.src = this.audio_src
        this.myAudio.load();
        // console.log(duration)
        // var that=this
        // this.myAudio.oncanplay = function () {
        //     console.log(myAudio.duration);
        //     that.duration=myAudio.duration
        // }
        // console.log("++++++++")
        this.myAudio.playbackRate = this.playbackRate
        this.start()
    }
    start() {
        clearInterval(this.text_timer)
        this.myAudio.play()
        this.showText()
        // this.myAudio.oncanplay = ()=>{
        //     console.log("++++++++")
        //     clearInterval(this.text_timer)
        //     this.showText()
        // }

    }
    showText() {
        let n = 0
        this.text_timer = setInterval(() => {
            fore_time.drawStart(this.text[n])
            n++
            if (n == this.text.length) {
                clearInterval(this.text_timer)
            }
        }, this.duration / this.text.length);
    }
    reset() {
        this.myAudio.pause()
        this.myAudio.currentTime = 0
        clearInterval(this.text_timer)
    }
}
class Game {
    constructor(options = {}) {
        const {
            lv = 1,
                score = 0,
                use_time = 0,
                character = null,
                block_xy = null,
                isAllowRun = true,
                isGaming = false,
        } = options;
        this.lv = lv,
            this.isGaming = isGaming,
            this.isAllowRun = isAllowRun,
            this.timer = null, //裁判timer
            this.time_timer = null, //时间timer
            this.block_xy = block_xy,
            this.character = character,
            this.use_time = use_time,
            this.score = score,
            this.init();
    }
    init() {
        console.log(this.lv)
    }
    gameStart() {
        this.showInfo()
        ctx.clearRect(0, 0, width, height);
        // bgPaint.clearBg()
        bgPaint.drawBg();
        this.isAllowRun = true;
        this.isGaming = true;
        this.audio_init() //声音
        judge.init();
        this.character_init() //初始化人物
        this.block_xy_init() //初始化障碍
        this.gameProess() //
        this.timeCount()
    }
    character_init() {
        let this_game = this
        const girl = new Character(ctx, {
            src: this_game.lv == 4 ?
                "035e5eb7556f6cf3.png":"70b59c5699cfbab5.png",
            width: 32,
            height: this_game.lv == 4 ? 32 : 48,
            listener: (x, y, key) => {
                let block_xy = this_game.block_xy

                let y_index = block_xy.y.indexOf(y)
                // console.log(block_xy.blocks[y_index])

                // console.log(y)
                if (this_game.lv == 4) {
                    if (x > 650) {
                        this.gameWin()
                        // document.removeEventListener("keypress", this_game.handleKeyPress.bind(this_game));
                        // document.removeEventListener("keyup", this_game.handleKeyUp.bind(this_game));
                    }
                    //无敌
                    return
                }
                // if (block_xy.blocks[y_index].canMove&&y == block_xy.blocks[y_index].y) {
                //     //对于x移动的把子对比y
                //     if (x > block_xy.blocks[y_index].x && Math.abs(x - block_xy.blocks[y_index].x) < 2) {
                //         // react_fail_judge()
                //         console.log("*************")
                //         this_game.gameFail()
                //         return
                //     }
                //     if (x < block_xy.blocks[y_index].x && Math.abs(x - block_xy.blocks[y_index].x) < 48) {
                //         // react_fail_judge()
                //         console.log("*************")
                //         this_game.gameFail()
                //         return

                //     }
                // }

                if (key == 'up') {
                    if (x > block_xy.blocks[y_index].x && Math.abs(x - block_xy.blocks[y_index].x) < 2&&y==block_xy.blocks[y_index].y) {
                        // react_fail_judge()
                        this_game.gameFail()
                        // this_game.gameOver()
                    }
                    if (x < block_xy.blocks[y_index].x && Math.abs(x - block_xy.blocks[y_index].x) < 48&&y==block_xy.blocks[y_index].y) {
                        // react_fail_judge()
                        this_game.gameFail()
                    }
                }
                if (key == 'down') {
                    if (x > block_xy.blocks[y_index].x && Math.abs(x - block_xy.blocks[y_index].x) < 2&&y==block_xy.blocks[y_index].y) {
                        // react_fail_judge()
                        this_game.gameFail()
                    }
                    if (x < block_xy.blocks[y_index].x && Math.abs(x - block_xy.blocks[y_index].x) < 48&&y==block_xy.blocks[y_index].y) {
                        // react_fail_judge()
                        this_game.gameFail()
                    }
                }
                if (key == 'left') {
                    if (y_index > -1 && x - 2 == block_xy.blocks[y_index].x&&y==block_xy.blocks[y_index].y) {
                        // react_fail_judge()
                        this_game.gameFail()
                    }
                }
                if (key == 'right') {
                    if (x > 650) {
                        // audio.pause();
                        // fore_time.clear();
                        this.gameWin()
                        // audio.currentTime = 0;
                        // clearTimeout(timer);
                        // document.removeEventListener("keypress", this_game.handleKeyPress.bind(this_game));
                        // document.removeEventListener("keyup", this_game.handleKeyUp.bind(this_game));
                        return
                    }
                    console.log()
                    if (y_index > -1 && x + 48 - 5 == block_xy.blocks[y_index].x&&y==block_xy.blocks[y_index].y) {
                        // react_fail_judge()
                        // console.log("-------------------")
                        // if(){
                            this_game.gameFail()
                        // }
                    }
                }
            }

        });
        this.character = girl
    }
    block_xy_init() {
        let ctx = bgCanvas.getContext("2d");
        let lv = this.lv
        let character = this.character
        let _x_base = 48
        let blocks = []
        let _x = []
        for (let i = 0; i < 6; i++) {
            let temp_x = _x_base + 5 * (parseInt(Math.random() * 100, 10) + 1);
            _x.push(temp_x)
        }
        let _y = [0, 72, 144, 216, 288, 360]
        switch (lv) {
            case 1:
                for (let i = 0; i < 6; i++) {
                    let temp = new Block(ctx, {
                        x: _x[i],
                        y: _y[i],
                    })
                    blocks.push(temp)
                }
                break
            case 2:
                for (let i = 0; i < 6; i++) {
                    let temp
                    if (i == 5) {
                        temp = new Block(ctx, {
                            x: _x[i],
                            y: _y[i],
                            canMove: true,
                            character: character,
                            game: this,
                            speed: 1
                        })
                    } else {
                        temp = new Block(ctx, {
                            x: _x[i],
                            y: _y[i],
                        })
                    }
                    blocks.push(temp)
                }
                break
            case 3:
                for (let i = 0; i < 6; i++) {
                    let temp
                    if (i == 5) {
                        temp = new Block(ctx, {
                            x: _x[i],
                            y: _y[i],
                            canMove: true,
                            character: character,
                            game: this,
                            speed: 2
                        })
                    } else {
                        temp = new Block(ctx, {
                            x: _x[i],
                            y: _y[i],
                        })
                    }
                    blocks.push(temp)
                }
                break
            case 4:
                for (let i = 0; i < 6; i++) {
                    let temp
                    if (i == 5) {
                        temp = new Block(ctx, {
                            x: _x[i],
                            y: _y[i],
                            canMove: true,
                            character: character,
                            game: this,
                            speed: 1
                        })
                    } else {
                        temp = new Block(ctx, {
                            x: _x[i],
                            y: _y[i],
                        })
                    }
                    blocks.push(temp)
                }
                break

        }
        this.block_xy = {
            'x': _x,
            'y': _y,
            'blocks': blocks
        }
    }
    audio_init() {
        let {
            lv
        } = this
        let audio_src
        let playbackRate
        let duration
        let text
        switch (lv) {
            case 1:
                audio_src = '1,2,3,4,5,6,7,木头人',
                    text = ['1', '2', '3', '4', '5', '6', '7', '木头人!']
                playbackRate = 1.2
                duration = 4800 / 1.2
                break
            case 2:
                audio_src = '1,2,3,4,5,木头人',
                    text = ['1', '2', '3', '4', '5', '木头人!']
                playbackRate = 1.5
                duration = 4680 / 1.5

                break
            case 3:
                audio_src = '1,2,3,4,木头人',
                    text = ['1', '2', '3', '4', '木头人!']
                playbackRate = 1.5
                duration = 4580 / 1.5
                break
            case 4:
                audio_src = '1,2,3,木头人'
                text = ['1', '2', '3', '木头人!']
                playbackRate = 1
                duration = 2472
                break

        }

        this.audio = new Audio({
            audio_src: audio_src,
            text: text,
            playbackRate: playbackRate,
            duration: duration
        })
        this.audio.create()
    }
    gameProess() {
        document.addEventListener("keypress", this.handleKeyPress.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
        //语音和裁判
        let that = this
        let duration = this.audio.duration

        const singAndLook = () => {
            // 裁判
            that.isAllowRun = !that.isAllowRun;
            judge.turn(!that.isAllowRun);
            // console.log(that.isGaming)
            if (that.isAllowRun) {
                this.audio.start()
                // this.audio.showText() 
                // timer_show()
            } else {
                this.audio.reset()
                if (that.isGaming) {
                    clearInterval(that.timer)
                    that.timer = setTimeout(
                        () => {
                            singAndLook();
                        }, 3000);
                }

                // clearInterval(this.timer)
                // this.gameFail()
                // audio.currentTime = 0;
            }

            // that.timer = setTimeout(
            //     () => {
            //         singAndLook();
            //     },
            //     that.isAllowRun ? duration : 3000);
        };
        //裁判回头看
        // this.audio.myAudio.oncanplay = ()=>{
        //     console.log(new Date())
        // }


        //多个game对象监听同一个dom造成函数多次执行，表现为，singAndLook多次执行
        that.audio.myAudio.addEventListener("playing", function () { //播放状态Doing
            clearInterval(that.timer)
            //判断当前game对象是否执行，执行则执行。或者销毁game之前的实列
            if (that.isGaming) {
                that.timer = setTimeout(() => {
                    singAndLook();
                    that.audio.reset()
                }, duration);
            }

        });

    }
    handleKeyUp(e) {
        // console.log(this)
        // console.log(this.character)
        // console.log(this)
        this.character.stop();
    }
    handleKeyPress(e) {
        e.preventDefault();
        let {
            isAllowRun,
            isGaming,
            isCat,
            lv
        } = this
        let girl = this.character
        if (!isGaming) {
            return;
        }
        if (!isAllowRun && isGaming) {
            //游戏失败
            // 无敌状态
            if (lv == 4) {

            } else {
                this.gameFail()
                return;
            }
        }
        console.log(e.keyCode)
        switch (e.keyCode) {
            case 119: //w上
                girl.walk_up()
                break;
            case 100: //d右
                girl.walk_right()
                break;
            case 115: //s下
                girl.walk_down()
                break;
            case 97: //a左
                girl.walk_left()
                break;
        }
    }
    timeCount() {
        // let use_time=0;
        this.time_timer = setInterval(() => {
            // m++
            this.use_time = this.use_time + 1
            this.showInfo()
        }, 1000)
    }
    gameGood() {
        clearInterval(this.timer)
        clearInterval(this.time_timer)
    }

    gameWin() {
        clearInterval(this.timer)
        clearInterval(this.time_timer)

        this.audio.reset()
        this.character.stop();

        this.isGaming = false;
        this.isAllowRun = false;
        for (let i = 0; i < 6; i++) {
            clearInterval(this.block_xy.blocks[i].moveTimer)
        }
        this.score = this.score + Math.round((1 / this.use_time) * this.lv * 100)

        if (this.lv == 4) {
            forePaint.drawWin({
                lv: this.lv,
                score: this.score
            });
        } else {
            // this.score =Math.round((this.lv /this.use_time)* 100)
            forePaint.drawWin({
                lv: this.lv,
                score: Math.round((1 / this.use_time) * this.lv * 100)
            });
        }
        document.removeEventListener("keypress", this.handleKeyPress.bind(this));
        document.removeEventListener("keyup", this.handleKeyUp.bind(this));
    }
    gameFail() {
        this.character.stop();
        // audio.pause();
        clearInterval(this.timer)
        clearInterval(this.time_timer)
        for (let i = 0; i < 6; i++) {
            clearInterval(this.block_xy.blocks[i].moveTimer)
        }
        forePaint.drawLose({
            lv: this.lv,
            score: this.score
        });
        this.audio.reset()
        // audio.currentTime = 0;
        this.isGaming = false;
        this.isAllowRun = false;
        // clearTimeout(this.timer);
        document.removeEventListener("keypress", this.handleKeyPress.bind(this));
        document.removeEventListener("keyup", this.handleKeyUp.bind(this));
    }
    showInfo() {
        // console.log("+++++++++++")
        _bottom.showText({
            lv: this.lv,
            score: this.score,
            use_time: this.use_time
        })
    }

}

//初始化0，游戏未开始
var a_Game = new Game({
    lv: 0,
    score: 0
})
_bottom.showBefor()
bgPaint.drawBg();
forePaint.drawStart();
foreCanvas.addEventListener("click", e => {
    const isClickBtn = forePaint.ctx.isPointInPath(e.offsetX, e.offsetY);
    if (!isClickBtn || a_Game.isGaming) {
        return;
    }
    //创建新的0，1，2，3，4 注意创建的Game实例lv的大小
    console.log(a_Game.lv)
    if (a_Game.lv < 4 && game_state) {
        let lv = a_Game.lv + 1
        let score = a_Game.score
        a_Game = new Game({
            lv: lv,
            score: score
        }) //点击开始后其实lv是1
        forePaint.clear();
        a_Game.gameStart();
    }
    else if (a_Game.lv >= 4 || !game_state) { //重新开始
        game_state = true
        let lv = 1
        let score = 0
        a_Game = new Game({
            lv: lv,
            score: score
        })
        forePaint.clear();
        a_Game.gameStart();
    }

});