const { UserServices } = require('../../../services');

class UserController {
  static async getAllUsers(filter) {
    return UserServices.getAllUsers(filter);
  }

  static async getUserById(userId) {
    return UserServices.getUserById(userId);
  }

  static async deleteUser(userId) {
    return UserServices.deleteUser(userId);
  }
  static async banUserById(userId) {
    return UserServices.banUserById(userId);
  }

  static async unBanUserById(userId) {
    return UserServices.unBanUserById(userId);
  }

  static async getBannedUsers(filter) {
    return UserServices.getBannedUsers(filter);
  }

  static async getReportedUsers(filter) {
    return UserServices.getReportedUsers(filter);
  }

  static async getBlockedUsers(filter) {
    return UserServices.getBlockedUsers(filter);
  }
}

module.exports = UserController;

