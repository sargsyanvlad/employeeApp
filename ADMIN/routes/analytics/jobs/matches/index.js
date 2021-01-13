const Router = require('koa-router');

const MatchesRoutes = require('./MatchesRouter');

const router = new Router({
  prefix: '/matches',
});

router.use(MatchesRoutes.routes());

module.exports = router;

