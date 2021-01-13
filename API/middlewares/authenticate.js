/* eslint-disable no-underscore-dangle, no-console */
// fixme This Module not used anymore, just left there for check compatibilities with old versions
const jwt = require('jsonwebtoken');
const {
  User, Company, JobSeeker, UserToken, ResetToken, Packages, ConfirmationTokens,
  CompanyUsers,
} = require('../../data/models');
const { AuthenticationError, InvalidUserInput } = require('../../modules/exceptions');
const errorDetails = require('../../utils/errorDetails');
const { logger } = require('../../utils/logger');
const config = require('../../config');

class AuthenticatorClass {
  static async asContinueSignUp(ctx, next) {
    logger.info('=====> asContinueSignUp <=====');
    const token = await AuthenticatorClass.getToken(ctx.request.headers);

    const verified = jwt.verify(token, config.secrets.jwt);
    if (!verified) throw new AuthenticationError({ message: errorDetails.INVALID_TOKEN });

    const user = await User.findOne({
      where: {
        id: verified._id,
        completed: false,
      },
    });

    if (!user) throw new AuthenticationError({ message: errorDetails.UNAUTHORIZED });

    ctx.state.user = user;
    await next();
  }

  static async asNotConfirmed(ctx, next) {
    logger.info('=====> asNotConfirmed <=====');
    const token = await AuthenticatorClass.getToken(ctx.request.headers);

    const verified = jwt.verify(token, config.secrets.jwt);
    if (!verified) throw new AuthenticationError({ message: errorDetails.INVALID_TOKEN });

    const user = await User.findOne({
      where: {
        id: verified._id,
        confirmed: false,
      },
      raw: true,
    });

    if (!user) throw new AuthenticationError({ message: errorDetails.UNAUTHORIZED });

    const existingToken = await UserToken.findOne({
      where: { token },
      raw: true,
    });

    if (existingToken) {
      ctx.state.user = user;
      await next();
    } else {
      throw new AuthenticationError({ message: errorDetails.UNAUTHORIZED });
    }
  }

  static async authenticate(ctx) {
    try {
      logger.info('=====> authenticate <=====');
      const token = await AuthenticatorClass.getToken(ctx.request.headers);

      const verified = jwt.verify(token, config.secrets.jwt);
      if (!verified) throw new AuthenticationError(errorDetails.INVALID_TOKEN);

      const user = await User.findOne({
        where: { id: verified._id },
        raw: true,
      });

      if (!user) throw new AuthenticationError({ message: errorDetails.UNAUTHORIZED });
      if (!user.confirmed) throw new AuthenticationError({ message: 'Confirm your Account before using it' });
      if (!user.completed) throw new InvalidUserInput({ message: 'Continue SignUp' });

      const existingToken = await UserToken.findOne({
        where: {
          token,
        },
        raw: true,
      });

      if (existingToken) {
        const { username, _id } = verified;
        return { username, _id };
      }
      throw new AuthenticationError({ message: errorDetails.UNAUTHORIZED });
    } catch (err) {
      console.log('err', err.message);
      console.log('err', err);
      if (err.message === 'jwt expired') {
        throw new AuthenticationError({ message: 'Token Expired' });
      } else if (err.message === 'invalid signature') {
        throw new AuthenticationError({ message: 'Invalid Token' });
      }
      throw err;
    }
  }

  static async asUser(ctx, next) {
    logger.info('=====> asUser <=====');
    const { _id } = await AuthenticatorClass.authenticate(ctx);
    ctx.state.user = await User.findOne({
      where: { id: _id },
      attributes: [
        'id',
        'role',
        'email',
        'avatar',
      ],
      include: [
        {
          model: JobSeeker,
          as: 'jobSeeker',
          raw: true,
        },
        {
          model: Company,
          as: 'Company',
          raw: true,
        },
      ],
      plain: true,
    });
    await next();
  }

  static async asResetToken(ctx, next) {
    try {
      logger.info('=====> asResetToken <=====');
      const { resetToken } = ctx.request.body;
      const tokenExist = await ResetToken.findOne({ where: { resetToken } });
      if (!tokenExist) throw new AuthenticationError({ message: 'Incorrect ResetToken' });
      ctx.state.user = { id: tokenExist.userId };
      await tokenExist.destroy();
      await next();
    } catch (err) {
      throw err;
    }
  }

