/* eslint-disable no-console */
const {
  Job,
  User,
  Skills,
  JobsMap,
  Industry,
  Interest,
  Education,
  JobSeeker,
  UserToken,
  Occupation,
  Employment,
  Requirement,
  UserProviders,
  ChatAuthTokens,
  FavoriteJobSeekers,
  ConfirmationTokens,
  EmploymentLocation,
  UserNotificationSettings,
  sequelize,
} = require('../../../../data/models/index');
const jwt = require('../../../../utils/jwt');
const exceptions = require('../../../../modules/exceptions/index');
const Security = require('../../../../modules/br-auth-sdk/lib/Security');
const educationService = require('./education');
const employmentService = require('./employment');

const { mailerService } = require('../../mailer');
const { USER_ROLES, USER_PROVIDERS } = require('../../../../utils/constants');

const { generateToken } = require('../../../../utils/helpers');


const getFavoriteJobSeekers = async (userId) => {
  let favorites = await FavoriteJobSeekers.findAll({
    where: { userId },
    attributes: ['jobSeekerId'],
    raw: true,
  });
  favorites = favorites.length ? favorites.map(item => item.jobSeekerId) : -1;
  return favorites;
};

exports.getJobSeeker = async (id) => {
  console.log('=====> getJobSeeker <=====');
  return User.findOne({
    where: { id },
    attributes: [
      'id',
      'email',
      'avatar',
      'verified',
      'confirmed',
      'firstName',
      'lastName',
      'activeDate'
    ],
    include: [
      {
        model: JobSeeker,
        as: 'jobSeeker',
        attributes: {
          exclude: ['userId', 'locationPoint'],
        },
        include: [
          {
            model: Education,
            as: 'Education',
            attributes: {
              exclude: ['userId', 'jobSeekerId', 'createdAt', 'updatedAt', 'location'],
            },
            plain: true,
          },
          {
            model: Industry,
            as: 'Industries',
            through: { attributes: [] },
            attributes: ['name', 'id'],
            plain: true,
          },
          {
            model: Interest,
            as: 'Interests',
            through: { attributes: [] },
            attributes: ['name', 'id'],
            plain: true,
          },
          {
            model: Employment,
            as: 'Employment',
            attributes: {
              exclude: ['userId', 'jobSeekerId', 'createdAt', 'updatedAt'],
            },
            include: [
              {
                model: EmploymentLocation,
                as: 'location',
                attributes: ['latitude', 'longitude', 'country', 'state', 'city'],
              },
            ],
            plain: true,
          },
          {
            model: Skills,
            as: 'skills',
            through: { attributes: [] },
            attributes: ['name', 'id'],
            plain: true,
          },
          {
            model: Occupation,
            as: 'occupations',
            through: { attributes: [] },
            attributes: ['name', 'id'],
            plain: true,
          },
        ],
        plain: true,
      },
      {
        model: UserNotificationSettings,
        as: 'notificationSettings',
        attributes: ['allowNotifications', 'allowNewMessages'],
        plain: true,
      },
    ],
    plain: true,
  });
};

exports.getJobSeekerById = async (requesterId, id, jobId) => {
  console.log('=====> getJobSeekerById <=====');
  let industries = -1;
  let interests = -1;
  let occupations = -1;
  let requirement;

  const jobSeeker = await JobSeeker.findOne({
    where: { id },
    raw: true,
    attributes: ['userId'],
  });

  if (jobId) {
    requirement = await Requirement.findOne({
      where: { jobId },
      include: [
        {
          model: Interest,
          as: 'interests',
          through: { attributes: [] },
          attributes: ['id'],
        },
        {
          model: Industry,
          as: 'industries',
          through: { attributes: [] },
          attributes: ['id'],
        },
        {
          model: Occupation,
          as: 'occupations',
          through: { attributes: [] },
          attributes: ['id'],
        },
      ],
      plain: true,
    });
    if (!requirement) throw new exceptions.SomethingWentWrong({ message: 'Incorrect jobId' });
    interests = requirement.interests.map(item => item.id);
    industries = requirement.industries.map(item => item.id);
    // fixme remove "if" statement after frontEnd implements Occupation feature
    if (requirement.occupations && requirement.occupations.length) {
      occupations = requirement.occupations.map(item => item.id);
    }
  }

  if (!jobSeeker) { throw new exceptions.InvalidUserInput({ message: 'Cant Find JobSeeker With Provided ID' }); }

  const favorites = await getFavoriteJobSeekers(requesterId);

  return User.findOne({
    where: { id: jobSeeker.userId },
    order: [
      [sequelize.literal('"jobSeeker.Interests.same" desc')],
      [sequelize.literal('"jobSeeker.Industries.same" desc')],
      [sequelize.literal('"jobSeeker.Education.id" desc')],
    ],
    include: [
      {
        model: JobSeeker,
        as: 'jobSeeker',
        attributes: {
          include: [[sequelize.literal(`(case when "jobSeeker"."id" in (${favorites}) then true else false end)`), 'favorite']],
          exclude: ['userId', 'locationPoint'],
        },
        include: [
          {
            model: Education,
            as: 'Education',
            order: [
              [sequelize.literal('"Education.id" asc')],
            ],
            attributes: {
              exclude: ['userId', 'jobSeekerId', 'createdAt', 'updatedAt', 'location'],
            },
            raw: true,
          },
          {
            model: Industry,
            as: 'Industries',
            through: { attributes: [] },
            attributes: ['id', 'name', [sequelize.literal(`(case when "jobSeeker->Industries"."id" in (${industries}) then true else false end)`), 'same']],
          },
          {
            model: Interest,
            as: 'Interests',
            through: { attributes: [] },
            attributes: ['name', 'id', [sequelize.literal(`(case when "jobSeeker->Interests"."id" in (${interests}) then true else false end)`), 'same']],
          },
          {
            model: Employment,
            as: 'Employment',
            attributes: { exclude: ['userId', 'jobSeekerId', 'createdAt', 'updatedAt'] },
            include: {
              model: EmploymentLocation,
              as: 'location',
              attributes: ['latitude', 'longitude', 'country', 'state', 'city'],
            },
            raw: true,
          },
          {
            model: Skills,
            as: 'skills',
            through: { attributes: [] },
            attributes: ['name', 'id'],
            plain: true,
          },
          {
            model: Occupation,
            as: 'occupations',
            through: { attributes: [] },
            attributes: ['name', 'id', [sequelize.literal(`(case when "jobSeeker->occupations"."id" in (${occupations}) then true else false end)`), 'same']],
            plain: true,
          },
        ],
        plain: true,
      },
    ],
  });
};

