const Router = require('koa-router');
const OccupationsRouter = require('./occupationsRouter.js');

const router = new Router({
  prefix: '/occupation',
});

router.use(OccupationsRouter.routes());

module.exports = router;

