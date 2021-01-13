const Router = require('koa-router');
const parseQueryParams = require('../../../utils/queryParams');

const { companyAuth } = require('../../middlewares/companyAuth');

const BenefitController = require('../../controllers/benefit/BenefitController');
const validator = require('../../../modules/validator/index');

const router = new Router();

router.post('/', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  const result = await BenefitController.list(filter, ctx.request.body);
  return ctx.created(result);
});

router.get('/filter', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  const result = await BenefitController.search(filter);
  return ctx.created(result);
});

router.post('/create', companyAuth.asCompanyUser, async (ctx) => {
  const result = await BenefitController.create(ctx.request.body);
  return ctx.created(result);
});

router.post('/set', companyAuth.asCompanyUser, async (ctx) => {
  validator.asCompanyBenefits(ctx.request.body);
  const result = await BenefitController.setBenefits(ctx);
  return ctx.created(result);
});


module.exports = router;
