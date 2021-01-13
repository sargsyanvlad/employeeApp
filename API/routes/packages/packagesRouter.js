const Router = require('koa-router');
const PackagesController = require('../../controllers/packages/PackagesController');
const { globalAuth } = require('../../middlewares/globalAuth');


const router = new Router();

router.get('/', globalAuth.asUser, async (ctx) => {
  const { state: { user } } = ctx;
  const result = await PackagesController.getSuggestedPackages(user);
  return ctx.ok(result);
});

router.post('/buy/:id', globalAuth.asUser, async (ctx) => {
  const { state: { user }, request: { body } } = ctx;
  const result = await PackagesController.buyPackage(user, ctx.params.id, body);
  return ctx.ok(result);
});

router.post('/validate-receipt', globalAuth.asUser, async (ctx) => {
  const { state: { user }, request: { body } } = ctx;
  const result = await PackagesController.validateReceipt(user, body);
  return ctx.ok(result);
});

module.exports = router;
