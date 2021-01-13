const {
  Job, JobsMap, User, JobSeeker, sequelize
} = require('../../../data/models');

class MatchesServices {
  static async getAllMatches(params) {
    const {
      limit, offset, order, date: { from, to },
      groupBy = 'month'
    } = params;

    const matches = await JobsMap.findAndCountAll({
      order: [[sequelize.literal(order)]],
      limit,
      offset,
      where: {
        createdAt: {
          gte: from,
          lte: to
        },
        appliedByCompany: true,
        appliedByJobSeeker: true,
      },
      distinct: true,
      attributes: ['id', 'jobSeekerId', 'jobId', 'updatedAt'],
      include: [
        {
          model: JobSeeker,
          as: 'jobSeeker',
          include: [
            {
              model: User,
              as: 'user',
              required: true,
              attributes: ['avatar', 'firstName', 'lastName', 'email'],
            },
          ],
          attributes: {
            exclude: ['locationPoint']
          },
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'companyLogo', 'companyName', 'companyId', 'type', 'description'],
        },
      ],
    });

    const timeSeries = await JobsMap.findAll({
      where: {
        createdAt: {
          gte: from,
          lte: to
        },
        appliedByCompany: true,
        appliedByJobSeeker: true,
      },
      attributes: [
        [sequelize.fn('date_trunc', groupBy, sequelize.col('updatedAt')), groupBy],
        [sequelize.fn('count', '*'), 'count']
      ],
      group: groupBy
    });

    return { timeSeries, matches };
  }
}

module.exports = MatchesServices;
