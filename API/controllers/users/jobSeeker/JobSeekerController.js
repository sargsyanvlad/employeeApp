const jobSeekerServices = require('../../../services/users/jobSeeker/jobSeekerServices');

class JobSeekerController {
  static async getJobSeeker(userId) {
    return jobSeekerServices.getJobSeeker(userId);
  }

  static async getJobSeekerById(userId, jobSeekerId, jobId) {
    return jobSeekerServices.getJobSeekerById(userId, jobSeekerId, jobId);
  }

  static async updateProfile(userId, body) {
    return jobSeekerServices.updateJobSeeker(userId, body);
  }

  static async getSwipes(user) {
    return jobSeekerServices.getSwipes(user);
  }

  static async markJobSeekerAsFavorite(user, jobSeekerId) {
    return jobSeekerServices.markJobSeekerAsFavorite(user, jobSeekerId);
  }

  static async unMarkJobSeekerAsFavorite(user, jobSeekerId) {
    return jobSeekerServices.unMarkJobSeekerAsFavorite(user, jobSeekerId);
  }

  static async signUp(data) {
    return jobSeekerServices.signUp(data);
  }

  static async continueSignUp(user, data) {
    return jobSeekerServices.continueSignUp(user, data);
  }
}

module.exports = JobSeekerController;
