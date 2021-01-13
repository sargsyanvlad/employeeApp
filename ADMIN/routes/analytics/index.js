const Router = require('koa-router');
const { adminAuth } = require('../../middlewares/adminAuth');

const UsersRoutes = require('./users');
const JobsRoutes = require('./jobs');

const router = new Router({
  prefix: '/analytics'
});

router.use(adminAuth.authenticate); // Note Authorization middleWare
router.use(UsersRoutes.routes());
router.use(JobsRoutes.routes());

module.exports = router;

