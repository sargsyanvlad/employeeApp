const packagesServices = require('../../services/packages/packagesServices');

class PackagesControllerClass {
  static async getSuggestedPackages(user) {
    return packagesServices.getSuggestedPackages(user);
  }

  static async buyPackage(user, packageId, data) {
    return packagesServices.buyPackage(user, packageId, data);
  }

  static async validateReceipt(user, data) {
    await packagesServices.validateReceipt(user, data);
  }
}

module.exports = PackagesControllerClass;
