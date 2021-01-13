const Router = require('koa-router');
const PackagesRoutes = require('./packagesRouter');

const router = new Router({
  prefix: '/packages',
});

router.use(PackagesRoutes.routes());

module.exports = router;
