const { AdminServices } = require('../../services');

class AdminController {
  static async login(email, password) {
    return AdminServices.login(email, password);
  }
}

module.exports = AdminController;

