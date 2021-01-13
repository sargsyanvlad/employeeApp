const OccupationsServices = require('../../services/occupations');

class OccupationsController {
  static async create(params) {
    return OccupationsServices.create(params);
  }

  static async list(filter, existing) {
    return OccupationsServices.list(filter, existing);
  }

  static async search(filter) {
    return OccupationsServices.search(filter);
  }
}

module.exports = OccupationsController;
