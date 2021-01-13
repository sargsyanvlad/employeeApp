const Router = require('koa-router');

const CompanyRoutes = require('./companyRouter');

const router = new Router({
  prefix: '/company',
});

router.use(CompanyRoutes.routes());

module.exports = router;

