const Router = require('koa-router');
const IndustryRoutes = require('./IndustryRouter');

const router = new Router({
  prefix: '/industry',
});

router.use(IndustryRoutes.routes());

module.exports = router;

