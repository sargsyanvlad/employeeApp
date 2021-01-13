const parseQueryParams = require('../../../../../utils/queryParams');
const Router = require('koa-router');

const { MatchesController } = require('../../../../controllers/jobs');
const { getAllMatchesSchema } = require('../../../../../modules/validator/adminValidationSchemas');

const exceptions = require('../../../../../modules/exceptions');
const validator = require('../../../../../modules/validator');

const router = new Router();

router.get('/', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  validator.customValidation(filter, getAllMatchesSchema);
  if (filter.date.from > filter.date.to) throw new exceptions.InvalidUserInput({ message: 'filter.date.from Can\'t Be greater than filter.date.to' });

  const result = await MatchesController.getAllMatches(filter);
  return ctx.ok({ result });
});

module.exports = router;
