const Router = require('koa-router');
const parseQueryParams = require('../../../utils/queryParams');
const validator = require('../../../modules/validator/index');
const IndustryController = require('../../controllers/industry/IndustryController');

const router = new Router();

router.post('/', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  const result = await IndustryController.list(filter, ctx.request.body);
  return ctx.created(result);
});

// Note GET request left because need of compatibility with elder version
// todo may be removed
router.get('/', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  const result = await IndustryController.list(filter);
  return ctx.created(result);
});

router.get('/filter', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  const result = await IndustryController.search(filter);
  return ctx.created(result);
});

router.post('/create', async (ctx) => {
  validator.customValidation(ctx.request, {
    body: {
      type: 'array',
      min: 1,
      optional: false,
      items: {
        type: 'object',
        props: {
          name: { type: 'string', empty: false },
        },
      },
    }
  });
  const result = await IndustryController.create(ctx.request.body);
  return ctx.created({ result });
});


module.exports = router;