exports.updateJobSeeker = async (userId, data) => {
  console.log('=====> updateJobSeeker <=====');
  const transaction = await sequelize.transaction();
  try {
    const {
      firstName,
      lastName,
      email,
      avatar,
      about,
      gender,
      meta,
      phone,
      educations,
      employments,
      industries,
      interests,
      location: {
        latitude,
        longitude,
        city,
        state,
        country,
      },
      skills,
      occupations,
      notificationSettings,
    } = data;

    await User.update(
      {
        email,
        firstName,
        lastName,
        avatar
      },
      {
        where: {
          id: userId
        },
        transaction,
        returning: true,
      }
    );

    await UserProviders.update({ provider: USER_PROVIDERS.EMAIL, providerId: email }, { where: { userId }, transaction },);

    const locationPoint = sequelize.literal(`ST_GeomFromText('POINT(${longitude} ${latitude})')`);
    const jobSeeker = await JobSeeker.update(
      {
        gender,
        phone,
        meta,
        about,
        latitude,
        longitude,
        city,
        state,
        country,
        locationPoint,
      },
      {
        where: { userId },
        returning: true,
        plain: true,
        transaction,
      },
    );

    const jobSeekerId = jobSeeker[1].id;

    if (skills && skills.length) {
      await jobSeeker[1].setSkills(skills, { transaction });
    }

    if (occupations && occupations.length) {
      await jobSeeker[1].setOccupations(occupations, { transaction });
    }


    if (employments && employments.length) {
      await employmentService.createOrUpdate({ employments, jobSeekerId }, userId, transaction);
    }
    await educationService.createOrUpdate({ educations, jobSeekerId }, userId, transaction);

    // fixme this part Should be removed Note from here
    if (interests && interests.length) {
      const interestsArr = interests.map(item => item.id);
      await jobSeeker[1].setInterests(interestsArr, { transaction });
    }

    if (industries && industries.length) {
      const industriesArr = industries.map(item => item.id);
      await jobSeeker[1].setIndustries(industriesArr, { transaction });
    }
    // fixme this part Should be removed Note to here

    if (notificationSettings) {
      await UserNotificationSettings.update({ ...notificationSettings }, { where: { userId } });
    }

    await transaction.commit();
    return {
      result: {
        success: true,
      },
    };
  } catch (err) {
    console.log('error', err);
    await transaction.rollback();
    throw err;
  }
};

exports.getSwipes = async (user) => {
  const jobs = await JobsMap.findAndCountAll({
    order: [['updatedAt', 'DESC']],
    where: {
      jobSeekerId: user.jobSeeker.id,
      appliedByCompany: true,
      declinedByJobSeeker: false,
      appliedByJobSeeker: false,
    },
    attributes: [],
    include: [
      {
        model: Job,
        as: 'job',
        attributes: ['id', 'title', 'companyLogo', 'companyName', 'companyId', 'type', 'description'],
      },
      {
        model: User,
        as: 'user',
        attributes: ['email', 'avatar', 'activeDate'],
      }
    ],
  });

  return {
    success: true,
    result: {
      jobs: jobs.rows,
      total: jobs.count
    },
  };
};


