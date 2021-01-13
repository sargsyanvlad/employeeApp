const parseQueryParams = require('../../../../../utils/queryParams');
const Router = require('koa-router');

const { JobSeekerController } = require('../../../../controllers/user');
const { getAllJobSeekersSchema } = require('../../../../../modules/validator/adminValidationSchemas');

const exceptions = require('../../../../../modules/exceptions');
const validator = require('../../../../../modules/validator');

const router = new Router();

router.get('/', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  validator.customValidation(filter, getAllJobSeekersSchema);

  if (filter.date.from > filter.date.to) throw new exceptions.InvalidUserInput({ message: 'filter.date.from Can\'t Be greater than filter.date.to' });

  const { jobSeekers, timeSeries } = await JobSeekerController.getAllJobSeekers(filter);
  return ctx.ok({ jobSeekers, timeSeries });
});

router.get('/online', async (ctx) => {
  const result = await JobSeekerController.getOnlineJobSeekers();
  return ctx.ok({ count: result.length });
});

router.get('/new', async (ctx) => {
  const result = await JobSeekerController.getNewJobSeekers();
  return ctx.ok({ count: result.length });
});


module.exports = router;
