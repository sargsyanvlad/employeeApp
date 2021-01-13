const Router = require('koa-router');

const JobsRouter = require('./JobsRouter');

const router = new Router();

router.use(JobsRouter.routes());

module.exports = router;

