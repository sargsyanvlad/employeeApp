/* eslint-disable camelcase */
const jwt = require('../../../../../utils/jwt');
const S3 = require('../../../../../modules/s3');
const { download } = require('../../../../../utils/donwload');
const { Facebook } = require('fb');
const { UserToken, User, sequelize } = require('../../../../../data/models/index');
const { appsConfig } = require('../../../../../config/index');
const { USER_PROVIDERS, USER_ROLES } = require('../../../../../utils/constants');
const { InvalidUserCredentials } = require('../../../../../modules/exceptions');

const { Op } = sequelize;

const fb = new Facebook({
  version: 'v3.2',
  appId: appsConfig.FB_CLIENT_ID,
  appSecret: appsConfig.FB_SECRET,
});
exports.getFacebookProfileData = async (id_token) => {
  const account = await fb.api(
    `/me?access_token=${id_token}&client_id=${appsConfig.FB_CLIENT_ID}&fields=id,first_name,last_name,email,picture.width(500).height(500)`,
    'GET',
  );
  if (!account) {
    throw new InvalidUserCredentials({ account });
  }
  return {
    providerId: account.id,
    firstName: account.first_name,
    lastName: account.last_name,
    avatar: account.picture.data.url,
    email: account.email,
  };
};

exports.facebookSignUp = async (id_token) => {
  const userFacebookProfile = await this.getFacebookProfileData(id_token);
  const {
    providerId, firstName, lastName, avatar, email,
  } = userFacebookProfile;

  let user = await User.findOne({
    where: {
      [Op.or]: {
        [Op.and]: {
          providerId,
          provider: USER_PROVIDERS.FACEBOOK,
        },
        email,
      },
    },
  });
  const tempImage = await download(avatar, providerId);
  const image = await S3.upload(tempImage);

  if (!user) {
    user = await User.create({
      role: USER_ROLES.JOBSEEKER,
      provider: USER_PROVIDERS.FACEBOOK,
      providerId,
      firstName,
      lastName,
      avatar: image.key,
      email,
      completed: false,
      confirmed: true, // fixme change to false, after tests
      verified: true,
    }, { returning: true, raw: true });
  } else {
    user.update({ avatar: image.key });
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
      type: USER_ROLES.JOBSEEKER,
      confirmed: user.confirmed,
      completed: user.completed,
    },
  };
};
