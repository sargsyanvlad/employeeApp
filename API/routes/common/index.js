const Router = require('koa-router');
const s3Routes = require('./s3');
const others = require('./othersRouter.js');

const router = new Router({
  prefix: '/common',
});

router.use(s3Routes.routes());
router.use(others.routes());

module.exports = router;