exports.markJobSeekerAsFavorite = async (user, jobSeekerId) => {
  const exists = await JobSeeker.findOne({
    where: {
      id: jobSeekerId,
    },
  });
  if (!exists) throw new exceptions.InvalidUserInput({ message: 'Incorrect JobSeeker Id' });
  await FavoriteJobSeekers.upsert({ userId: user.id, jobSeekerId });
  return { success: true };
};

exports.unMarkJobSeekerAsFavorite = async (user, jobSeekerId) => {
  const exists = await JobSeeker.findOne({
    where: {
      id: jobSeekerId,
    },
  });
  if (!exists) throw new exceptions.InvalidUserInput({ message: 'Incorrect JobSeeker Id' });
  await FavoriteJobSeekers.destroy({
    where: {
      userId: user.id,
      jobSeekerId: parseInt(jobSeekerId, 0),
    },
  });
  return { success: true };
};

exports.signUp = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      email, firstName, lastName, password, avatar,
    } = data;
    const existingUser = await User.findOne({
      where: {
        email: data.email,
        completed: true,
      },
    });

    if (existingUser) {
      throw new exceptions.InvalidUserInput({ message: 'Email Already Exists' });
    }

    const user = await User.upsert({
      email,
      lastName,
      firstName,
      avatar,
      provider: USER_PROVIDERS.EMAIL,
      password: Security.generatePasswordHash(password),
      role: USER_ROLES.JOBSEEKER,
      confirmed: true, // fixme change to false, after tests
      completed: false,
    }, { raw: true, returning: true, transaction });

    await UserProviders.create({ userId: user[0].id, provider: USER_PROVIDERS.EMAIL, providerId: email }, { transaction });

    const accessToken = await jwt.generate({ data: { _id: user[0].id, username: data.firstName } });
    await UserToken.create({ token: accessToken, userId: user[0].id }, { transaction });

    await transaction.commit();
    return {
      success: true,
      result: {
        user: user[0],
        accessToken,
        confirmed: false,
        completed: false,
        type: USER_ROLES.JOBSEEKER,
      },
    };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.continueSignUp = async (user, data) => {
  const transaction = await sequelize.transaction();
  try {
    console.log('====> continueSignUp <====');
    const {
      phone,
      description,
      gender,
      provider,
      educations,
      employments,
      industries,
      interests,
      facebookId,
      linkedInId,
      appleId,
      docs,
      about,
      location: {
        latitude,
        longitude,
        city,
        state,
        country,
      },
      skills,
      occupations,
    } = data;


    const locationPoint = sequelize.literal(`ST_GeomFromText('POINT(${longitude} ${latitude})')`);
    const jobSeeker = await JobSeeker.create({
      provider,
      phone,
      description,
      gender,
      facebookId,
      linkedInId,
      appleId,
      userId: user.id,
      docs,
      about,
      latitude,
      longitude,
      city,
      country,
      state: state || null,
      locationPoint,
    }, { returning: true, raw: true, transaction });

    // fixme if Statement should be removed when we will be sure that there is no old versions apps
    if (skills && skills.length) {
      await jobSeeker.setSkills(skills, { transaction });
    }
    // fixme if Statement should be removed when we will be sure that there is no old versions apps
    if (occupations && occupations.length) {
      await jobSeeker.setOccupations(occupations, { transaction });
    }

    const userId = user.id;
    if (employments && employments.length) {
      await employmentService.createOrUpdate({ employments, jobSeekerId: jobSeeker.id }, userId, transaction);
    }

    await educationService.createOrUpdate({ educations, jobSeekerId: jobSeeker.id }, userId, transaction);

    // fixme this part Should be removed Note from here
    if (interests && interests.length) {
      const interestsArr = interests.map(item => item.id);
      await jobSeeker.setInterests(interestsArr, { transaction });
    }

    if (industries && industries.length) {
      const industriesArr = industries.map(item => item.id);
      await jobSeeker.setIndustries(industriesArr, { transaction });
    }
    // fixme this part Should be removed Note to here


    const accessToken = await jwt.generate({ data: { _id: user.id, username: data.firstName } });
    await UserToken.destroy({ where: { userId: user.id } }, { transaction });
    await UserToken.create({ token: accessToken, userId: user.id }, { transaction });

    await UserNotificationSettings.create({ userId: user.id }, { transaction });

    const confirmationToken = await generateToken();
    await ConfirmationTokens.upsert({ confirmationToken, userId: user.id }, { transaction });

    const chatAuthToken = await generateToken({ stringBase: 'hex', byteLength: 65 });
    await ChatAuthTokens.create({ authToken: chatAuthToken, userId: user.id }, { transaction });

    await user.update({ completed: true });

    mailerService.sendUserConfirmationEmail(user.email, confirmationToken);

    await transaction.commit();
    return {
      accessToken,
      chatAuthToken,
      type: 'jobSeeker',
      completed: true,
    };
  } catch (err) {
    console.log('err', err);
    console.log('Transaction Rolled back');
    await transaction.rollback();
    throw err;
  }
};
