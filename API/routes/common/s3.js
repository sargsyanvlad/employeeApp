const Router = require('koa-router');
const S3 = require('../../../modules/s3');

const router = new Router({
  prefix: '/s3',
});


router.get('/signedUrl', async (ctx) => {
  const signedUrl = await S3.getSignedUrl(ctx.request.query);
  return ctx.ok({
    signedUrl,
  });
});

module.exports = router;

