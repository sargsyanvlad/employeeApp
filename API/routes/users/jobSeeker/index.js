const Router = require('koa-router');
const JobSeekerRoutes = require('./jobSeekerRouter');

const router = new Router({
  prefix: '/jobSeeker',
});

router.use(JobSeekerRoutes.routes());

module.exports = router;

