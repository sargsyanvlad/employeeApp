const { Job, Requirement, sequelize } = require('../../../data/models');

class JobServices {
  static async getAllJobs(params) {
    const {
      filter: { key = 'title', text = '' }, limit, offset, order, date: { from, to },
      groupBy = 'month'
    } = params;

    const jobs = await Job.findAndCountAll({
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
      include: [
        {
          model: Requirement,
          as: 'Requirement',
          raw: true,
        }
      ],
    });

    const timeSeries = await Job.findAll({
      where: {
        createdAt: {
          gte: from,
          lte: to
        }
      },
      attributes: [
        [sequelize.fn('date_trunc', groupBy, sequelize.col('createdAt')), groupBy],
        [sequelize.fn('count', '*'), 'count']
      ],
      group: groupBy
    });
    return { timeSeries, jobs };
  }
}

module.exports = JobServices;
