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

  // walk() {
  //   if (this.isMove) {
  //     return;
  //   }
  //   this.isMove = true;
  //   //防止，按一次人物不动
  //   // this.forward();w
  //   this.timer = setInterval(() => {
  //     this.forward();
  //   }, 150);
  // }
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
      this.moveX,
      this.top,
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
    this.moveX += 5;
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
  // forward() {
  //   this.actionIndex = (this.actionIndex + 1) % 4;
  //   this.moveX += 5;
  //   console.log(this.top)
  //   this.ctx.clearRect(0, this.top, 800, this.height * 1.5);//800是整张图的大小，这里清除画板宽度决定效果
  //   console.log(this.height)

  //   this.ctx.drawImage(
  //   this.image,
  //   this.actionIndex * this.width,//图片的x
  //   this.height * 2,
  //   this.width,
  //   this.height,
  //   this.moveX,
  //   this.top,
  //   this.width * 1.5,
  //   this.height * 1.5);

  //   this.listener && this.listener(this.top);
  // }

  stop() {
    this.isMove = false;
    clearInterval(this.timer);
  }
}


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bgCanvas = document.getElementById("background");
const foreCanvas = document.getElementById("foreground");
const audio = document.getElementById("audio");
const width = canvas.clientWidth;
const height = canvas.clientHeight;
let isGaming = false;
let gameCount = 0;
let isCat = false;
var temp_timer=null

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
  drawWin() {
    this.ctx.font = '32px "微软雅黑"';
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText("Win", width / 2, 150);
    this.drawButton("再来一次");
  },
  drawLose() {
    this.ctx.font = '32px "微软雅黑"';
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText("Lose", width / 2, 150);
    this.drawButton("重新开始");
  },
  clear() {
    this.ctx.clearRect(0, 0, width, height);
  }
};



bgPaint.drawBg();
forePaint.drawStart();

foreCanvas.addEventListener("click", e => {
  const isClickBtn = forePaint.ctx.isPointInPath(e.offsetX, e.offsetY);
  if (!isClickBtn || isGaming) {
    return;
  }

  isGaming = true;
  forePaint.clear();
  gameCount++;
  isCat = gameCount > 5;
  initGame();
});

