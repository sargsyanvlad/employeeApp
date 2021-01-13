const parseQueryParams = require('../../../../../utils/queryParams');
const Router = require('koa-router');

const { JobsController } = require('../../../../controllers/jobs');
const { getAllJobsSchema } = require('../../../../../modules/validator/adminValidationSchemas');

const exceptions = require('../../../../../modules/exceptions');
const validator = require('../../../../../modules/validator');

const router = new Router();

router.get('/', async (ctx) => {
  const filter = parseQueryParams(ctx.request.query);
  validator.customValidation(filter, getAllJobsSchema);
  if (filter.date.from > filter.date.to) throw new exceptions.InvalidUserInput({ message: 'filter.date.from Can\'t Be greater than filter.date.to' });

  const { jobs, timeSeries } = await JobsController.getAllJobs(filter);
  return ctx.ok({ jobs, timeSeries });
});


module.exports = router;
