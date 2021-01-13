const Router = require('koa-router');
const JobsController = require('../../controllers/jobs/JobsController');
const validator = require('../../../modules/validator/index');

const { companyAuth } = require('../../middlewares/companyAuth');
const { jobSeekerAuth } = require('../../middlewares/jobSeekerAuth');
const { globalAuth } = require('../../middlewares/globalAuth');
const { idSchema } = require('../../../modules/validator/validationSchemas');


const router = new Router();

router.post('/', companyAuth.jobCreateAccess, async (ctx) => {
  validator.asJob(ctx.request.body);
  const { state: { user }, request: { body } } = ctx;
  const result = await JobsController.createJob(user, body);
  return ctx.created(result);
});

router.post('/suggested', jobSeekerAuth.asJobSeeker, async (ctx) => {
  const result = await JobsController.getSuggestedJobs(ctx.state.user, ctx.request.body);
  return ctx.ok(result);
});

// fixme change auth middleware to jobSeekerAuth.hasJobSeekerPremiumAccess
router.post('/matched', jobSeekerAuth.asJobSeeker, async (ctx) => {
  const { state: { user }, request: { body, body: { queryParams } } } = ctx;
  const result = await JobsController.getMatchedJobs(user, body, queryParams);
  return ctx.ok(result);
});

router.post('/favorite/:id', jobSeekerAuth.asJobSeeker, async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const { state: { user } } = ctx;
  const result = await JobsController.markJobAsFavorite(user, ctx.params.id);
  return ctx.created(result);
});

router.delete('/favorite/:id', jobSeekerAuth.asJobSeeker, async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const { state: { user } } = ctx;
  const result = await JobsController.unMarkJobAsFavorite(user, ctx.params.id);
  return ctx.created(result);
});

router.post('/pending', jobSeekerAuth.asJobSeeker, async (ctx) => {
  const { body: { queryParams } } = ctx.request;
  const { state: { user } } = ctx;
  const result = await JobsController.getPendingJobs(user, queryParams);
  return ctx.ok(result);
});

router.post('/declined', jobSeekerAuth.asJobSeeker, async (ctx) => {
  const { body: { queryParams } } = ctx.request;
  const { state: { user } } = ctx;
  const result = await JobsController.getDeclinedJobs(user, queryParams);
  return ctx.ok(result);
});

router.delete('/apply/:id', jobSeekerAuth.asJobSeeker, async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const { state: { user } } = ctx;
  const result = await JobsController.unMatchJob(user, ctx.params.id);
  return ctx.ok(result);
});

router.post('/apply/:id', jobSeekerAuth.asJobSeeker, async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const { state: { user } } = ctx;
  const result = await JobsController.applyJob(user, ctx.params.id);
  return ctx.ok(result);
});

router.post('/decline/:id', jobSeekerAuth.asJobSeeker, async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const { state: { user } } = ctx;
  const result = await JobsController.declineJob(user, ctx.params.id);
  return ctx.ok(result);
});

router.delete('/:id', companyAuth.asCompanyUser, async (ctx) => {
  const { state: { user } } = ctx;
  await JobsController.deleteJobById(user, ctx.params.id);
  return ctx.noContent();
});

router.put('/:id', companyAuth.asCompanyUser, async (ctx) => {
  validator.asJob({ ...ctx.request.body });
  const { state: { user }, request: { body } } = ctx;
  const result = await JobsController.updateJobById(user, body, ctx.params.id);
  return ctx.ok(result);
});

router.get('/', companyAuth.asCompanyUser, async (ctx) => {
  const { state: { user }, request: { query } } = ctx;
  const result = await JobsController.getCompanyJobs(user, query);
  return ctx.ok(result);
});

router.get('/:id', globalAuth.asUser, async (ctx) => {
  const { state: { user }, request: { query: { latitude, longitude } } } = ctx;
  const result = await JobsController.getJobById(user, ctx.params.id, { latitude, longitude });
  return ctx.ok(result);
});

router.post('/suggested/initial', jobSeekerAuth.asJobSeeker, async (ctx) => {
  const result = await JobsController.getInitialSuggestedJobs(ctx);
  return ctx.ok(result);
});


module.exports = router;
