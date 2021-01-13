const {
  Company, User, JobSeeker, Reports, BlockedUsers, sequelize, sequelize: { Op }
} = require('../../../data/models');
const { USER_ROLES } = require('../../../utils/constants');

class UserServices {
  static async getAllUsers(params) {
    const {
      filter: { key = 'firstName', text = '' }, limit, offset, order, date: { from, to },
      groupBy,
    } = params;

    const users = await User.findAndCountAll({
      offset,
      limit,
      subQuery: false,
      distinct: true,
      order: [[sequelize.literal(order)]],
      where: {
        [Op.or]: {
          '$Company.name$': { ilike: `%${text}%` },
          [`${key}`]: { ilike: `%${text}%` },
        },
        createdAt: {
          gte: from,
          lte: to
        },
        role: {
          [Op.in]: [USER_ROLES.JOBSEEKER, USER_ROLES.COMPANY, USER_ROLES.COMPANY_USER]
        }
      },
      include: [
        {
          model: Reports,
          as: 'reports',
          attributes: ['reason'],
          include: {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName', 'role', 'avatar']
          }
        },
        {
          model: BlockedUsers,
          as: 'blocks',
          attributes: ['createdAt'],
          include: {
            model: User,
            as: 'blockedBy',
            attributes: ['firstName', 'lastName', 'role', 'avatar']
          }
        },
        {
          model: JobSeeker,
          as: 'jobSeeker',
          required: false,
        },
        {
          model: Company,
          as: 'Company',
          required: false,
        },
      ],
    });

    const timeSeries = await User.findAll({
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

    return { timeSeries, users };
  }

  static async getUserById(id) {
    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: Reports,
          as: 'reports',
          attributes: ['reason'],
          include: {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName', 'role', 'avatar']
          }
        },
        {
          model: BlockedUsers,
          as: 'blocks',
          attributes: ['createdAt'],
          include: {
            model: User,
            as: 'blockedBy',
            attributes: ['firstName', 'lastName', 'role', 'avatar']
          }
        },
        {
          model: JobSeeker,
          as: 'jobSeeker',
          required: false,
        },
        {
          model: Company,
          as: 'Company',
          required: false,
        },
      ],
    });

    return { user };
  }

  static async deleteUser(id) {
    return User.destroy({ where: { id } });
  }

  static async banUserById(id) {
    return User.update({ banned: true }, { where: { id } });
  }

  static async unBanUserById(id) {
    return User.update({ banned: false }, { where: { id } });
  }

  static async getBannedUsers(params) {
    const {
      filter: { key = 'firstName', text = '' }, limit, offset, order, date: { from, to },
    } = params;

    const users = await User.findAndCountAll({
      offset,
      limit,
      subQuery: false,
      distinct: true,
      order: [[sequelize.literal(order)]],
      where: {
        [Op.or]: {
          '$Company.name$': { ilike: `%${text}%` },
          [`${key}`]: { ilike: `%${text}%` },
        },
        createdAt: {
          gte: from,
          lte: to
        },
        banned: true,
        role: {
          [Op.in]: [USER_ROLES.JOBSEEKER, USER_ROLES.COMPANY, USER_ROLES.COMPANY_USER]
        }
      },
      include: [
        {
          model: Reports,
          as: 'reports',
          attributes: ['reason'],
          include: {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName', 'role', 'email', 'avatar']
          }
        },
        {
          model: BlockedUsers,
          as: 'blocks',
          attributes: ['createdAt'],
          include: {
            model: User,
            as: 'blockedBy',
            attributes: ['firstName', 'lastName', 'role', 'email', 'avatar']
          }
        },
        {
          model: JobSeeker,
          as: 'jobSeeker',
          required: false,
        },
        {
          model: Company,
          as: 'Company',
          required: false,
        },
      ],
    });
    return { users };
  }

  static async getReportedUsers(params) {
    const {
      filter: { key = 'firstName', text = '' },
      limit,
      offset,
      order,
      date: { from, to },
    } = params;

    const users = await User.findAndCountAll({
      offset,
      limit,
      subQuery: false,
      distinct: true,
      order: [[sequelize.literal(order)]],
      where: {
        [Op.or]: {
          '$Company.name$': { ilike: `%${text}%` },
          [`${key}`]: { ilike: `%${text}%` },
        },
        createdAt: {
          gte: from,
          lte: to
        },
        banned: true,
        role: {
          [Op.in]: [USER_ROLES.JOBSEEKER, USER_ROLES.COMPANY, USER_ROLES.COMPANY_USER]
        }
      },
      include: [
        {
          model: Reports,
          as: 'reports',
          attributes: ['reason'],
          required: true,
          include: {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName', 'role', 'email','avatar']
          }
        },
        {
          model: BlockedUsers,
          as: 'blocks',
          attributes: ['createdAt'],
          include: {
            model: User,
            as: 'blockedBy',
            attributes: ['firstName', 'lastName', 'role', 'email', 'avatar']
          }
        },
        {
          model: JobSeeker,
          as: 'jobSeeker',
          required: false,
        },
        {
          model: Company,
          as: 'Company',
          required: false,
        },
      ],
    });
    return { users };
  }

  static async getBlockedUsers(params) {
    const {
      filter: { key = 'firstName', text = '' },
      limit,
      offset,
      order,
      date: { from, to },
    } = params;

    const users = await User.findAndCountAll({
      offset,
      limit,
      subQuery: false,
      distinct: true,
      order: [[sequelize.literal(order)]],
      where: {
        [Op.or]: {
          '$Company.name$': { ilike: `%${text}%` },
          [`${key}`]: { ilike: `%${text}%` },
        },
        createdAt: {
          gte: from,
          lte: to
        },
        banned: true,
        role: {
          [Op.in]: [USER_ROLES.JOBSEEKER, USER_ROLES.COMPANY, USER_ROLES.COMPANY_USER]
        }
      },
      include: [
        {
          model: BlockedUsers,
          as: 'blocks',
          required: true,
          attributes: ['createdAt'],
          include: {
            model: User,
            as: 'blockedBy',
            attributes: ['firstName', 'lastName', 'role', 'email', 'avatar']
          }
        },
        {
          model: Reports,
          as: 'reports',
          attributes: ['reason'],
          include: {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName', 'role', 'email', 'avatar']
          }
        },
        {
          model: JobSeeker,
          as: 'jobSeeker',
          required: false,
        },
        {
          model: Company,
          as: 'Company',
          required: false,
        },
      ],
    });
    return { users };
  }
}

module.exports = UserServices;
