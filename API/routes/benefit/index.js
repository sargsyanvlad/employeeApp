const Router = require('koa-router');
const BenefitRoutes = require('./Benefit');

const router = new Router({
  prefix: '/benefit',
});

router.use(BenefitRoutes.routes());

module.exports = router;

