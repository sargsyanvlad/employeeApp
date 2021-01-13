const InterestServices = require('../../services/interest');

class InterestController {
  static async create(params) {
    return InterestServices.create(params);
  }

  static async list(filter, existing) {
    return InterestServices.list(filter, existing);
  }

  static async search(filter) {
    return InterestServices.search(filter);
  }
}

module.exports = InterestController;
