/* eslint-disable no-console */
const { UserToken, User, ChatAuthTokens } = require('../../../../data/models/index');
const jwt = require('../../../../utils/jwt');
const exceptions = require('../../../../modules/exceptions/index');
const { generateToken } = require('../../../../utils/helpers');

module.exports = async (data) => {
  console.log('=====> login <=====');
  const { email, password } = data;
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  let chat = null;
  const validatedUser = user ? user.validatePassword(password) : false;

  if (user && validatedUser) {
    const accessToken = await jwt.generate({
      data: { _id: user.id },
    });

    const userToken = await UserToken.create({
      userId: user.id,
      token: accessToken,
    }, { returning: true, raw: true });

    if (!userToken) {
      throw new exceptions.SomethingWentWrong({ message: 'Can\'t Generate Token' });
    }

    chat = await ChatAuthTokens.findOne({ attributes: ['authToken'], where: { userId: user.id }, raw: true });

    if (!chat) {
      const authToken = await generateToken({ stringBase: 'hex', byteLength: 65 });
      chat = await ChatAuthTokens.create(
        { authToken, userId: user.id },
        { raw: true, returning: true },
      );
    }

    return {
      accessToken: userToken.token,
      chatToken: chat.authToken,
      type: user.role,
      confirmed: user.confirmed,
    };
  }
  throw new exceptions.InvalidUserCredentials({ message: 'Invalid User Credentials' });
};

