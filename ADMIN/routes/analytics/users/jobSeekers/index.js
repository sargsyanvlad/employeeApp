const Router = require('koa-router');

const JobSeekersRoutes = require('./JobSeekersRouter');

const router = new Router({
  prefix: '/jobSeekers',
});

router.use(JobSeekersRoutes.routes());

module.exports = router;

