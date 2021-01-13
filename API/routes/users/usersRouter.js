const UserController = require('../../controllers/users/user/UserController');
const validator = require('../../../modules/validator');
const { idSchema } = require('../../../modules/validator/validationSchemas');
const { globalAuth } = require('../../middlewares/globalAuth');

const Router = require('koa-router');


const router = new Router({
  prefix: '/users',
});

router.post('/login', async (ctx) => {
  const result = await UserController.login(ctx.request.body);
  return ctx.ok({ success: true, result });
});

router.post('/forgotPassword', async (ctx) => {
  validator.customValidation(ctx.request.body, { email: { type: 'email', optional: false, empty: false } });
  const result = await UserController.forgotPassword(ctx);
  return ctx.ok(result);
});

router.post('/active', globalAuth.asUser, async (ctx) => {
  const result = await UserController.setActiveStatus(ctx);
  return ctx.ok(result);
});

router.post('/report', globalAuth.asUser, async (ctx) => {
  const schema = {
    reason: {
      type: 'string',
      optional: false,
      empty: false,
    },
    reportingId: {
      type: 'number',
      optional: false,
      empty: false,
    },
  };
  validator.customValidation(ctx.request.body, schema);
  const result = await UserController.reportUser(ctx);
  return ctx.created(result);
});

router.post('/block/:id', globalAuth.asUser, async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const result = await UserController.blockUser(ctx);
  return ctx.ok(result);
});

router.delete('/block/:id', globalAuth.asUser, async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const result = await UserController.unBlockUser(ctx.state.user, ctx.params.id);
  return ctx.ok(result);
});

router.get('/block', globalAuth.asUser, async (ctx) => {
  const result = await UserController.getBlockedUsers(ctx.state.user.id);
  return ctx.ok(result);
});

router.post('/deleteProfile', globalAuth.asUser, async (ctx) => {
  const schema = {
    reason: {
      type: 'string',
      optional: false,
      empty: false,
    },
  };
  validator.customValidation(ctx.request.body, schema);
  const result = await UserController.deleteProfile(ctx.state.user, ctx.request.body);
  return ctx.ok(result);
});

router.post('/setCloudToken', globalAuth.asUser, async (ctx) => {
  const schema = {
    deviceId: {
      type: 'number',
      optional: true,
      empty: false,
      convert: true,
    },
    cloudToken: {
      type: 'string',
      optional: false,
      empty: false,
    },
  };
  validator.customValidation(ctx.request.body, schema);
  const result = await UserController.setCloudToken(ctx);
  return ctx.created(result);
});

router.post('/changePassword', globalAuth.asUser, async (ctx) => {
  const schema = {
    password: {
      type: 'string',
      optional: false,
      empty: false,
    },
    oldPassword: {
      type: 'string',
      optional: false,
      empty: false,
    },
  };
  validator.customValidation(ctx.request.body, schema);
  const result = await UserController.changePassword(ctx);
  return ctx.ok(result);
});

router.post('/resetPassword', globalAuth.asResetToken, async (ctx) => {
  validator.customValidation(ctx.request.body, { password: { type: 'string', optional: false, empty: false } });
  const result = await UserController.resetPassword(ctx);
  return ctx.ok({ result });
});

router.post('/confirmAccount', globalAuth.asConfirmCode, async (ctx) => {
  const result = await UserController.confirmAccount(ctx);
  return ctx.created(result);
});

module.exports = router;
