const Router = require('koa-router');
const userController = require('../../controllers/users/user/UserController');
const { globalAuth } = require('../../middlewares/globalAuth');
const validator = require('../../../modules/validator/index');

const router = new Router({});

router.get('/checkEmail', async (ctx) => {
  const { email } = ctx.request.query;
  validator.customValidation(ctx.request.query, { email: { type: 'email', optional: false, empty: false }, });
  const result = await userController.checkEmail(email);
  return ctx.ok(result);
});

router.put('/resend-confirmation-email', globalAuth.asNotConfirmedUser, async (ctx) => {
  validator.customValidation(ctx.request.body, { email: { type: 'email', empty: false, optional: false } });
  const { email } = ctx.request.body;
  const result = await userController.resendConfirmationEmail(email, ctx.state.user);
  return ctx.ok(result);
});

module.exports = router;

