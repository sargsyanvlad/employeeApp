const BenefitServices = require('../../services/benefit');
const { logger } = require('../../../utils/logger');

class BenefitController {
  static async create(params) {
    logger.info('create Benefits');
    try {
      const result = await BenefitServices.create(params);
      return {
        success: true,
        result,
      };
    } catch (err) {
      throw err;
    }
  }


  static async list(filter, existing) {
    try {
      const result = await BenefitServices.list(filter, existing);
      return {
        success: 'true',
        result,
      };
    } catch (err) {
      throw err;
    }
  }

  static async search(filter) {
    try {
      const result = await BenefitServices.search(filter);
      return {
        success: true,
        result,
      };
    } catch (err) {
      throw err;
    }
  }

  static async setBenefits(ctx) {
    logger.info('=====> setBenefits <=====');
    try {
      const result = await BenefitServices.setBenefits(ctx.state.user.id, ctx.request.body);
      return {
        success: true,
        result,
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BenefitController;
