const parseQueryParams = require('../../../../../utils/queryParams');
const Router = require('koa-router');

const { UserController } = require('../../../../controllers/user');
const { getAllUserSchema, getReportedUsersSchema, idSchema } = require('../../../../../modules/validator/adminValidationSchemas');

const exceptions = require('../../../../../modules/exceptions');
const validator = require('../../../../../modules/validator');

const router = new Router();

router.get('/', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  validator.customValidation(filter, getAllUserSchema);

  if (filter.date.from > filter.date.to) throw new exceptions.InvalidUserInput({ message: 'filter.date.from Can\'t Be greater than filter.date.to' });

  const { users, timeSeries } = await UserController.getAllUsers(filter);
  return ctx.ok({ users, timeSeries });
});

router.get('/:id', async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const userId = ctx.params.id;
  const { user } = await UserController.getUserById(userId);
  return ctx.ok({ user });
});

router.delete('/:id', async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const userId = ctx.params.id;
  await UserController.deleteUser(userId);
  return ctx.noContent();
});

router.get('/ban', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  validator.customValidation(filter, getAllUserSchema);
  const result = await UserController.getBannedUsers(filter);
  return ctx.ok({ result });
});

router.put('/ban/:id', async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const userId = ctx.params.id;
  const result = await UserController.banUserById(userId);
  return ctx.ok({ result });
});

router.delete('/ban/:id', async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const userId = ctx.params.id;
  await UserController.unBanUserById(userId);
  return ctx.noContent();
});

router.get('/reported', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  validator.customValidation(filter, getReportedUsersSchema);
  const result = await UserController.getReportedUsers(filter);
  return ctx.ok({ result });
});

router.get('/blocked', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  validator.customValidation(filter, getReportedUsersSchema);
  const result = await UserController.getBlockedUsers(filter);
  return ctx.ok({ result });
});

module.exports = router;
