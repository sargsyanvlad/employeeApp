const SkillsServices = require('../../services/skills');

class SkillsController {
  static async create(params) {
    return SkillsServices.create(params);
  }

  static async list(filter, existing) {
    return SkillsServices.list(filter, existing);
  }

  static async search(filter) {
    return SkillsServices.search(filter);
  }
}

module.exports = SkillsController;
