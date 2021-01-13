/* eslint-disable no-console */
const { chatService } = require('../../services/chat/index');
const validator = require('../../../modules/validator');

const chatSchema = {
  userId: {
    type: 'number',
    optional: false,
    empty: false,
    convert: true,
  },
};


class ChatController {
  static async getGrantToken(ctx) {
    try {
      console.log('getGrantToken ====>');
      return await chatService.getGrantToken(ctx.state.user);
    } catch (err) {
      throw err;
    }
  }

  static async getConversationsList(ctx) {
    try {
      console.log('getConversationList ====>');
      return await chatService.getConversationsList(ctx.state.user);
    } catch (err) {
      throw err;
    }
  }

  static async createConversation(ctx) {
    try {
      console.log('createConversation ====>');
      validator.customValidation({ ...ctx.request.body }, chatSchema);
      return await chatService.createConversation(ctx.state.user, ctx.request.body);
    } catch (err) {
      throw err;
    }
  }

  static async removeConversation(ctx) {
    try {
      console.log('removeConversation ====>');
      return await chatService.removeConversation(ctx.state.user, ctx.request.query);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ChatController;
