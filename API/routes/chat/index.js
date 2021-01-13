const Router = require('koa-router');
const ChatRoutes = require('./ChatRouter');

const router = new Router({
  prefix: '/chat',
});

router.use(ChatRoutes.routes());

module.exports = router;

