const Router = require('koa-router');

const UsersRoutes = require('../users/users');
const CompanyRoutes = require('../users/companies');
const JobSeekersRoutes = require('../users/jobSeekers');

const router = new Router({
  prefix: '/users',
});

router.use(UsersRoutes.routes());
router.use(CompanyRoutes.routes());
router.use(JobSeekersRoutes.routes());

module.exports = router;

