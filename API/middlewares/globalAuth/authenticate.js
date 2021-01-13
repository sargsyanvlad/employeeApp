/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const errorDetails = require('../../../utils/errorDetails');
const { AuthenticationError, InvalidUserInput } = require('../../../modules/exceptions');
const {
  User, Company, JobSeeker, UserToken, ResetToken, ConfirmationTokens
} = require('../../../data/models');


class GlobalAuthClass {
  static async asNotConfirmedUser(ctx, next) {
    const token = await GlobalAuthClass.getToken(ctx.request.headers);

    const verified = jwt.verify(token, config.secrets.jwt);

    const existingToken = await UserToken.findOne({ where: { token } });

    if (!verified || !existingToken) throw new AuthenticationError({ message: errorDetails.INVALID_TOKEN });

    const user = await User.findOne({
      where: { id: verified._id },
      raw: true,
    });

    if (!user) throw new AuthenticationError({ message: errorDetails.UNAUTHORIZED });

    if (user.confirmed) {
      throw new InvalidUserInput({ message: 'You Have already confirmed you account' });
    }

    ctx.state.user = user;
    await next();
  }

  static async asContinueSignUp(ctx, next) {
    const token = await GlobalAuthClass.getToken(ctx.request.headers);

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

  static async authenticate(ctx) {
    console.log(' ====> authenticate');

    const token = await GlobalAuthClass.getToken(ctx.request.headers);
    const verified = jwt.verify(token, config.secrets.jwt);
    if (!verified) throw new AuthenticationError(errorDetails.INVALID_TOKEN);

    const user = await User.findOne({
      where: { id: verified._id },
      raw: true,
    });

    if (!user) throw new AuthenticationError({ message: errorDetails.UNAUTHORIZED });
    if (!user.confirmed) throw new AuthenticationError({ message: 'Confirm your Account before using it' });
    if (!user.completed) throw new InvalidUserInput({ message: 'Continue SignUp' });
    if (user.banned) throw new AuthenticationError({ message: 'You have been Banned By Admin' });

    const existingToken = await UserToken.findOne({
      where: {
        token,
      },
      raw: true,
    });

    if (existingToken) {
      const { username, _id } = verified;
      return { username, _id, token };
    }
    throw new AuthenticationError({ message: errorDetails.UNAUTHORIZED });
  }

  static async asUser(ctx, next) {
    const { _id, token } = await GlobalAuthClass.authenticate(ctx);
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
          model: Company,
          as: 'Company',
          raw: true,
        },
      ],
      plain: true,
    });
    ctx.state.user = user;
    ctx.state.token = token;
    if (user.role === 'company') {
      ctx.state.user.company = await Company.findOne({
        where: {
          userId: user.id,
        },
        raw: true,
      });
    }
    await next();
  }

  static async asResetToken(ctx, next) {
    const { resetToken } = ctx.request.body;
    const tokenExist = await ResetToken.findOne({ where: { resetToken } });
    if (!tokenExist) throw new AuthenticationError({ message: 'Incorrect ResetToken' });
    ctx.state.user = { id: tokenExist.userId };
    await tokenExist.destroy();
    await next();
  }

  static async asConfirmCode(ctx, next) {
    const { confirmationToken } = ctx.request.body;
    const tokenExist = await ConfirmationTokens.findOne({ where: { confirmationToken } });
    if (!tokenExist) throw new AuthenticationError({ message: 'Incorrect Confirmation Token' });
    ctx.state.user = { id: tokenExist.userId };
    await tokenExist.destroy();
    await next();
  }

  static async getToken(headers) {
    if (!headers || !headers.authorization) {
      throw new AuthenticationError({ message: errorDetails.UNAUTHORIZED });
    }

    const parted = headers.authorization.split(' ');
    if (parted.length === 2 && parted[0] === 'Bearer') {
      return parted[1];
    }
    throw new AuthenticationError({ message: errorDetails.INVALID_TOKEN });
  }
}

module.exports = GlobalAuthClass;
