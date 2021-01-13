/* eslint-disable no-console, camelcase */
const {
  User, UserDevices, ResetToken, Reports, ConfirmationTokens,
  JobSeeker, Company, BlockedUsers, UserToken, CompanyUsers
} = require('../../../../data/models');
const Zoho = require('node-zoho');
const jwt = require('../../../../utils/jwt');
const exceptions = require('../../../../modules/exceptions');
const Security = require('../../../../modules/br-auth-sdk/lib/Security');
const { errorLogger } = require('../../../../utils/logger');
const { generateToken } = require('../../../../utils/helpers');
// const { getLinkedInProfileData } = require('../../users/jobSeeker/register/linkedin_register');
// const { getFacebookProfileData } = require('../../../services/users/jobSeeker/register/fb_register');
const { USER_PROVIDERS } = require('../../../../utils/constants');
const { mailerService } = require('../../mailer');

const zoho = new Zoho({ authToken: process.env.ZOHOTOKEN });

const callback = async (err) => {
  if (err !== null) {
    console.log('zoho Callback Error ', err);
    return false;
  }
  return true;
};

const findUserByProviderOrEmail = async (id_token, provider = 'email', email) => {
  let user;
  switch (provider) {
    case USER_PROVIDERS.EMAIL: {
      user = await User.findOne({
        where: { email: email.toLowerCase() },
        plain: true,
      });
      break;
    }
    // case USER_PROVIDERS.FACEBOOK: {
    //   const userFacebookProfile = await getFacebookProfileData(id_token);
    //   const { providerId, email: fbEmail } = userFacebookProfile;
    //   user = await User.findOne({
    //     $or: {
    //       $and: {
    //         providerId,
    //         provider: USER_PROVIDERS.FACEBOOK,
    //       },
    //       email: fbEmail,
    //     },
    //   });
    //   break;
    // }
    // case USER_PROVIDERS.LINKEDIN: {
    //   const userLinkedInProfile = await getLinkedInProfileData(id_token);
    //   const { providerId, email: linkedInEmail } = userLinkedInProfile;
    //   user = await User.findOne({
    //     where: {
    //       $or: {
    //         $and: {
    //           providerId,
    //           provider: USER_PROVIDERS.LINKEDIN,
    //         },
    //         email: linkedInEmail,
    //       },
    //     },
    //   });
    //   break;
    // }
    // case USER_PROVIDERS.APPLE: {
    //   user = await User.findOne({
    //     where: {
    //       providerId: id_token,
    //       provider: USER_PROVIDERS.APPLE,
    //     },
    //   });
    //   break;
    // }
    default: throw new exceptions.InvalidUserInput({ message: 'Incorrect Provider' });
  }

  return user;
};

exports.getUserLocation = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    include: [
      {
        model: Company,
        as: 'Company',
        raw: true,
        attributes: ['latitude', 'longitude'],
      },
      {
        model: CompanyUsers,
        as: 'companyUser',
        include: {
          model: Company,
          as: 'company',
          attributes: ['latitude', 'longitude'],
        },
        raw: true,
      },
      {
        model: JobSeeker,
        as: 'jobSeeker',
        attributes: ['latitude', 'longitude'],
      }
    ]
  });

  if (!user) throw new exceptions.InvalidUserInput({ message: 'Incorrect User Id' });

  switch (user.role) {
    case 'jobSeeker': {
      return user.jobSeeker;
    }
    case 'company': {
      return user.Company;
    }
    case 'companyUser': {
      return user.companyUser.company;
    }
    default: throw new exceptions.InvalidUserInput({ message: 'Incorrect Role' });
  }
};

exports.checkEmail = async (email) => {
  const isExistingEmail = await User.findOne({
    where: { email },
    raw: true,
  });

  return {
    success: true,
    status: 200,
    result: {
      isExistingEmail: !!isExistingEmail,
    },
  };
};

exports.setCloudToken = async (userId, body) => {
  const { cloudToken } = body;
  let result;
  const existingDevice = await UserDevices.findOne({ where: { userId } });
  if (existingDevice) {
    result = await UserDevices.update({ cloudToken }, {
      where: {
        userId,
      },
    });
  } else {
    result = await UserDevices.create({ userId, ...body });
  }
  return {
    success: true,
    result,
  };
};

exports.changePassword = async (user, body, token) => {
  console.log('=====> changePassword <=====');
  const { password, oldPassword } = body;
  const existingUser = await User.findOne({
    where: {
      id: user.id,
    },
  });
  const validatedPassword = existingUser.validatePassword(oldPassword) || false;
  if (!validatedPassword) throw new exceptions.InvalidUserCredentials({ message: 'Invalid Password' });

  const hashedPassword = await Security.generatePasswordHash(password);

  const changed = await User.update({ password: hashedPassword }, {
    where: {
      id: user.id,
    },
  });


  if (!changed || !changed.length || !changed[0]) {
    throw new exceptions.SomethingWentWrong('Password Was Not Changed');
  }
  await UserToken.destroy({
    where: {
      userId: user.id,
      token: { ne: token }
    }
  });
  return {
    success: true,
  };
};

exports.forgotPassword = async (body) => {
  const { email } = body;
  const resetToken = await generateToken();
  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user) throw new exceptions.InvalidUserInput({ message: 'Incorrect Email' });

  await ResetToken.upsert({ resetToken, userId: user.id });
  mailerService.sendForgotPasswordEmail(email, resetToken);

  return {
    success: true,
  };
};

