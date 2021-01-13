const { facebookSignUp } = require('../../../services/users/jobSeeker/register/fb_register');
const { linkedinSignUp } = require('../../../services/users/jobSeeker/register/linkedin_register');
const appleRegister = require('../../../services/users/jobSeeker/register/apple');
const validator = require('../../../../modules/validator/index');
const JobsController = require('../../../controllers/jobs/JobsController');
const JobSeekerController = require('../../../controllers/users/jobSeeker/JobSeekerController');
const { companyAuth } = require('../../../middlewares/companyAuth');
const { globalAuth } = require('../../../middlewares/globalAuth');
const { jobSeekerAuth } = require('../../../middlewares/jobSeekerAuth');
const { idSchema, jobSeekerJobSchema } = require('../../../../modules/validator/validationSchemas');

const Router = require('koa-router');

const router = new Router();

router.post('/signUp', async (ctx) => {
  validator.asSignUp(ctx.request.body);
  const result = await JobSeekerController.signUp(ctx.request.body);
  return ctx.created(result);
});

router.post('/continue-signUp', globalAuth.asContinueSignUp, async (ctx) => {
  validator.asContinueSignUp(ctx.request.body);
  const result = await JobSeekerController.continueSignUp(ctx.state.user, ctx.request.body);
  return ctx.created({ success: true, result });
});

router.post('/signUp-facebook', async (ctx) => {
  validator.customValidation(ctx.request.body, { id_token: { type: 'string', empty: false, optional: false } });
  const result = await facebookSignUp(ctx.request.body.id_token);
  return ctx.created(result);
});

router.post('/signUp-linkedin', async (ctx) => {
  validator.customValidation(ctx.request.body, { id_token: { type: 'string', empty: false, optional: false } });
  const result = await linkedinSignUp(ctx.request.body.id_token);
  return ctx.created(result);
});

router.post('/signUp-apple', async (ctx) => {
  const result = await appleRegister(ctx.request.body);
  return ctx.created(result);
});

router.get('/me', jobSeekerAuth.asJobSeeker, async (ctx) => {
  const user = await JobSeekerController.getJobSeeker(ctx.state.user.id);
  return ctx.ok({ result: { user } });
});

router.put('/me', jobSeekerAuth.asJobSeeker, async (ctx) => {
  await validator.asJobSeekerUpdateData(ctx.request.body);
  const result = await JobSeekerController.updateProfile(ctx.state.user.id, ctx.request.body);
  return ctx.created(result);
});

router.post('/apply', companyAuth.asCompanyUser, async (ctx) => {
  validator.customValidation(ctx.request.query, jobSeekerJobSchema);
  const { jobSeekerId, jobId } = ctx.request.query;
  const result = await JobsController.applyJobSeeker(ctx.state.user, jobSeekerId, jobId);
  return ctx.created(result);
});

router.delete('/apply', companyAuth.asCompanyUser, async (ctx) => {
  validator.customValidation(ctx.request.query, jobSeekerJobSchema);
  const { jobId, jobSeekerId } = ctx.request.query;
  const result = await JobsController.unMatchJobSeeker(ctx.state.user.id, jobId, jobSeekerId);
  return ctx.ok(result);
});

router.post('/favorite/:id', companyAuth.asCompanyUser, async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const result = await JobSeekerController.markJobSeekerAsFavorite(ctx.state.user, ctx.params.id);
  return ctx.created(result);
});

router.delete('/favorite/:id', companyAuth.asCompanyUser, async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const result = await JobSeekerController.unMarkJobSeekerAsFavorite(ctx.state.user, ctx.params.id);
  return ctx.created(result);
});

router.post('/decline', companyAuth.asCompanyUser, async (ctx) => {
  validator.customValidation(ctx.request.query, jobSeekerJobSchema);
  const { jobSeekerId, jobId } = ctx.request.query;
  const result = await JobsController.declineJobSeeker(ctx.state.user, jobSeekerId, jobId);
  return ctx.created(result);
});

router.delete('/decline', companyAuth.asCompanyUser, async (ctx) => {
  validator.customValidation(ctx.request.query, jobSeekerJobSchema);
  const { jobSeekerId, jobId } = ctx.request.query;
  const result = await JobsController.unDeclineJobSeeker(ctx.state.user, jobSeekerId, jobId);
  return ctx.ok(result);
});

router.post('/matched', companyAuth.isPremiumOrUpgraded, async (ctx) => {
  const { queryParams } = ctx.request.body;
  const result = await JobsController.getMatchedJobSeekers(ctx.state.user, queryParams);
  return ctx.ok(result);
});

router.post('/pending', companyAuth.asCompanyUser, async (ctx) => {
  const { queryParams } = ctx.request.body;
  const result = await JobsController.getPendingJobSeekers(ctx.state.user, queryParams);
  return ctx.ok(result);
});

router.post('/declined', companyAuth.asCompanyUser, async (ctx) => {
  const { queryParams } = ctx.request.body;
  const result = await JobsController.getDeclinedJobSeekers(ctx.state.user, queryParams);
  return ctx.ok(result);
});

router.post('/suggested', companyAuth.asCompanyUser, async (ctx) => {
  validator.customValidation(ctx.request.body, { jobId: { type: 'number', optional: false, empty: false } });
  const { jobId, queryParams } = ctx.request.body;
  const result = await JobsController.getSuggestedJobSeekers(ctx.state.user, jobId, queryParams);
  return ctx.ok(result);
});

router.get('/swipedOnMe', jobSeekerAuth.swipedOnMeAccess, async (ctx) => {
  const result = await JobSeekerController.getSwipes(ctx.state.user);
  return ctx.ok(result);
});

router.get('/:id', globalAuth.asUser, async (ctx) => {
  validator.customValidation(ctx.params, idSchema);
  const { jobId } = ctx.request.query;
  const user = await JobSeekerController.getJobSeekerById(ctx.state.user.id, ctx.params.id, jobId);
  return ctx.ok({ result: { user } });
});

module.exports = router;
