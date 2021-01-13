/* eslint-disable camelcase, consistent-return */
const jwt = require('../../../../../utils/jwt');
const { UserToken, User, sequelize } = require('../../../../../data/models/index');
const { USER_PROVIDERS } = require('../../../../../utils/constants');

const { Op } = sequelize;

module.exports = async (data) => {
  const { id, email, name: { firstName, lastName } } = data;

  let user = await User.findOne({
    where: {
      [Op.or]: {
        [Op.and]: {
          providerId: id,
          provider: USER_PROVIDERS.APPLE,
        },
        email,
      },
    },
  });

  if (!user) {
    user = await User.create({
      provider: USER_PROVIDERS.APPLE,
      providerId: id,
      role: 'jobSeeker',
      firstName,
      lastName,
      email,
      completed: false,
      confirmed: true, // fixme change to false, after tests
      verified: true,
    }, { returning: true, raw: true });
  }

  const accessToken = await jwt.generate({
    data: { _id: user.id },
  });

  await UserToken.create({
    userId: user.id,
    token: accessToken,
  });
  delete user.dataValues.password;
  return {
    success: true,
    result: {
      user,
      accessToken,
      type: 'jobSeeker',
      confirmed: user.confirmed,
      completed: user.completed,
    },
  };
};
