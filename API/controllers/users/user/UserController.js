const userServices = require('../../../services/users/user/userServices');

class UserController {
  static async login(email) {
    return userServices.login(email);
  }

  static async checkEmail(email) {
    return userServices.checkEmail(email);
  }

  static async setCloudToken(ctx) {
    const userId = ctx.state.user.id;
    const { body } = ctx.request;
    return userServices.setCloudToken(userId, body);
  }

  static async changePassword(ctx) {
    const { state: { user, token }, request: { body } } = ctx;
    return userServices.changePassword(user, body, token);
  }

  static async forgotPassword(ctx) {
    const { body } = ctx.request;
    return userServices.forgotPassword(body);
  }

  static async resetPassword(ctx) {
    const { body: { password } } = ctx.request;
    const userId = ctx.state.user.id;
    return userServices.resetPassword(userId, password);
  }

  static async deleteProfile(user, body) {
    return userServices.deleteProfile(user, body);
  }

  static async setActiveStatus(ctx) {
    return userServices.setActiveStatus(ctx.state.user);
  }

  static async reportUser(ctx) {
    return userServices.reportUser(ctx.state.user, ctx.request.body);
  }

  static async confirmAccount(ctx) {
    const { state: { user } } = ctx;
    return userServices.confirmAccount(user);
  }

  static async resendConfirmationEmail(email, user) {
    return userServices.resendConfirmationEmail(email, user);
  }

  static async blockUser(ctx) {
    return userServices.blockUser(ctx.state.user, ctx.params.id);
  }

  static async getBlockedUsers(userId) {
    return userServices.getBlockedUsers(userId);
  }

  static async unBlockUser(user, blockedId) {
    return userServices.unBlockUser(user, blockedId);
  }
}

module.exports = UserController;
