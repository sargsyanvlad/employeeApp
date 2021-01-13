const Router = require('koa-router');
const InterestRoutes = require('./interestRouter');

const router = new Router({
  prefix: '/interest',
});

router.use(InterestRoutes.routes());

module.exports = router;

