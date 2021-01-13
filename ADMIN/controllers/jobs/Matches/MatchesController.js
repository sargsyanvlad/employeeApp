const { MatchesServices } = require('../../../services');

class MatchesController {
  static async getAllMatches(filter) {
    return MatchesServices.getAllMatches(filter);
  }
}

module.exports = MatchesController;
