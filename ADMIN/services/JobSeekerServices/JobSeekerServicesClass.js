const { JobSeeker, User, sequelize } = require('../../../data/models');
const { USER_ROLES } = require('../../../utils/constants');
const moment = require('moment');

class JobSeekerServices {
  static async getAllJobSeekers(params) {
    const {
      filter: { key = 'firstName', text = '' }, limit, offset, order, date: { from, to },
      groupBy
    } = params;

    const jobSeekers = await User.findAndCountAll({
      limit,
      offset,
      order: [[sequelize.literal(order)]],
      where: {
        [`${key}`]: { ilike: `%${text}%` },
        createdAt: {
          gte: from,
          lte: to
        }
      },
      include:
        {
          required: true,
          model: JobSeeker,
          as: 'jobSeeker',
        },
    });

    const timeSeries = await User.findAll({
      where: {
        createdAt: {
          gte: from,
          lte: to
        },
        role: USER_ROLES.JOBSEEKER
      },
      attributes: [
        [sequelize.fn('date_trunc', groupBy, sequelize.col('createdAt')), groupBy],
        [sequelize.fn('count', '*'), 'count']
      ],
      group: groupBy
    });
    return { timeSeries, jobSeekers };
  }

  static async getOnlineJobSeekers() {
    return User.findAll({
      where: { role: USER_ROLES.JOBSEEKER },
      having: sequelize.literal('(now()::timestamp - "User"."activeDate"::timestamp) < \'0 months 0 days 0 hours 10 minutes 0 secs\'::INTERVAL'),
      group: ['User.id']
    });
  }

  static async getNewJobSeekers() {
    return User.findAll({
      where: {
        role: USER_ROLES.JOBSEEKER,
        createdAt: {
          gte: moment().format('YYYY-MM-DD 00:00:00'),
          lte: moment().format('YYYY-MM-DD 23:59:59')
        }
      },
    });
  }
}

module.exports = JobSeekerServices;
