const Router = require('koa-router');
const router = new Router();
const {create,chat_del,like,chat_up,getlist,comment_public,comment_list} = require('../app/controllers/chat');


router.get('/getlist', getlist);
router.post('/create',create);

router.post('/like', like);


router.get('/comment_list', comment_list);
router.post('/comment_public', comment_public);

 
// router.post('/del', chat_del);
// router.post('/up', chat_up);



module.exports = router.routes();