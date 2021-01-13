const parseQueryParams = require('../../../../../utils/queryParams');
const Router = require('koa-router');

const { CompanyController } = require('../../../../controllers/user');
const { getAllCompaniesSchema } = require('../../../../../modules/validator/adminValidationSchemas');

const exceptions = require('../../../../../modules/exceptions');
const validator = require('../../../../../modules/validator');

const router = new Router();

router.get('/', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);

  validator.customValidation(filter, getAllCompaniesSchema);

  if (filter.date.from > filter.date.to) throw new exceptions.InvalidUserInput({ message: 'filter.date.from Can\'t Be greater than filter.date.to' });

  const { companies, timeSeries } = await CompanyController.getAllCompanies(filter);
  return ctx.ok({ companies, timeSeries });
});

router.get('/online', async (ctx) => {
  const result = await CompanyController.getOnlineCompanyUsers();
  return ctx.ok({ count: result.length });
});

router.get('/new', async (ctx) => {
  const result = await CompanyController.getNewCompanies();
  return ctx.ok({ count: result.length });
});

module.exports = router;
