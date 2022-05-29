const Router = require('koa-router');
const router = new Router();
const {news_list} = require('../app/controllers/news');


router.get('/news_list', news_list);
module.exports = router.routes();