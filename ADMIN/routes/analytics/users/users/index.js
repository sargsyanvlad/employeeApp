const Router = require('koa-router');

const UsersRoutes = require('./UsersRouter');

const router = new Router();

router.use(UsersRoutes.routes());

module.exports = router;

