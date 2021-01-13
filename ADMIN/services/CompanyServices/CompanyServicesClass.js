const {
  Company, User, sequelize, sequelize: { Op }
} = require('../../../data/models');
const { USER_ROLES } = require('../../../utils/constants');
const moment = require('moment');

class CompanyServices {
  static async getAllCompanies(params) {
    const {
      filter: { key = 'name', text = '' }, limit, offset, order, date: { from, to }, groupBy
    } = params;

    const userWhere = {
      role: USER_ROLES.COMPANY
    };

    const companyWhere = {
      [`${key}`]: { ilike: `%${text}%` },
      createdAt: {
        gte: from,
        lte: to
      },
    };

    if (key === 'email') {
      userWhere[`${key}`] = { ilike: `%${text}%` };
      delete companyWhere[`${key}`];
    }

    const companies = await User.findAndCountAll({
      limit,
      offset,
      order: [[sequelize.literal(order)]],
      where: userWhere,
      include:
        {
          required: true,
          where: companyWhere,
          model: Company,
          as: 'Company',
        },
    });

    const timeSeries = await Company.findAll({
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

    return { timeSeries, companies };
  }

  static async getOnlineCompanyUsers() {
    return User.findAll({
      where: {
        role: {
          [Op.or]: [USER_ROLES.COMPANY, USER_ROLES.COMPANY_USER],
        },
      },
      having: sequelize.literal('(now()::timestamp - "User"."activeDate"::timestamp) < \'0 months 0 days 0 hours 10 minutes 0 secs\'::INTERVAL'),
      group: ['User.id']
    });
  }

  static async getNewCompanies() {
    return Company.findAll({
      where: {
        createdAt: {
          gte: moment().format('YYYY-MM-DDT00:00:00'),
          lte: moment().format('YYYY-MM-DDT23:59:59')
        }
      },
    });
  }
}

module.exports = CompanyServices;
