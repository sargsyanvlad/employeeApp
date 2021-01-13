const Router = require('koa-router');

const CompanyRoutes = require('./CompaniesRouter');

const router = new Router({
  prefix: '/companies',
});

router.use(CompanyRoutes.routes());

module.exports = router;

