const { JobServices } = require('../../../services');

class JobsController {
  static async getAllJobs(filter) {
    return JobServices.getAllJobs(filter);
  }
}

module.exports = JobsController;
