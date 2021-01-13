const Router = require('koa-router');

const MatchesRoutes = require('./matches');
const JobsRoutes = require('./jobs');

const router = new Router({
  prefix: '/jobs',
});

router.use(JobsRoutes.routes());
router.use(MatchesRoutes.routes());

module.exports = router;

