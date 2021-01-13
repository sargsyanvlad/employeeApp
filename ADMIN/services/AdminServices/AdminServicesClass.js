const jwt = require('../../../utils/jwt');
const exceptions = require('../../../modules/exceptions');

const { User, UserToken } = require('../../../data/models');

class AdminServices {
  static async login(email, password) {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      plain: true,
    });
    if (!user) throw new exceptions.InvalidUserInput({ message: 'Invalid User Credentials' });

    const validatedUser = user ? user.validatePassword(password) : false;
    if (!user || !validatedUser) {
      throw new exceptions.InvalidUserInput({ message: 'Invalid User Credentials' });
    }

    const accessToken = await jwt.generate({
      data: { _id: user.id },
    });

    await UserToken.create({
      userId: user.id,
      token: accessToken,
    }, { returning: true, raw: true });

    return {
      user,
      accessToken,
      type: user.role,
    };
  }
}

module.exports = AdminServices;
