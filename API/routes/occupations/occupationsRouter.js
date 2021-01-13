const Router = require('koa-router');
const parseQueryParams = require('../../../utils/queryParams');
const validator = require('../../../modules/validator/index');

const schema = {
  body: {
    type: 'array',
    optional: true,
    items: {
      type: 'object',
      optional: true,
      props: {
        id: { type: 'number', positive: true },
        name: { type: 'string', empty: false },
      },
    },
  }
};

const OccupationsController = require('../../controllers/occupations/OccupationsController');

const router = new Router();

router.post('/', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  const skills = ctx.request.body;
  if (skills && skills.length) {
    validator.customValidation(ctx.request, schema);
  }
  const result = await OccupationsController.list(filter, ctx.request.body);
  return ctx.created({ result });
});

router.get('/filter', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  const result = await OccupationsController.search(filter);
  return ctx.created({ result });
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
  const result = await OccupationsController.create(ctx.request.body);
  return ctx.created({ result });
});


module.exports = router;
