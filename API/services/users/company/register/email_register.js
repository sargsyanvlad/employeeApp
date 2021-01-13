/* eslint-disable no-console */
const exceptions = require('../../../../../modules/exceptions/index');
const Security = require('../../../../../modules/br-auth-sdk/lib/Security');
const jwt = require('../../../../../utils/jwt');
const { mailerService } = require('../../../mailer');
const { generateToken } = require('../../../../../utils/helpers');
const { logger, errorLogger } = require('../../../../../utils/logger');

const {
  sequelize,
  User,
  Company,
  UserToken,
  ChatAuthTokens,
  ConfirmationTokens,
  UserNotificationSettings,
} = require('../../../../../data/models/index');
const { USER_ROLES, USER_PROVIDERS } = require('../../../../../utils/constants');


/**
 * @param {Object} data
 * @returns {Promise<{accessToken: *, type: string}>}
 */

module.exports = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    logger.info('=====> CompanyProfile  Login <=====');
    const {
      email,
      password,
      name,
      phone,
      avatar,
      description,
      type,
      benefits,
      location,
    } = data;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw new exceptions.InvalidUserInput({ message: 'Email Already Exists' });
    }
    const user = await User.create({
      role: USER_ROLES.COMPANY,
      email,
      password: Security.generatePasswordHash(password),
      confirmed: true, // fixme change to false, after tests
      completed: true,
      provider: USER_PROVIDERS.EMAIL,
    }, { returning: true, raw: true, transaction });

    const company = await Company.create({
      name,
      phone,
      description,
      companyLogo: avatar,
      userId: user.id,
      city: location ? location.city : null,
      country: location ? location.country : null,
      state: location ? location.state : null,
      latitude: location ? location.latitude : null,
      longitude: location ? location.longitude : null,
      jobPostingHave: 100000, // fixme set just for internal testes
    }, { raw: true, returning: true, transaction });

    // Note type.map() used to filter only ID-s, because frontEnd send array of Objects [{ name: 'test', id: 1 }]
    const typesArray = type.map(item => item.id);
    await company.setType(typesArray, { transaction });

    if (benefits && benefits.length) {
      await company.setBenefits(benefits, { transaction });
    }

    const accessToken = await jwt.generate({
      data: { _id: user.id, username: name },
    });

    await UserToken.create({
      token: accessToken,
      userId: user.id,
    }, { transaction });

    await UserNotificationSettings.create({ userId: user.id }, { transaction });

    const confirmationToken = await generateToken();
    await ConfirmationTokens.upsert({ confirmationToken, userId: user.id }, { transaction });

    const chatAuthToken = await generateToken({ stringBase: 'hex', byteLength: 65 });
    await ChatAuthTokens.create({ authToken: chatAuthToken, userId: user.id }, { transaction });

    mailerService.sendUserConfirmationEmail(email, confirmationToken);

    await transaction.commit();
    return { accessToken, type: 'company', chatAuthToken };
  } catch (err) {
    console.log(err);
    errorLogger.error('Transaction Rollback at Company Register');
    await transaction.rollback();
    throw err;
  }
};
