const Router = require('koa-router');
const AdminRoutes = require('./AdminRouter');

const router = new Router({
  prefix: '/admin'
});

router.use(AdminRoutes.routes());

module.exports = router;
