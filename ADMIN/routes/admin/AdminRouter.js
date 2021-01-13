const Router = require('koa-router');

const { AdminController } = require('../../controllers/admin');
const { loginSchema } = require('../../../modules/validator/adminValidationSchemas');

const validator = require('../../../modules/validator');

const router = new Router();

router.post('/login', async (ctx) => {
  validator.customValidation(ctx.request.body, loginSchema);
  const { email, password } = ctx.request.body;
  const result = await AdminController.login(email, password);
  return ctx.ok({ result });
});


module.exports = router;
