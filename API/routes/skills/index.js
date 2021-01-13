const Router = require('koa-router');
const SkillsRouter = require('./skillsRouter');

const router = new Router({
  prefix: '/skill',
});

router.use(SkillsRouter.routes());

module.exports = router;

