/* eslint-disable consistent-return, camelcase */
const fetch = require('node-fetch');
const jwt = require('../../../../../utils/jwt');
const S3 = require('../../../../../modules/s3');
const { download } = require('../../../../../utils/donwload');
const { InvalidUserCredentials } = require('../../../../../modules/exceptions');
const { USER_PROVIDERS } = require('../../../../../utils/constants');
const { UserToken, User, sequelize } = require('../../../../../data/models/index');

const { LINKEDIN_CLIENT_ID, LINKEDIN_SECRET } = process.env;

const { Op } = sequelize;

exports.getLinkedInProfileData = async (id_token) => {
  const getAccessToken = await fetch(`https://www.linkedin.com/oauth/v2/accessToken?client_id=${LINKEDIN_CLIENT_ID}&client_secret=${LINKEDIN_SECRET}&grant_type=authorization_code&redirect_uri=http://78afc727.ngrok.io/jobseeker&code=${id_token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const linkedInToken = await getAccessToken.json();
  const linkedInAccessToken = linkedInToken.access_token;

  let profileData = await fetch('https://api.linkedin.com/v2/me?projection=(id,localizedFirstName, localizedLastName,firstName,lastName,email,profilePicture(displayImage~:playableStreams))', {
    method: 'GET',
    headers: { Authorization: `Bearer ${linkedInAccessToken}` },
  });

  let emailData = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
    method: 'GET',
    headers: { Authorization: `Bearer ${linkedInAccessToken}` },
  });

  profileData = await profileData.json();
  emailData = await emailData.json();

  if (emailData.serviceErrorCode || profileData.serviceErrorCode) {
    throw new InvalidUserCredentials(emailData.message || profileData.message);
  }
  return {
    providerId: profileData.id,
    firstName: profileData.localizedFirstName,
    lastName: profileData.localizedLastName,
    email: emailData.elements[0]['handle~'].emailAddress,
    avatar: profileData.profilePicture['displayImage~'].elements[3].identifiers[0].identifier,
  };
};

exports.linkedinSignUp = async (accessToken) => {
  const userLinkedInProfile = await this.getLinkedInProfileData(accessToken);
  const {
    providerId, email, firstName, lastName, avatar,
  } = userLinkedInProfile;

  let user = await User.findOne({
    where: {
      [Op.or]: {
        [Op.and]: {
          providerId,
          provider: USER_PROVIDERS.LINKEDIN,
        },
        email,
      },
    },
  });

  if (!user) {
    const tempImage = await download(avatar, providerId);
    const image = await S3.upload(tempImage);
    user = await User.create({
      provider: USER_PROVIDERS.LINKEDIN,
      role: 'jobSeeker',
      providerId,
      firstName,
      lastName,
      avatar: image.key,
      email,
      completed: false,
      confirmed: true, // fixme change to false, after tests
      verified: true,
    }, { returning: true, raw: true });
  }

  const token = await jwt.generate({
    data: { _id: user.id },
  });

  await UserToken.create({
    userId: user.id,
    token,
  });

  return {
    success: true,
    result: {
      user,
      accessToken: token,
      type: 'jobSeeker',
      confirmed: user.confirmed,
      completed: user.completed,
    },
  };
};
