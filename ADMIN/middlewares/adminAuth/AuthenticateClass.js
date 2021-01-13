/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const errorDetails = require('../../../utils/errorDetails');
const config = require('../../../config');

const { User, UserToken } = require('../../../data/models');
const { AuthenticationError } = require('../../../modules/exceptions');

class AdminAuth {
  static async authenticate(ctx, next) {
    console.log(' ====> Authenticate As Admin <==== ');
    const token = await AdminAuth.getToken(ctx.request.headers);

    const verified = jwt.verify(token, config.secrets.jwt);
    if (!verified) throw new AuthenticationError(errorDetails.INVALID_TOKEN);

    const user = await User.findOne({
      where: { id: verified._id },
      raw: true,
    });

    if (!user) throw new AuthenticationError({ message: errorDetails.UNAUTHORIZED });
    if (user.role !== 'superAdmin') throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });

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

  static async getToken(headers) {
    if (!headers || !headers.authorization) {
      return null;
    }
    const parted = headers.authorization.split(' ');
    if (parted.length === 2 && parted[0] === 'Bearer') {
      return parted[1];
    }
    throw new AuthenticationError({ message: errorDetails.INVALID_TOKEN });
  }
}

module.exports = AdminAuth;
