const Router = require('koa-router');

const { globalAuth } = require('../../middlewares/globalAuth');
const { chatAuth } = require('../../middlewares/chatAuth');

const ChatController = require('../../controllers/chat/ChatController');

const router = new Router();

router.get('/grantToken', globalAuth.asUser, async (ctx) => {
  const result = await ChatController.getGrantToken(ctx);
  return ctx.ok(result);
});

router.get('/conversations', globalAuth.asUser, async (ctx) => {
  const result = await ChatController.getConversationsList(ctx);
  return ctx.created(result);
});

router.post('/', chatAuth.asChatCreateAccess, async (ctx) => {
  const result = await ChatController.createConversation(ctx);
  return ctx.created(result);
});

router.delete('/', chatAuth.asChatRemoveAccess, async (ctx) => {
  const result = await ChatController.removeConversation(ctx);
  return ctx.created(result);
});

module.exports = router;
