const { JobSeekerServices } = require('../../../services');

class JobSeekerController {
  static async getAllJobSeekers(filter) {
    return JobSeekerServices.getAllJobSeekers(filter);
  }
  static async getOnlineJobSeekers(filter) {
    return JobSeekerServices.getOnlineJobSeekers(filter);
  }
  static async getNewJobSeekers(filter) {
    return JobSeekerServices.getNewJobSeekers(filter);
  }
}

module.exports = JobSeekerController;