exports.resetPassword = async (userId, password) => {
  const hashedPassword = await Security.generatePasswordHash(password);
  const user = await User.update(
    { password: hashedPassword, confirmed: true },
    {
      where: { id: userId },
      returning: true,
      raw: true,
    },
  );

  if (user[0]) {
    return {
      success: true,
    };
  }
  throw new exceptions.SomethingWentWrong('Password Not Changed');
};

exports.deleteProfile = async (user, body) => {
  const { id } = user;
  const { reason } = body;
  const existingUser = await User.findOne({
    where: { id },
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
  });

  const records = [
    {
      'Lead Source': existingUser.role === 'company' ? 'Deleted Company' : 'Deleted JobSeeker',
      Phone: existingUser.role === 'company' ? existingUser.Company.phone || 1000000000 : existingUser.jobSeeker.phone || 1000000000,
      'First Name': existingUser.role === 'company' ? existingUser.Company.name : `${existingUser.jobSeeker.firstName}`,
      'Last Name': existingUser.role === 'company' ? existingUser.Company.name : `${existingUser.jobSeeker.lastName}`,
      Company: existingUser.role === 'company' ? existingUser.Company.name : 'NoName',
      Email: existingUser.email,
      Title: 'Deleted USer',
      Description: reason,
    },
  ];

  zoho.execute('crm', 'Leads', 'insertRecords', records, { wfTrigger: true }, callback);

  const deleted = await existingUser.destroy();

  if (deleted) {
    return {
      success: true,
    };
  }
  throw new exceptions.SomethingWentWrong('Cant Delete User Profile');
};

exports.setActiveStatus = async (user) => {
  const { id } = user;

  const existingUser = await User.findOne({
    where: { id },
  });

  await existingUser.update({ activeDate: Date.now() });

  return { success: true };
};


exports.reportUser = async (user, body) => {
  try {
    const { reason, reportingId } = body;
    let company;
    const existingUser = await User.findOne({
      where: { id: reportingId },
      include: [{
        model: JobSeeker,
        as: 'jobSeeker',
        raw: true,
      }],
    });

    if (!existingUser) throw new exceptions.InvalidUserCredentials({ message: 'Incorrect Reporting Id' });

    if (existingUser.role === 'company') {
      company = await Company.findOne({
        where: {
          userId: reportingId,
        },
        raw: true,
      });
    }

    const records = [
      {
        'Lead Source': 'Reported User',
        'First Name': existingUser.role === 'company' ? company.name : `${existingUser.jobSeeker.firstName}`,
        'Last Name': existingUser.role === 'company' ? company.name : `${existingUser.jobSeeker.lastName}`,
        Company: existingUser.role === 'company' ? company.name : 'NoName',
        Phone: existingUser.role === 'company' ? company.phone || 1000000000 : existingUser.jobSeeker.phone || 1000000000,
        Email: existingUser.email,
        Title: 'Reported User',
        Description: reason,
      },
    ];

    zoho.execute('crm', 'Leads', 'insertRecords', records, { wfTrigger: true }, callback);

    const reportCreated = await Reports.create({ reportingId, reporterId: user.id, reason });

    return { success: true, reportCreated };
  } catch (err) {
    errorLogger.error(err);
    throw err;
  }
};

exports.confirmAccount = async (user) => {
  await User.update({ confirmed: true }, { where: { id: user.id } });
  return { success: true };
};

exports.resendConfirmationEmail = async (email, user) => {
  const emailExists = await User.findOne({
    where: {
      email,
      id: {
        $ne: user.id,
      },
    },
  });

  if (emailExists) throw new exceptions.InvalidUserInput({ message: 'Already Existing Email' });

  await User.update({ email }, { where: { id: user.id } });
  const confirmationToken = await generateToken();
  await ConfirmationTokens.upsert({ confirmationToken, userId: user.id });
  mailerService.sendUserConfirmationEmail(email, confirmationToken);
  return { success: true };
};

exports.blockUser = async (user, blockedId) => {
  const existingUser = await User.findOne({
    where: { id: blockedId },
    include: [{
      model: JobSeeker,
      as: 'jobSeeker',
      raw: true,
    }],
  });

  if (!existingUser) throw new exceptions.InvalidUserCredentials({ message: 'Incorrect User Id' });

  const userBlocked = await BlockedUsers.create({ blockerId: user.id, blockedId });

  return { success: true, userBlocked };
};

exports.unBlockUser = async (user, blockedId) => {
  const existingUser = await BlockedUsers.findOne({
    where: { blockedId, blockerId: user.id },
  });

  if (!existingUser) throw new exceptions.InvalidUserCredentials({ message: 'Incorrect User Id' });

  BlockedUsers.destroy({ where: { blockerId: user.id, blockedId } });

  return { success: true };
};

exports.getBlockedUsers = async userId => User.findOne({
  attributes: ['id'],
  where: { id: userId },
  include: {
    model: User,
    as: 'blockedUsers',
    through: { attributes: [] },
    attributes: ['firstName', 'lastName', 'avatar', 'email', 'id', 'role'],
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
  },
});

exports.login = async (data) => {
  const {
    email, password, provider, id_token,
  } = data;

  const user = await findUserByProviderOrEmail(id_token, provider, email);
  if (!user) throw new exceptions.InvalidUserInput({ message: 'Invalid User Credentials' });

  const validatedUser = user ? user.validatePassword(password) : false;
  if (!user || !validatedUser) {
    throw new exceptions.InvalidUserInput({ message: 'Invalid User Credentials' });
  }

  const accessToken = await jwt.generate({
    data: { _id: user.id },
  });

  const userToken = await UserToken.create({
    userId: user.id,
    token: accessToken,
  }, { returning: true, raw: true });

  return {
    user,
    accessToken: userToken.token,
    type: user.role,
    confirmed: user.confirmed,
    completed: user.completed,
  };
};
