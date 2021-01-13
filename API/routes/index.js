const Router = require('koa-router');

const router = new Router();

const jobSeekerRoutes = require('./users/jobSeeker');
const usersRouter = require('./users/usersRouter');
const companyRoutes = require('./users/company');
const interestRoutes = require('./interest');
const industryRoutes = require('./industry');
const occupations = require('./occupations');
const packagesRouter = require('./packages');
const benefitRoutes = require('./benefit');
const commonRoutes = require('./common');
const jobsRoutes = require('./jobs');
const chatRouter = require('./chat');
const skills = require('./skills');


router.use(jobSeekerRoutes.routes());
router.use(interestRoutes.routes());
router.use(industryRoutes.routes());
router.use(packagesRouter.routes());
router.use(benefitRoutes.routes());
router.use(companyRoutes.routes());
router.use(commonRoutes.routes());
router.use(usersRouter.routes());
router.use(occupations.routes());
router.use(jobsRoutes.routes());
router.use(chatRouter.routes());
router.use(skills.routes());

module.exports = (app) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
};
