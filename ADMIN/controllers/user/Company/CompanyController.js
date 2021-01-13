const { CompanyServices } = require('../../../services');

class CompanyController {
  static async getAllCompanies(filter) {
    return CompanyServices.getAllCompanies(filter);
  }
  static async getOnlineCompanyUsers() {
    return CompanyServices.getOnlineCompanyUsers();
  }
  static async getNewCompanies() {
    return CompanyServices.getNewCompanies();
  }
}

module.exports = CompanyController;

