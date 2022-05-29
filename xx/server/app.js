const Koa = require('koa');
const config = require('./config');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const router = new Router();

const session = require('koa-session');
const checkToken = require('./app/middleware/checkToken');
const app = new Koa();
const cilent_app=require('./routes/cilent_app')
const manage=require('./routes/manage')
const chat=require('./routes/chat')
const news=require('./routes/news')
const order=require('./routes/order')

app.use(cors({
    credentials: true
}));

// 连接数据库及初始化数据
require('./initDatabase');
// session key
app.keys = [config.secret];

const CONFIG = {
    key: 'koa:sess',
    maxAge: 1000 * 60,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
};

// 使用中间件
//跨域


app.use(session(CONFIG, app));
// app.use(bodyParser());
app.use(bodyParser({jsonLimit: '50mb',urlencodedLimit:'50mb'}));

// app.use(bodyParser({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(checkToken);

//前端路由
router.use('/user', cilent_app);
router.use('/chat', chat);
router.use('/news', news);
router.use('/order', order);




//管理系统路由
//  manage/user/userlist
router.use('/manage', manage);



// 使用路由
app.use(router.routes()).use(router.allowedMethods());
app.listen(config.port);

