const Router = require('koa-router');
const JobsRoutes = require('./jobsRouter');

const router = new Router({
  prefix: '/job',
});

router.use(JobsRoutes.routes());

module.exports = router;

