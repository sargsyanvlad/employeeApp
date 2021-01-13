const auth = require('../../../services/users/company/services');

const companyServices = require('../../../services/users/company/companyServices');

class CompanyController {
  static async register(data) {
    return auth.register(data);
  }

  static async getCompanyProfileById(companyId) {
    console.log('companyId', companyId)
    return companyServices.getCompanyProfileById(companyId);
  }

  static async getCompanyProfile(user) {
    return companyServices.getCompanyProfile(user);
  }

  static async updateCompanyProfile(user, data) {
    return companyServices.updateCompanyProfile(user, data);
  }

  static async addCompanyUser(user, data) {
    return companyServices.addCompanyUser(user, data);
  }

  static async deleteCompanyUser(user, companyUserId) {
    return companyServices.deleteCompanyUser(user, companyUserId);
  }
}

module.exports = CompanyController;
