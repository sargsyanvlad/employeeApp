const Router = require('koa-router');

const CompanyController = require('../../../controllers/users/company/CompanyController');
const validator = require('../../../../modules/validator/index');
const { globalAuth } = require('../../../middlewares/globalAuth');
const { companyAuth } = require('../../../middlewares/companyAuth');

const router = new Router();

router.get('/me', companyAuth.asCompanyUser, async (ctx) => {
  const { state: { user } } = ctx;
  const result = await CompanyController.getCompanyProfile(user);
  return ctx.ok(result);
});

router.get('/:id', globalAuth.asUser, async (ctx) => {
  validator.customValidation(ctx.params, {
    id: {
      type: 'number', optional: false, convert: true, empty: false
    }
  });
  const result = await CompanyController.getCompanyProfileById(ctx.params.id);
  return ctx.ok(result);
});

router.post('/', async (ctx) => {
  validator.asCompanyRegisterData(ctx.request.body);
  const { request: { body } } = ctx;
  const result = await CompanyController.register(body);
  return ctx.created({ success: true, result });
});

router.post('/user', companyAuth.asCompanyUser, async (ctx) => {
  validator.asCompanyUserData(ctx.request.body);
  const { state: { user }, request: { body } } = ctx;
  const result = await CompanyController.addCompanyUser(user, body);
  return ctx.created(result);
});

router.put('/me', companyAuth.asCompanyUser, async (ctx) => {
  validator.asCompanyUpdatingData(ctx.request.body);
  const { state: { user }, request: { body } } = ctx;
  const result = await CompanyController.updateCompanyProfile(user, body);
  return ctx.created(result);
});

router.delete('/user/:id', companyAuth.asCompanyUser, async (ctx) => {
  validator.customValidation(ctx.params, {
    id: {
      type: 'number', optional: false, convert: true, empty: false
    }
  });
  const { state: { user } } = ctx;
  const result = await CompanyController.deleteCompanyUser(user, ctx.params.id);
  return ctx.ok(result);
});

module.exports = router;
