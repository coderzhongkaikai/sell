const Router = require('koa-router');
const router = new Router();
const {order_list,order_create,order_back,order_del}= require('../app/controllers/order.js');


router.post('/getlist', order_list);
router.post('/create', order_create);

module.exports = router.routes();