const Router = require('koa-router');
const router = new Router();
const {user_list,change_user,del_user} = require('../app/controllers/user.js');
const {login,role_list,role_change,role_add,role_del} = require('../app/controllers/manage.js');
const {news_list,change_news,del_news,add_news} = require('../app/controllers/news.js');
const {order_list,order_create,order_manage_list,order_del}= require('../app/controllers/order.js');
const {manage_comment_list,manage_chat_list,chat_up,chat_del,comment_del,comment_lock}= require('../app/controllers/chat.js');
 
 
router.get('/chat/getlist', manage_chat_list);
router.post('/chat/up', chat_up);
router.post('/chat/del', chat_del);
router.get('/chat/comment_list', manage_comment_list);
router.post('/chat/comment_del', comment_del);
router.post('/chat/lock', comment_lock);


//manage/user/getlist
//manage/user/changeinfo
router.get('/user/getlist', user_list);
router.post('/user/change', change_user);
router.post('/user/del', del_user);

router.get('/news/getlist', news_list);
router.post('/news/add', add_news);
router.post('/news/change', change_news);
router.post('/news/del', del_news);

//
router.get('/role/getlist', role_list);
router.post('/role/add', role_add);
router.post('/role/change', role_change);
router.post('/role/del', role_del);

router.get('/order/getlist', order_manage_list);
// router.post('/order/create', order_create);
// router.post('/order/back', order_back);
router.post('/order/del', order_del);


//manage/login 
router.post('/login', login);
// router.post('/addmanage', addmanage);


module.exports = router.routes();