/* eslint-disable no-console */
const { jobService } = require('../../services/job');
const UserController = require('../users/user/UserController');
const exceptions = require('../../../modules/exceptions');
const JobSeekerController = require('../users/jobSeeker/JobSeekerController');

class JobsControllerClass {
  static async createJob(user, data) {
    return jobService.createJob(user, data);
  }

  static async getJobById(user, id, userLocation) {
    return jobService.getJobById(user, id, userLocation);
  }

  static async getCompanyJobs(user, query) {
    return jobService.getCompanyJobs(user, query);
  }

  static async deleteJobById(user, jobId) {
    const { result: { job } } = await JobsControllerClass.getJobById(user, jobId);

    if (job.userId !== user.id && job.companyId !== user.company.id) {
      throw new exceptions.SomethingWentWrong({ message: 'You Have not Job With Provided Id' });
    }

    return jobService.deleteJobById(user.id, jobId);
  }

  static async updateJobById(user, updateData, jobId) {
    const { result: { job } } = await JobsControllerClass.getJobById(user, jobId);

    if (job.userId !== user.id && job.companyId !== user.company.id) {
      throw new exceptions.SomethingWentWrong({ message: 'You Have not Job With Provided Id' });
    }

    return jobService.updateJobById(user, updateData, jobId);
  }

  // Note Get All Jobs which matching JobSeeker's industries and interest
  // Note filtered by Distance, ...etc
  static async getSuggestedJobs(user, body) {
    const result = await UserController.getBlockedUsers(user.id);

    const blockedUsers = result.blockedUsers.map(item => item.id);

    return jobService.getSuggestedJobs(user, body, blockedUsers);
  }

  // Note Should Return All Jobs where both: Company  and JobSeeker Applied each other
  static async getMatchedJobs(user, data, queryParams) {
    return jobService.getMatchedJobs(user, data, queryParams);
  }

  static async unMatchJob(user, jobId) {
    return jobService.unMatchJob(user, jobId);
  }

  static async unMatchJobSeeker(userId, jobId, jobSeekerId) {
    return jobService.unMatchJobSeeker(userId, jobId, jobSeekerId);
  }

  static async unDeclineJob(user, jobId) {
    await JobsControllerClass.getJobById(user, jobId);
    return jobService.unDeclineJob(user, jobId);
  }

  static async unDeclineJobSeeker(user, jobSeekerId, jobId) {
    return jobService.unDeclineJobSeeker(user, jobSeekerId, jobId);
  }

  // Note Should Return All Jobs where JobSeekerApplied but company did not declined or applied yet
  static async getPendingJobs(user, queryParams) {
    return jobService.getPendingJobs(user, queryParams);
  }

  static async getPendingJobSeekers(user, queryParams) {
    return jobService.getPendingJobSeekers(user, queryParams);
  }

  // Note Should Return All Jobs where JobSeeker declined Jobs
  static async getDeclinedJobs(user, queryParams) {
    return jobService.getDeclinedJobs(user, queryParams);
  }

  static async getDeclinedJobSeekers(user, queryParams) {
    return jobService.getDeclinedJobSeekers(user, queryParams);
  }

  // Note Should Return All jobSeekers where JobSeeker Applied to Job
  // Note I'ts not relevant is Company Applied that JobSeeker or not
  static async getMatchedJobSeekers(user, queryParams) {
    return jobService.getMatchedJobSeekers(user, queryParams);
  }

  static async applyJob(user, jobId) {
    const { result: { job } } = await JobsControllerClass.getJobById(user, jobId);
    return jobService.applyJob(user, job);
  }

  static async declineJob(user, jobId) {
    await JobsControllerClass.getJobById(user, jobId);
    return jobService.declineJob(user, jobId);
  }

  static async applyJobSeeker(user, jobSeekerId, jobId) {
    const { result: { job } } = await JobsControllerClass.getJobById(user, jobId);
    if (job.userId !== user.id && job.companyId !== user.company.id) {
      throw new exceptions.SomethingWentWrong({ message: 'Incorrect Job Id' });
    }
    await JobSeekerController.getJobSeekerById(user.id, jobSeekerId, jobId);
    return jobService.applyJobSeeker(jobSeekerId, user.id, jobId);
  }

  static async declineJobSeeker(user, jobSeekerId, jobId) {
    const { result: { job } } = await JobsControllerClass.getJobById(user, jobId);
    if (job.userId !== user.id && job.companyId !== user.company.id) {
      throw new exceptions.SomethingWentWrong({ message: 'Incorrect Job Id' });
    }
    await JobSeekerController.getJobSeekerById(user.id, jobSeekerId, jobId);
    return jobService.declineJobSeeker(user.id, jobSeekerId, jobId);
  }

  static async getSuggestedJobSeekers(user, jobId, queryParams) {
    const { result: { job } } = await JobsControllerClass.getJobById(user, jobId);
    if (job.userId !== user.id && job.companyId !== user.company.id) {
      throw new exceptions.SomethingWentWrong({ message: 'Incorrect Job Id' });
    }
    const result = await UserController.getBlockedUsers(user.id);
    const blockedUsers = result.blockedUsers.map(item => item.id);
    return jobService.getSuggestedJobSeekers(user, jobId, blockedUsers, queryParams);
  }

  static async markJobAsFavorite(user, jobId) {
    await JobsControllerClass.getJobById(user, jobId);
    return jobService.markAsFavorite(user, jobId);
  }

  static async unMarkJobAsFavorite(user, jobId) {
    await JobsControllerClass.getJobById(user, jobId);
    return jobService.unMarkJobAsFavorite(user, jobId);
  }

  static async getInitialSuggestedJobs(ctx) {
    ctx.request.body.lat = ctx.state.user.jobSeeker.latitude;
    ctx.request.body.lng = ctx.state.user.jobSeeker.longitude;
    ctx.request.body.distance = 35;
    return JobsControllerClass.getSuggestedJobs(ctx.state.user, ctx.request.body);
  }
}

module.exports = JobsControllerClass;