  static async asConfirmCode(ctx, next) {
    try {
      logger.info('=====> asConfirmCode <=====');
      const { confirmationToken } = ctx.request.body;
      const tokenExist = await ConfirmationTokens.findOne({ where: { confirmationToken } });
      if (!tokenExist) throw new AuthenticationError({ message: 'Incorrect Confirmation Token' });
      ctx.state.user = { id: tokenExist.userId };
      await tokenExist.destroy();
      await next();
    } catch (err) {
      throw err;
    }
  }

  static async asCompanyUser(ctx, next) {
    try {
      logger.info('=====> asCompanyUserData <=====');
      const { _id } = await AuthenticatorClass.authenticate(ctx);
      const user = await User.findOne({
        where: { id: _id },
        attributes: [
          'id',
          'role',
          'email',
          'avatar',
        ],
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

      ctx.state.user = user;
      ctx.state.user.company = company;
      await next();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async hasJobSeekerPremiumAccess(ctx, next) {
    try {
      logger.info('====> hasJobSeekerPremiumAccess <=====');
      // Note Should Be implemented logic to validation
      // Note is user has Premium Access or not
      const { _id } = await AuthenticatorClass.authenticate(ctx);
      const user = await User.findOne({
        where: { id: _id },
        include: [
          {
            model: JobSeeker,
            as: 'jobSeeker',
            plain: true,
          },
        ],
        plain: true,
      });

      if (!user || user.role !== 'jobSeeker' || !user.jobSeeker) {
        throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });
      }

      ctx.state.user = user;
      await next();
    } catch (err) {
      throw err;
    }
  }

  static async hasCompanyPremiumAccess(ctx, next) {
    try {
      logger.info('====> hasCompanyPremiumAccess <=====');
      // Note Should Be implemented logic to validation
      // Note is CompanyUser has Premium Access or not
      const { _id } = await AuthenticatorClass.authenticate(ctx);
      const user = await User.findOne({
        where: { id: _id },
        raw: true,
      });
      if (!user || user.role !== 'company') {
        throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });
      }
      ctx.state.user = user;
      await next();
    } catch (err) {
      throw err;
    }
  }

  static async asJobSeeker(ctx, next) {
    try {
      logger.info('=====> asJobSeeker <=====');
      const { _id } = await AuthenticatorClass.authenticate(ctx);
      const user = await User.findOne({
        where: { id: _id },
        attributes: [
          'id',
          'role',
          'email',
          'avatar',
        ],
        include: [
          {
            model: JobSeeker,
            as: 'jobSeeker',
            plain: true,
          },
        ],
        plain: true,
      });
      if (!user || user.role !== 'jobSeeker' || !user.jobSeeker) {
        throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });
      }
      ctx.state.user = user;
      await next();
    } catch (err) {
      throw err;
    }
  }

  static async hasSwipeAccess(ctx, next) {
    try {
      logger.info('=====> hasSwipeAccess <=====');
      const { _id } = await AuthenticatorClass.authenticate(ctx);

      const user = await User.findOne({
        where: { id: _id },
        attributes: [
          'id',
          'role',
          'email',
          'avatar',
        ],
        include: [
          {
            model: JobSeeker,
            as: 'jobSeeker',
            plain: true,
          },
          {
            model: Packages,
            as: 'packages',
            required: false,
            where: {
              '$packages->UserPackages.validThru$': { $gte: new Date() },
              name: 'SwipedOnMe',
            },
            through: { attributes: [] },
          },
        ],
        plain: true,
      });

      if (!user.packages || !user.packages.length) {
        throw new AuthenticationError({ message: 'You haven\'t Active Package' });
      }
      ctx.state.user = user;
      await next();
    } catch (err) {
      throw err;
    }
  }

  static async getToken(headers) {
    logger.info('getToken');
    if (!headers || !headers.authorization) {
      return null;
    }
    const parted = headers.authorization.split(' ');
    if (parted.length === 2 && parted[0] === 'Bearer') {
      return parted[1];
    }
    return null;
  }
}

module.exports = AuthenticatorClass;
