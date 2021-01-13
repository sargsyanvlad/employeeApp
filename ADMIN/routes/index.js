const AnalyticsRouter = require('./analytics');
const AdminRouter = require('./admin');
const Router = require('koa-router');

const router = new Router({
  prefix: '/v1'
});

router.use(AdminRouter.routes());
router.use(AnalyticsRouter.routes());

module.exports = (app) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
};
