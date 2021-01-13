const IndustryServices = require('../../services/industry');

class IndustryController {
  static async create(params) {
    return IndustryServices.create(params);
  }

  static async list(filter, existing) {
    try {
      const result = await IndustryServices.list(filter, existing);
      return {
        success: true,
        result,
      };
    } catch (err) {
      throw err;
    }
  }

  static async search(filter) {
    try {
      const result = await IndustryServices.search(filter);
      return {
        success: true,
        result,
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = IndustryController;