//画裁判
const judge = {
  image: new Image(),
  init() {
    this.image.onload = () => {
      this.draw();
    };
    this.image.src = "https://s3.bmp.ovh/imgs/2021/10/727fc27ee8b9a6e7.png";
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

//障碍
block_show = () => {

  // (80,650)
  _x_base = 48
  _x = []
  for (let i = 0; i < 6; i++) {
    temp_x = _x_base + 5 * (parseInt(Math.random() * 100, 10) + 1);
    _x.push(temp_x)
  }
  _y = [0, 72, 144, 216, 288, 360]

  for (let i = 0; i < 6; i++) {
    console.log(_x)
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(_x[i], _y[i], 5, 48 * 1.5);
  }
  return {
    'x': _x,
    'y': _y
  }
}

const initGame = () => {
  let isAllowRun = true;
  let timer = null;

  ctx.clearRect(0, 0, width, height);
  judge.init();

  block_xy = block_show()

  // ctx.fillStyle="";
  // ctx.fillRect(0,0,32*1.5,48*1.5);

  const girl = new Character(ctx, {
    src: isCat ?
      "https://s3.bmp.ovh/imgs/2021/10/035e5eb7556f6cf3.png" : "https://s3.bmp.ovh/imgs/2021/10/70b59c5699cfbab5.png",
    width: 32,
    height: isCat ? 32 : 48,
    listener: (x, y, key) => {
      if (key == 'up') {
        y_index = block_xy.y.indexOf(y)
        if (x > block_xy.x[y_index] && Math.abs(x - block_xy.x[y_index]) < 2) {
          girl.stop();
          audio.pause();
          clearInterval(temp_timer)
          // fore_time.clear()
          forePaint.drawLose();
          audio.currentTime = 0;
          isGaming = false;
          isAllowRun = false;
          clearTimeout(timer);
          document.removeEventListener("keypress", handleKeyPress);
          document.removeEventListener("keyup", handleKeyUp);
        }
        console.log(x)
        console.log(block_xy.x[y_index])
        if (x < block_xy.x[y_index] && Math.abs(x - block_xy.x[y_index]) < 48) {
          girl.stop();
          audio.pause();
          clearInterval(temp_timer)
          // fore_time.clear()
          forePaint.drawLose();
          audio.currentTime = 0;
          isGaming = false;
          isAllowRun = false;
          clearTimeout(timer);
          document.removeEventListener("keypress", handleKeyPress);
          document.removeEventListener("keyup", handleKeyUp);
        }

      }
      if (key == 'down') {
        y_index = block_xy.y.indexOf(y)
        if (x > block_xy.x[y_index] && Math.abs(x - block_xy.x[y_index]) < 2) {
          girl.stop();
          audio.pause();
          clearInterval(temp_timer)
          // fore_time.clear()
          forePaint.drawLose();
          audio.currentTime = 0;
          isGaming = false;
          isAllowRun = false;
          clearTimeout(timer);
          document.removeEventListener("keypress", handleKeyPress);
          document.removeEventListener("keyup", handleKeyUp);
        }
        if (x < block_xy.x[y_index] && Math.abs(x - block_xy.x[y_index]) < 48) {
          girl.stop();
          audio.pause();
          clearInterval(temp_timer)
          // fore_time.clear();
          forePaint.drawLose();
          audio.currentTime = 0;
          isGaming = false;
          isAllowRun = false;
          clearTimeout(timer);
          document.removeEventListener("keypress", handleKeyPress);
          document.removeEventListener("keyup", handleKeyUp);
        }
      }
      if (key == 'left') {
        console.log(x)
        y_index = block_xy.y.indexOf(y)
        if (y_index > -1 && x - 2 == block_xy.x[y_index]) {
          girl.stop();
          audio.pause();
          clearInterval(temp_timer)
          // fore_time.clear();
          forePaint.drawLose();
          audio.currentTime = 0;
          isGaming = false;
          isAllowRun = false;
          clearTimeout(timer);
          document.removeEventListener("keypress", handleKeyPress);
          document.removeEventListener("keyup", handleKeyUp);
        }
      }
      if (key == 'right') {
        console.log(x)
        if (x > 650) {
          girl.stop();
          audio.pause();
          clearInterval(temp_timer)
          // fore_time.clear();
          forePaint.drawWin();
          audio.currentTime = 0;
          isGaming = false;
          isAllowRun = false;
          clearTimeout(timer);
          document.removeEventListener("keypress", handleKeyPress);
          document.removeEventListener("keyup", handleKeyUp);
          return
        }
        y_index = block_xy.y.indexOf(y)
        if (y_index > -1 && x + 48 - 5 == block_xy.x[y_index]) {
          girl.stop();
          audio.pause();
          // fore_time.clear();
          clearInterval(temp_timer)
          forePaint.drawLose();
          audio.currentTime = 0;
          isGaming = false;
          isAllowRun = false;
          clearTimeout(timer);
          document.removeEventListener("keypress", handleKeyPress);
          document.removeEventListener("keyup", handleKeyUp);
        }
      }
    }
  });

  // console.log(girl.isMove)
  // let isRobotEnd = false;
  // const robot = new Character(ctx, {
  //   src: "https://s3.bmp.ovh/imgs/2021/10/56c68440f5c1a836.png",
  //   top: 48*1.5*4,
  //   listener: x => {
  //     if (x > 650) {
  //       isRobotEnd = true;
  //       robot.stop();
  //     }
  //   } });
  // robot.walk();

  const handleKeyUp = () => {
    girl.stop();
  };

  const handleKeyPress = e => {
    e.preventDefault();
    if (!isGaming) {
      return;
    }
    if (!isAllowRun && isGaming && !isCat) {
      //游戏失败
      // girl.walk();
      girl.stop();
      audio.pause();
      // fore_time.clear();
      forePaint.drawLose();
      audio.currentTime = 0;
      isGaming = false;
      isAllowRun = false;
      clearTimeout(timer);
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("keyup", handleKeyUp);
      return;
    }
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
  timer_show = () => {
    var n = 0
    txt = ['1', '2', '3', '4', '5', '6', '7', '木头人!']
    temp_timer = setInterval(() => {
      fore_time.drawStart(txt[n])
      n++
      if (n == 8) {
        clearInterval(temp_timer)
      }
    }, 480);
  }
  timer_show()
  audio.play();
  const singAndLook = () => {
    console.log(isAllowRun)
    isAllowRun = !isAllowRun;
    judge.turn(!isAllowRun);
    if (isAllowRun) {
      audio.play(); //
      timer_show()
      // fore_time.drawStart()
      // !isRobotEnd && robot.walk();
    } else {
      audio.pause();
      // fore_time.clear();
      clearInterval(temp_timer)
      audio.currentTime = 0;

      // robot.stop();
    }
    timer = setTimeout(
      () => {
        singAndLook();
      },
      isAllowRun ? 4750 : 3000);
  };

  //裁判回头看
  timer = setTimeout(() => {
    singAndLook();
  }, 4750);
  document.addEventListener("keypress", handleKeyPress);
  document.addEventListener("keyup", handleKeyUp);
};