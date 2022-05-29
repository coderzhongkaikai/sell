const Router = require('koa-router');
const router = new Router();
const {register,login,change} = require('../app/controllers/user');
// const {create,del,like,up,getlist,comment_public,comment_list} = require('../app/controllers/chat');

 

router.post('/register', register);
router.post('/login', login);
router.post('/change', change);





 

module.exports = router.routes();