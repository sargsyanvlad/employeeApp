/* eslint-disable no-underscore-dangle, no-console */
const {
  User, Company, CompanyPackages, CompanyUsers
} = require('../../../data/models');
const errorDetails = require('../../../utils/errorDetails');
const { globalAuth } = require('../globalAuth');
const { AuthenticationError, SomethingWentWrong } = require('../../../modules/exceptions');

class CompanyAuthClass {
  static async asCompanyUser(ctx, next) {
    try {
      console.log('=====> asCompanyUserData <=====');
      const { _id } = await globalAuth.authenticate(ctx);
      const user = await User.findOne({
        where: { id: _id },
        attributes: [
          'id',
          'role',
          'email',
          'avatar',
        ],
        raw: true,
        include: {
          model: CompanyUsers,
          as: 'companyUser',
        },
        plain: true,
      });

      const company = await Company.findOne({
        where: {
          $or: {
            id: user.companyUser ? user.companyUser.companyId : -1,
            userId: user.id,
          },
        },
        raw: true,
      });

      if (!user || !company || !(user.role !== 'company' || user.role !== 'companyUser')) {
        throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });
      }

      const packages = await CompanyPackages.findAll({
        attributes: ['PackageId'],
        where: {
          userId: user.id,
          companyId: company.id,
          exhausted: false,
          validThru: { $gte: new Date() },
        },
        raw: true,
      });

      ctx.state.user = user;
      ctx.state.user.company = company;
      ctx.state.user.company.packages = packages.map(item => item.PackageId);
      await next();
    } catch (err) {
      throw err;
    }
  }

  static async isPremiumOrUpgraded(ctx, next) {
    console.log('=====> isPremiumOrUpgraded <=====');
    const { _id } = await globalAuth.authenticate(ctx);

    const user = await User.findOne({
      where: { id: _id },
      attributes: [
        'id',
        'role',
        'email',
        'avatar',
      ],
      raw: true,
    });

    const company = await Company.findOne({
      where: {
        userId: user.id,
      },
      raw: true,
    });


    if (!company) throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });

    const packages = await CompanyPackages.findAll({
      attributes: ['PackageId'],
      where: {
        userId: user.id,
        companyId: company.id,
        PackageId: {
          $or: [5, 4],
        },
        exhausted: false,
        validThru: { $gte: new Date() },
      },
      raw: true,
    });

    // fixme uncomment after tests
    // if (!packages.length) {
    //   throw new SomethingWentWrong({ message: 'You Have Not Any active packages' });
    // }

    if (!user || user.role !== 'company' || !company) {
      throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });
    }

    ctx.state.user = user;
    ctx.state.user.company = company;
    ctx.state.user.company.packages = packages.map(item => item.PackageId);
    await next();
  }

  static async jobCreateAccess(ctx, next) {
    try {
      console.log('=====> jobCreateAccess <=====');
      const { _id } = await globalAuth.authenticate(ctx);
      const user = await User.findOne({
        where: { id: _id },
        attributes: [
          'id',
          'role',
          'email',
          'avatar',
        ],
        raw: true,
      });

      const company = await Company.findOne({
        where: {
          userId: user.id,
        },
        plain: true,
      });

      if (!user || user.role !== 'company' || !company) {
        throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });
      }

      if (company.jobsCreated >= company.jobPostingHave) {
        throw new SomethingWentWrong({ message: 'You Have Reached Your JobPosting Limit' });
      }

      ctx.state.user = user;
      ctx.state.user.company = company;
      await next();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = CompanyAuthClass;
