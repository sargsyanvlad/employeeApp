/* eslint-disable no-console, prefer-destructuring */
const {
  Job,
  User,
  Skills,
  Benefit,
  Company,
  JobsMap,
  Interest,
  Industry,
  Education,
  JobSeeker,
  Employment,
  Occupation,
  Requirement,
  UserPackages,
  FavoriteJobs,
  FavoriteJobSeekers,
  sequelize,
} = require('../../../data/models/index');

const exceptions = require('../../../modules/exceptions');
const moment = require('moment');
const { DEGREE_WEIGHTS } = require('../../../utils/constants');
const { notificationService } = require('../notifications/index');
const { logger } = require('../../../utils/logger');

const { Op } = sequelize;

const getFavoriteJobs = async (userId) => {
  let favorites = await FavoriteJobs.findAll({
    where: { userId },
    attributes: ['jobId'],
    raw: true,
  });
  favorites = favorites.length ? favorites.map(item => item.jobId) : -1;
  return favorites;
};

const getFavoriteJobSeekers = async (userId) => {
  let favorites = await FavoriteJobSeekers.findAll({
    where: { userId },
    attributes: ['jobSeekerId'],
    raw: true,
  });
  favorites = favorites.length ? favorites.map(item => item.jobSeekerId) : -1;
  return favorites;
};

const getBoostedJobSeekers = async () => {
  let result = await UserPackages.findAll({
    where: {
      PackageId: 2,
      validThru: { [Op.gte]: new Date() },
    },
    attributes: ['jobSeekerId'],
    raw: true,
  });
  result = result.length ? result.map(item => item.jobSeekerId) : -1;
  return result;
};

const getJobRequirement = async (jobId) => {
  const requirement = await Requirement.findOne({
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

  requirement.interests = requirement.interests.map(item => item.id);
  requirement.industries = requirement.industries.map(item => item.id);

  if (requirement.occupations && requirement.occupations.length) {
    requirement.occupations = requirement.occupations.map(item => item.id);
  } else {
    // fixme if{} else {} should be removed when frontEnd implement Occupation feature
    requirement.occupations = -1;
  }

  requirement.duration *= 365;
  return requirement;
};

const getJobSeekersMatchedByEmployment = async (requirement) => {
  const date = moment().format('YYYY-MM-DD');

  const groupedByDuration = await Employment.findAll({
    where: {
      jobTitle: requirement.position,
    },
    attributes: ['jobSeekerId', 'jobTitle', [sequelize.literal(`SUM(case when present then '${date}'::date - "startDate"::date else "endDate"::date-"startDate"::date end)`), 'jobDuration']],
    group: ['Employment.jobSeekerId', 'Employment.jobTitle'],
    having: {
      [Op.and]: [
        sequelize.where(sequelize.literal(`SUM(case when present then '${date}'::date - "startDate"::date else "endDate"::date-"startDate"::date end)::integer`), 'jobDuration', { $gte: requirement.duration }),
      ],
    },
  });
  return groupedByDuration.length ? groupedByDuration.map(item => item.jobSeekerId) : false;
};

const getAlreadySwipedJobSeekers = async (userId, jobId) => {
  let result = await JobsMap.findAll({
    attributes: ['jobSeekerId'],
    where: {
      jobId,
      userId,
      [Op.or]: {
        declinedByCompany: true,
        appliedByCompany: true,
      },
    },
    raw: true,
  });
  result = result.length ? result.map(item => item.jobSeekerId) : -1;
  return result;
};

const getAlreadyReactedJobs = async (jobSeekerId) => {
  let result = await JobsMap.findAll({
    attributes: ['jobId'],
    where: {
      jobSeekerId,
      [Op.or]: {
        declinedByJobSeeker: true,
        appliedByJobSeeker: true,
      },
    },
    raw: true,
  });
  result = result.length ? result.map(item => item.jobId) : -1;
  return result;
};

const buildWhereQuery = async (matchedByEmployment, alreadySwipedJobSeekersIds, requirement, blockedUsers) => {
  const jobSeekerWhere = {
    id: {
      [Op.notIn]: alreadySwipedJobSeekersIds
    },
  };

  const where = {
    id: { [Op.notIn]: blockedUsers.length ? blockedUsers : -1 },
  };

  if (matchedByEmployment) {
    where[Op.or] = [
      { '$jobSeeker->Industries.id$': { [Op.in]: requirement.industries } },
      { '$jobSeeker->Interests.id$': { [Op.in]: requirement.interests } },
      { '$jobSeeker->occupations.id$': { [Op.in]: requirement.occupations } },
    ];
    where['$jobSeeker->Education.weight$'] = { [Op.gte]: DEGREE_WEIGHTS[requirement.educationLevel] };
    where['$jobSeeker->Employment.jobTitle$'] = requirement.position;
    jobSeekerWhere.id = {
      [Op.in]: matchedByEmployment,
      [Op.notIn]: alreadySwipedJobSeekersIds,
    };
  }
  return { jobSeekerWhere, where };
};

exports.createJob = async (user, data) => {
  console.log('=====> createJob <=====');
  const transaction = await sequelize.transaction();
  try {
    const userId = user.id;
    const {
      title,
      type,
      salary,
      description,
      location: {
        city,
        state,
        country,
        latitude,
        longitude
      },
      requirements: {
        industries,
        interests,
        generalRequirement,
        educationLevel,
        position,
        duration,
        maxDistance,
        occupations,
      },
    } = data;

    const company = await Company.findOne({
      where: { userId },
      attributes: ['name', 'companyLogo', 'id', 'jobsCreated', 'jobPostingHave'],
      raw: true,
    });

    const { id: companyId, companyLogo, name: companyName } = company;

    if (company.jobsCreated < company.jobPostingHave) {
      const location = sequelize.literal(`ST_GeomFromText('POINT(${data.location.longitude} ${data.location.latitude})')`);

      const createdJob = await Job.create({
        title: title.toLowerCase(),
        type,
        salary,
        description,
        userId,
        companyId,
        companyLogo,
        companyName,
      }, { returning: true, raw: true, transaction });

      const requirementObject = {
        city,
        state,
        country,
        generalRequirement,
        educationLevel,
        position,
        duration,
        jobId: createdJob.id,
        location,
        latitude,
        longitude,
        maxDistance,
      };

      const requirement = await Requirement.create(
        requirementObject,
        { transaction, returning: true, raw: true },
      );

      await Job.update(
        { requirementId: requirement.id },
        { where: { id: createdJob.id }, transaction },
      );

      // Note .map() method used to filter IDs because frontEnd sends array of objects [{ name: 'test', id:1 }]
      const industriesArr = industries.map(item => item.id);
      const interestsArr = interests.map(item => item.id);

      await requirement.setIndustries(industriesArr, { transaction });
      await requirement.setInterests(interestsArr, { transaction });

      if (occupations && occupations.length) {
        requirement.setOccupations(occupations, { transaction });
      }

      await Company.increment('jobsCreated', { where: { id: company.id } }, transaction);
      await transaction.commit();
      return { success: true };
    }
    throw new exceptions.SomethingWentWrong({ message: 'You Have Reached You JobPosting Limit' });
  } catch (err) {
    console.log('Transaction RollBack');
    await transaction.rollback();
    throw err;
  }
};

exports.getJobById = async (user, id, location = { latitude: '0.000000', longitude: '0.000000' }) => {
  console.log('=====> get JOB ById <=====');
  let industries = -1;
  let interests = -1;
  let occupations = -1;
  const favorites = await getFavoriteJobs(user.id);
  const {
    latitude = '0.000000',
    longitude = '0.000000',
  } = location;

  if (user.role === 'jobSeeker') {
    const jobSeeker = await JobSeeker.findOne({
      where: {
        id: user.jobSeeker.id,
      },
      include: [
        {
          model: Industry,
          as: 'Industries',
          through: { attributes: [] },
          attributes: ['id'],
          raw: true,
        },
        {
          model: Interest,
          as: 'Interests',
          through: { attributes: [] },
          attributes: ['id'],
          raw: true,
        },
        {
          model: Occupation,
          as: 'occupations',
          through: { attributes: [] },
          attributes: ['id'],
          raw: true,
        },
      ],
      plain: true,
    });

    industries = jobSeeker.Industries.map(item => item.id);
    interests = jobSeeker.Interests.map(item => item.id);
    occupations = jobSeeker.occupations.map(item => item.id);
  }

  const job = await Job.findOne({
    where: { id },
    plain: true,
    order: [
      [sequelize.literal('"Requirement.interests.same" desc')],
      [sequelize.literal('"Requirement.industries.same" desc')],
    ],
    attributes: {
      include: [[sequelize.literal(`(case when "Job"."id" in (${favorites}) then true else false end)`), 'favorite']],
    },
    include: [
      {
        model: Requirement,
        as: 'Requirement',
        attributes: {
          exclude: ['location', 'jobId'],
          include: [[sequelize.literal(`ST_Distance_Sphere(location, ST_GeomFromText('POINT(${longitude} ${latitude})'))/1000/1.609344`), 'JobDistance']],
        },
        include: [
          {
            model: Interest,
            as: 'interests',
            order: [
              [sequelize.literal('"interests.same" desc')],
            ],
            through: { attributes: [] },
            attributes: ['name', 'id', [sequelize.literal(`(case when "Requirement->interests"."id" in (${interests.length ? interests : 1}) then true else false end)`), 'same']],
          },
          {
            model: Industry,
            as: 'industries',
            through: { attributes: [] },
            order: [
              [sequelize.literal('"industries.same" desc')],
            ],
            attributes: ['name', 'id', [sequelize.literal(`(case when "Requirement->industries"."id" in (${industries.length ? industries : 1}) then true else false end)`), 'same']],
          },
          {
            model: Occupation,
            as: 'occupations',
            through: { attributes: [] },
            attributes: ['name', 'id', [sequelize.literal(`(case when "Requirement->occupations"."id" in (${occupations.length ? occupations : -1}) then true else false end)`), 'same']],
            plain: true,
          },
        ],
        raw: true,
      },
    ],
  });

  if (!job) throw new exceptions.InvalidUserInput({ message: 'Incorrect Job Id' });

  const company = await Company.findOne({
    where: { id: job.companyId },
    include: [
      {
        model: Benefit,
        as: 'benefits',
        through: {
          attributes: [],
        },
        attributes: ['name', 'url', 'id'],
      },
    ],
  });


  job.dataValues.benefits = company.benefits;
  return {
    success: true,
    result: {
      job,
    },
  };
};


/**
 * @param {Object} user | requester user object
 * @param {Object} queryFilter | query parameters for pagination and search
 * @returns {Object} | if company is premium returns Jobs included JobSeekers full data,
 * else Jobs included jobSeekers only with favorite flag
 */
exports.getCompanyJobs = async (user, queryFilter) => {
  console.log('=====> getCompanyJobs <=====');
  console.log('=====> queryFilter <=====', queryFilter);
  const userId = user.id;
  const { packages } = user.company;

  const {
    text = '', offset = 0, limit = 1000, sortBy = 0,
  } = queryFilter;

  const favorites = await getFavoriteJobSeekers(userId);

  // Note get only jobSeekers are favorite or not
  let attributes = [[sequelize.literal(`(case when "JobsMap->JobSeekers"."id" in (${favorites}) then true else false end)`), 'favorite']];

  // Note when company is upgraded or premium then get all jobSeekers profile
  if (packages && (packages.includes(4) || packages.includes(5))) {
    attributes = { include: [[sequelize.literal(`(case when "JobsMap->JobSeekers"."id" in (${favorites}) then true else false end)`), 'favorite']] };
  }

  const jobs = await await Job.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', parseInt(sortBy, 10) ? 'asc' : 'desc']],
    where: {
      userId,
      title: {
        ilike: `%${text}%`,
      },
    },
    distinct: true,
    include: [
      {
        model: Requirement,
        as: 'Requirement',
        attributes: { exclude: ['location', 'jobId'] },
        include: [
          {
            model: Industry,
            as: 'industries',
            order: [['updatedAt', 'desc']],
            through: { attributes: [] },
            attributes: ['name', 'id'],
          },
          {
            model: Interest,
            as: 'interests',
            order: [['updatedAt', 'desc']],
            through: { attributes: [] },
            attributes: ['name', 'id'],
          },
          {
            model: Occupation,
            as: 'occupations',
            order: [['updatedAt', 'desc']],
            through: { attributes: [] },
            attributes: ['name', 'id'],
          },
        ],
        raw: true,
      },
      {
        model: JobSeeker,
        as: 'reactedJobSeekers',
        attributes,
        through: {
          where: {
            appliedByCompany: true,
            appliedByJobSeeker: true,
          },
          attributes: []
        },
        include: {
          model: User,
          as: 'user',
          attributes: ['avatar', 'firstName', 'lastName'],
        },
      },
      { // fixme Should be removed, and should be used association in upper scope
        model: JobsMap,
        as: 'JobsMap',
        attributes: ['id'],
        required: false,
        where: {
          appliedByCompany: true,
          appliedByJobSeeker: true,
        },
        include: {
          model: JobSeeker,
          as: 'JobSeekers',
          required: false,
          attributes,
          include: {
            model: User,
            as: 'user',
            attributes: ['avatar', 'firstName', 'lastName'],
          },
        },
      }, // fixme Should be removed
    ],
  });

  return {
    success: true,
    result: {
      jobs: jobs.rows,
      total: jobs.count,
    },
  };
};

exports.deleteJobById = async (userId, id) => {
  console.log('=====> Job By Id <=====');

  const destroyed = await Job.destroy({ where: { id, userId } });

  return { success: !!destroyed };
};


exports.updateJobById = async (user, data, jobId) => {
  const transaction = await sequelize.transaction();
  console.log('=====> updateJobById <=====');
  try {
    const userId = user.id;
    const {
      requirements,
      requirements: {
        industries,
        interests,
        occupations,
      },
      location: {
        longitude,
        latitude,
        country,
        state,
        city,
      }
    } = data;

    const location = sequelize.literal(`ST_GeomFromText('POINT(${longitude} ${latitude})')`);

    await Job.update(data, { where: { id: jobId, userId }, transaction });

    const requirement = await Requirement.update(
      {
        ...requirements,
        country,
        state,
        city,
        location
      },
      {
        where: { jobId },
        transaction,
        returning: true,
        plain: true
      },
    );

    // fixme this part Should be removed Note from here
    if (industries && industries.length) {
      const industriesArr = industries.map(item => item.id);
      await requirement[1].setIndustries(industriesArr, { transaction });
    }

    if (interests && interests.length) {
      const interestsArr = interests.map(item => item.id);
      await requirement[1].setInterests(interestsArr, { transaction });
    }
    // fixme this part Should be removed Note to here

    if (occupations && occupations.length) {
      await requirement[1].setOccupations(occupations, { transaction });
    }

    await transaction.commit();
    return { success: true };
  } catch (err) {
    console.log('transaction.rollback');
    await transaction.rollback();
    throw err;
  }
};

exports.getSuggestedJobs = async (user, body, blockedUsers) => {
  console.log('====> getSuggestedJobs <=====');
  const { lat, lng } = body;
  // fixme set defaultDistance value 35 after test
  let defaultDistance = 1000000000;
  let { distance } = body;

  if (distance === null || !distance) {
    distance = 1000000000;
  }

  if (user.packages.length && user.packages.includes(3)) {
    defaultDistance = distance;
  }

  // let orderData = ['updatedAt', 'DESC'];
  const {
    queryParams: {
      page: {
        offset = 0,
        limit = 501,
      },
      filter = {
        text: '',
      },
    },
  } = body;

  let q = '';

  if (filter && filter.text) {
    q = `${filter.text}`;
  }

  const jobSeeker = await JobSeeker.findOne({
    where: {
      id: user.jobSeeker.id,
    },
    include: [
      {
        model: Industry,
        as: 'Industries',
        through: { attributes: [] },
        attributes: ['id'],
        raw: true,
      },
      {
        model: Interest,
        as: 'Interests',
        through: { attributes: [] },
        attributes: ['id'],
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
        attributes: ['name', 'id'],
        plain: true,
      },
    ],
    plain: true,
  });

  const reactedJobIds = await getAlreadyReactedJobs(user.jobSeeker.id);

  // fixme Should be removed
  const industries = jobSeeker.Industries.map(item => item.id);
  const interests = jobSeeker.Interests.map(item => item.id);
  // fixme Should be removed
  const occupations = jobSeeker.occupations.map(item => item.id);

  const suggestedJobs = await Job.findAndCountAll({
    limit,
    offset,
    subQuery: false,
    distinct: true,
    order: [
      [sequelize.literal('"Requirement.interests.same" desc')],
      [sequelize.literal('"Requirement.industries.same" desc')],
    ],
    where: {
      id: { [Op.notIn]: reactedJobIds },
      title: { ilike: `%${q}%` },
      [Op.and]: [
        // sequelize.literal(`"swipeLimit"+${parseInt(swipeCount, 10)}`)
        sequelize.where(sequelize.literal(`ST_Distance_Sphere(location, ST_GeomFromText('POINT(${lng} ${lat})'))/1000/1.609344`), 'JobDistance', { [Op.lte]: defaultDistance }),
      ],
      userId: {
        [Op.notIn]: blockedUsers.length ? blockedUsers : -1,
      },
    },
    include: [
      {
        model: Requirement,
        as: 'Requirement',
        include: [
          {
            model: Interest,
            as: 'interests',
            through: { attributes: [] },
            attributes: ['name', 'id', [sequelize.literal(`(case when "Requirement->interests"."id" in (${interests.length ? industries : -1}) then true else false end)`), 'same']],
          },
          {
            model: Industry,
            as: 'industries',
            through: { attributes: [] },
            attributes: ['name', 'id', [sequelize.literal(`(case when "Requirement->industries"."id" in (${industries.length ? industries : -1}) then true else false end)`), 'same']],
          },
          {
            model: Occupation,
            as: 'occupations',
            through: { attributes: [] },
            attributes: ['name', 'id', [sequelize.literal(`(case when "Requirement->occupations"."id" in (${occupations.length ? occupations : -1}) then true else false end)`), 'same']],
          },
        ],
        attributes: {
          exclude: ['location'],
          include: [[sequelize.literal(`ST_Distance_Sphere(location, ST_GeomFromText('POINT(${lng} ${lat})'))/1000/1.609344`), 'JobDistance']],
        },
      },
    ],
  });

  return {
    success: true,
    result: {
      matchingJobs: suggestedJobs.rows,
      total: suggestedJobs.count,
    },
  };
};

exports.getMatchedJobs = async (user, body, queryParams = { page: { offset: 0, limit: 10 }, order: false, filter: { text: '' } }) => {
  console.log('=====> getMatchedJobs <=====');

  const {
    page: {
      offset = 0,
      limit = 10,
    },
    order,
    filter = {
      text: '',
    },
  } = queryParams;

  let q = '';

  if (filter && filter.text) {
    q = `${filter.text}`;
  }

  let orderData = ['updatedAt', 'DESC'];

  if (order) {
    const { key, bool: isDesc } = order;
    orderData = [`${key}`, `${isDesc ? 'DESC' : 'ASC'}`];
  }

  const jobs = await JobsMap.findAll({
    where: {
      jobSeekerId: user.jobSeeker.id,
      appliedByJobSeeker: true,
      appliedByCompany: true,
    },
  });
  const jobIds = jobs.map(job => job.jobId);

  const isPremium = await UserPackages.findOne({
    where: {
      PackageId: 3,
      validThru: { [Op.gte]: new Date() },
      userId: user.id,
      jobSeekerId: user.jobSeeker.id,
    },
    raw: true,
  });

  const favorites = await getFavoriteJobs(user.id);

  const matchedJobs = await Job.findAndCountAll({
    offset: isPremium ? offset : 0,
    limit: isPremium ? limit : 10,
    order: [orderData],
    where: {
      id: {
        [Op.in]: jobIds,
      },
      title: { ilike: `%${q}%` },
    },
    attributes: ['createdAt', 'updatedAt', 'id', 'companyLogo', 'title', 'companyName', [sequelize.literal(`(case when "Job"."id" in (${favorites}) then true else false end)`), 'favorite']],
    include: [
      {
        model: Requirement,
        as: 'Requirement',
        attributes: ['city', 'state', 'country'],
        raw: true,
      }
    ],
  });

  return {
    success: true,
    result: {
      matchedJobs: matchedJobs.rows,
      total: matchedJobs.count,
    },
  };
};

exports.unMatchJob = async (user, jobId) => {
  console.log('=====> unMatchJob <=====');

  await JobsMap.update({ appliedByJobSeeker: false }, {
    where: {
      jobSeekerId: user.jobSeeker.id,
      appliedByJobSeeker: true,
      jobId,
    },
    raw: true,
  });

  return { success: true };
};

exports.unMatchJobSeeker = async (userId, jobId, jobSeekerId) => {
  console.log('=====> unMatchJobSeeker <=====');

  await JobsMap.update({ appliedByCompany: false }, {
    where: {
      jobSeekerId,
      appliedByCompany: true,
      jobId,
      userId,
    },
  });

  return { success: true };
};

exports.unDeclineJobSeeker = async (user, jobSeekerId, jobId) => {
  console.log('=====> unDeclineJob <=====');

  await JobsMap.update({ declinedByCompany: false }, {
    where: {
      jobSeekerId,
      declinedByCompany: true,
      userId: user.id,
      jobId,
    },
    raw: true,
  });

  return { success: true };
};

exports.unDeclineJob = async (user, jobId) => {
  console.log('=====> unDeclineJob <=====');

  await JobsMap.update({ declinedByJobSeeker: false }, {
    where: {
      jobSeekerId: user.jobSeeker.id,
      declinedByJobSeeker: true,
      jobId,
    },
  });

  return { success: true };
};

exports.getPendingJobs = async (user, queryParams) => {
  console.log('=====> getPendingJobs <=====');
  let q = '';
  const {
    page: {
      offset = 0,
      limit = 10,
    },
    order,
    filter = {
      text: '',
    },
  } = queryParams;

  if (filter && filter.text) {
    q = `${filter.text}`;
  }

  let orderData = ['updatedAt', 'DESC'];

  if (order) {
    const { key, bool: isDesc } = order;
    orderData = [`${key}`, `${isDesc ? 'DESC' : 'ASC'}`];
  }

  const jobs = await JobsMap.findAll({
    where: {
      jobSeekerId: user.jobSeeker.id,
      declinedByCompany: false,
      appliedByCompany: false,
      appliedByJobSeeker: true,
    },
    attributes: ['jobId'],
    raw: true,
  });
  const jobIds = jobs.map(job => job.jobId);

  const favorites = await getFavoriteJobs(user.id);

  const pendingJobs = await Job.findAndCountAll({
    offset,
    limit,
    order: [orderData],
    where: {
      id: {
        [Op.in]: jobIds,
      },
      title: { ilike: `%${q}%` },
    },
    attributes: ['createdAt', 'updatedAt', 'id', 'companyLogo', 'title', 'companyName', [sequelize.literal(`(case when "Job"."id" in (${favorites}) then true else false end)`), 'favorite']],
    include: [
      {
        model: Requirement,
        as: 'Requirement',
        attributes: ['city', 'state', 'country'],
        raw: true,
      },
    ],
  });

  return {
    success: true,
    result: {
      pendingJobs: pendingJobs.rows,
      total: pendingJobs.count,
    },
  };
};

exports.getPendingJobSeekers = async (user, queryParams = { page: { offset: 0, limit: 10 }, order: false, filter: { text: '' } }) => {
  console.log('=====> getPendingJobSeekers <=====');

  const {
    page: {
      offset = 0,
      limit = 10,
    },
    order,
    filter = {
      text: '',
    },
  } = queryParams;

  let q = '';

  if (filter && filter.text) {
    q = `${filter.text}`;
  }

  let orderData = ['updatedAt', 'DESC'];

  if (order) {
    const { key, bool: isDesc } = order;
    orderData = [`${key}`, `${isDesc ? 'DESC' : 'ASC'}`];
  }

  const favorites = await getFavoriteJobSeekers(user.id);

  const pendingJobSeekers = await await JobsMap.findAndCountAll({
    limit,
    offset,
    order: [orderData],
    attributes: ['id', 'jobSeekerId', 'jobId', 'updatedAt'],
    distinct: true,
    where: {
      userId: user.id,
      appliedByCompany: true,
      declinedByJobSeeker: false,
      appliedByJobSeeker: false,
      declinedByCompany: false,
    },
    include: [
      {
        model: JobSeeker,
        as: 'JobSeekers', // fixme should Be changed to 'jobSeeker', return result will be { jobSeeker:{} } instead of { JobSeekers:[{}] }
        include: [
          {
            model: User,
            as: 'user',
            required: true,
            plain: true,
            attributes: ['firstName', 'lastName', 'avatar', 'email', 'verified']
          },
          {
            model: Education,
            as: 'Education',
            attributes: { exclude: ['id', 'location', 'jobSeekerId', 'userId', 'weight', 'createdAt', 'updatedAt'] },
          },
          {
            model: Employment,
            as: 'Employment',
            attributes: ['jobTitle', 'company', 'startDate', 'endDate', 'present'],
          },
        ],
        attributes: {
          include: [[sequelize.literal(`(case when "JobSeekers"."id" in (${favorites}) then true else false end)`), 'favorite']],
          exclude: ['locationPoint']
        },
      },
      {
        model: Job,
        as: 'job',
        where: {
          title: { ilike: `%${q}%` },
        },
      },
    ],
  });

  return {
    success: true,
    result: {
      pendingJobSeekers: pendingJobSeekers.rows,
      total: pendingJobSeekers.count,
    },
  };
};

exports.getDeclinedJobs = async (user, queryParams) => {
  console.log('=====> getDeclinedJobs <=====', user.jobSeeker.id);

  const {
    page: {
      offset = 0,
      limit = 10,
    },
    order,
    filter = {
      text: '',
    },
  } = queryParams;

  let q = '';

  if (filter && filter.text) {
    q = `${filter.text}`;
  }

  let orderData = ['updatedAt', 'DESC'];

  if (order) {
    const { key, bool: isDesc } = order;
    orderData = [`${key}`, `${isDesc ? 'DESC' : 'ASC'}`];
  }

  const favorites = await getFavoriteJobs(user.id);

  const declinedJobs = await Job.findAndCountAll({
    offset,
    limit,
    distinct: true,
    order: [orderData],
    where: {
      title: { ilike: `%${q}%` },
    },
    attributes: ['createdAt', 'updatedAt', 'id', 'companyLogo', 'title', 'companyName', [sequelize.literal(`(case when "Job"."id" in (${favorites}) then true else false end)`), 'favorite']],
    include: [
      {
        model: Requirement,
        as: 'Requirement',
        attributes: ['city', 'state', 'country'],
        raw: true,
      },
      {
        model: JobSeeker,
        as: 'reactedJobSeekers',
        required: true,
        through: {
          where: {
            jobSeekerId: user.jobSeeker.id,
            appliedByJobSeeker: true,
            declinedByCompany: true,
          },
          attributes: []
        },
        attributes: [],
      },
    ],
  });

  return {
    success: true,
    result: {
      declinedJobs: declinedJobs.rows,
      total: declinedJobs.count,
    },
  };
};

exports.getMatchedJobSeekers = async (user, queryParams = { page: { offset: 0, limit: 10 }, order: false, filter: { text: '' } }) => {
  console.log('=====> getMatchedJobSeekers <=====');
  const userId = user.id;
  /* Ordering */
  const {
    page: {
      offset = 0,
      limit = 10,
    },
    order,
    filter = {
      text: '',
    },
  } = queryParams;

  let text = '';

  if (filter && filter.text) {
    text = `${filter.text}`;
  }

  let orderData = ['updatedAt', 'DESC'];

  if (order) {
    const { key, bool: isDesc } = order;
    orderData = [`${key}`, `${isDesc ? 'DESC' : 'ASC'}`];
  }

  const hasPremiumAccess = user.company.packages.includes(5) || false;

  const favorites = await getFavoriteJobSeekers(userId);

  const matchedJobSeekers = await await JobsMap.findAndCountAll({
    limit: hasPremiumAccess ? limit : 5,
    offset,
    order: [orderData],
    attributes: ['id', 'jobSeekerId', 'jobId', 'updatedAt'],
    where: {
      userId,
      appliedByJobSeeker: true,
      declinedByJobSeeker: false,
      declinedByCompany: false,
      appliedByCompany: true,
    },
    distinct: true,
    include: [
      {
        model: JobSeeker,
        as: 'JobSeekers', // fixme should Be changed to 'jobSeeker', return result will be { jobSeeker:{} } instead of { JobSeekers:[{}] }
        include: [
          {
            model: User,
            as: 'user',
            required: true,
            attributes: ['avatar', 'firstName', 'lastName', 'email'],
          },
          {
            model: Education,
            as: 'Education',
            attributes: { exclude: ['id', 'location', 'jobSeekerId', 'userId', 'weight', 'createdAt', 'updatedAt'] },
          },
          {
            model: Employment,
            as: 'Employment',
            attributes: ['jobTitle', 'company', 'startDate', 'endDate', 'present'],
          },
        ],
        attributes: {
          include: [[sequelize.literal(`(case when "JobSeekers"."id" in (${favorites}) then true else false end)`), 'favorite']],
          exclude: ['locationPoint']
        },
      },
      {
        model: Job,
        as: 'job',
        required: true,
        where: {
          title: { ilike: `%${text}%` },
        },
      },
    ],
  });

  return {
    success: true,
    result: {
      matchedJobSeekers: matchedJobSeekers.rows,
      total: matchedJobSeekers.count,
    },
  };
};

exports.getDeclinedJobSeekers = async (user, queryParams = { page: { offset: 0, limit: 10 }, order: false, filter: { text: '' } }) => {
  console.log('=====> getDeclinedJobSeekers <=====');

  const {
    page: {
      offset = 0,
      limit = 10,
    },
    order,
    filter = {
      text: '',
    },
  } = queryParams;

  let q = '';

  if (filter && filter.text) {
    q = `${filter.text}`;
  }

  let orderData = ['updatedAt', 'DESC'];

  if (order) {
    const { key, bool: isDesc } = order;
    orderData = [`${key}`, `${isDesc ? 'DESC' : 'ASC'}`];
  }

  const favorites = await getFavoriteJobSeekers(user.id);

  const declinedJobSeekers = await await JobsMap.findAndCountAll({
    limit,
    offset,
    order: [orderData],
    attributes: ['id', 'jobSeekerId', 'jobId', 'updatedAt'],
    where: {
      userId: user.id,
      appliedByCompany: true,
      declinedByJobSeeker: true,
    },
    distinct: true,
    include: [
      {
        model: JobSeeker,
        as: 'JobSeekers', // fixme should Be changed to 'jobSeeker', return result will be { jobSeeker:{} } instead of { JobSeekers:[{}] }
        include: [
          {
            model: User,
            as: 'user',
            required: true,
            attributes: ['avatar', 'firstName', 'lastName', 'email'],
          },
          {
            model: Education,
            as: 'Education',
            attributes: { exclude: ['id', 'location', 'jobSeekerId', 'userId', 'weight', 'createdAt', 'updatedAt'] },
          },
          {
            model: Employment,
            as: 'Employment',
            attributes: ['jobTitle', 'company', 'startDate', 'endDate', 'present'],
          },
        ],
        attributes: { include: [[sequelize.literal(`(case when "JobSeekers"."id" in (${favorites}) then true else false end)`), 'favorite']] },
      },
      {
        model: Job,
        as: 'job',
        required: true,
        where: {
          title: { ilike: `%${q}%` },
        },
      },
    ],
  });

  return {
    success: true,
    result: {
      declinedJobSeekers: declinedJobSeekers.rows,
      total: declinedJobSeekers.count,
    },
  };
};

exports.applyJob = async (user, job) => {
  const transaction = await sequelize.transaction();
  try {
    console.log('=====> applyJob <=====');
    console.log(job);
    let matched = false;
    const jobId = job.id;

    const company = await Company.findOne({
      where: { userId: job.userId },
    });

    const alreadySwiped = await JobsMap.findOne({
      where: {
        jobId,
        jobSeekerId: user.jobSeeker.id,
      },
    });

    if (alreadySwiped) {
      if (alreadySwiped.appliedByJobSeeker) throw new exceptions.SomethingWentWrong({ message: 'You Have Already Applied this Job' });

      await alreadySwiped.update({
        appliedByJobSeeker: true,
        declinedByJobSeeker: false,
      }, { transaction });

      if (alreadySwiped.appliedByCompany) {
        await notificationService.sendMatchNotification(user.id, alreadySwiped.userId, jobId);
        matched = true;
      }
    } else {
      await JobsMap.create({
        jobId,
        jobSeekerId: user.jobSeeker.id,
        appliedByJobSeeker: true,
      }, { transaction });
    }
    await transaction.commit();

    return {
      success: true, matched, jobId, companyId: company.id,
    };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.declineJob = async (user, jobId) => {
  const transaction = await sequelize.transaction();
  try {
    console.log('=====> declineJob <=====');

    // Note Swipe limitation logic start
    // let {
    //   swipeLimit,
    //   swipeCount,
    //   swipeStarted,
    // } = await User.findOne({ where: { id: user.id }, raw: true });

    // const now = moment(new Date());
    // const start = moment(swipeStarted);
    // const duration = moment.duration(now.diff(start)).asHours();


    // if (duration >= 24) {
    //   const updatedUser = await User.update({
    //     swipeStarted: new Date(),
    //     swipeCount: 0,
    //   }, { where: { id: user.id }, raw: true, returning: true });
    //   swipeLimit = updatedUser[1].swipeLimit;
    //   swipeCount = updatedUser[1].swipeCount;
    //   swipeStarted = updatedUser[1].swipeStarted;
    // }
    //
    // if (swipeCount >= swipeLimit) {
    //   throw new exceptions.SomethingWentWrong({ message: 'You Have Reached Your daily limit of swipe' });
    // }
    // Note Swipe limiting logic end

    const alreadySwiped = await JobsMap.findOne({
      where: {
        jobSeekerId: user.jobSeeker.id,
        jobId,
      },
    });

    if (alreadySwiped) {
      await alreadySwiped.update({
        declinedByJobSeeker: true,
        appliedByJobSeeker: false,
      }, { transaction });
    } else {
      await JobsMap.create({
        jobId,
        jobSeekerId: user.jobSeeker.id,
        declinedByJobSeeker: true,
      }, { transaction });
    }

    await transaction.commit();
    return {
      success: true,
    };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.applyJobSeeker = async (jobSeekerId, userId, jobId) => {
  console.log('=====> applyJobSeeker <=====');
  let matched = false;
  const jobSeeker = await JobSeeker.findOne({
    where: { id: jobSeekerId },
    attributes: ['userId'],
  });

  const alreadySwiped = await JobsMap.findOne({
    where: {
      jobSeekerId,
      jobId,
    },
    raw: true,
  });

  if (alreadySwiped) {
    await JobsMap.update(
      { appliedByCompany: true, userId, declinedByCompany: false },
      { where: { jobId, jobSeekerId } },
    );

    if (alreadySwiped.appliedByJobSeeker) {
      await notificationService.sendMatchNotification(jobSeeker.userId, userId, jobId);
      matched = true;
    }
  } else {
    await JobsMap.create({
      jobSeekerId, jobId, appliedByCompany: true, userId,
    });
  }
  return {
    success: true,
    matched,
    jobId,
    jobSeekerId,
  };
};

exports.declineJobSeeker = async (userId, jobSeekerId, jobId) => {
  console.log('=====> declineJobSeeker <=====');

  const alreadySwiped = await JobsMap.findOne({
    where: { jobSeekerId, jobId },
  });

  if (alreadySwiped) {
    await alreadySwiped.update({
      userId,
      declinedByCompany: true,
      appliedByCompany: false,
    });
    return { success: true };
  }

  await JobsMap.create({
    userId, jobSeekerId, jobId, declinedByCompany: true,
  });

  return { success: true };
};

exports.getSuggestedJobSeekers = async (user, jobId, blockedUsers, queryParams = { page: { offset: 0, limit: 10 } }) => {
  logger.info('=====> getSuggestedJobSeekers <=====');

  const userId = user.id;
  const {
    page: {
      offset = 0,
      limit = 10,
    },
  } = queryParams;

  const requirement = await getJobRequirement(jobId);
  const boostedJobSeekerIds = await getBoostedJobSeekers();
  const alreadySwipedJobSeekersIds = await getAlreadySwipedJobSeekers(userId, jobId);
  const matchedByEmployment = await getJobSeekersMatchedByEmployment(requirement);
  const { jobSeekerWhere, where } = await buildWhereQuery(matchedByEmployment, alreadySwipedJobSeekersIds, requirement, blockedUsers);

  const suggestedJobSeekers = await User.findAndCountAll({
    offset,
    limit,
    order: [
      // Note commented, and may be removed, due to change request of change industries to occupations
      // [sequelize.literal('"jobSeeker.Interests.same" desc')],
      // [sequelize.literal('"jobSeeker.Industries.same" desc')],
      [sequelize.literal('"jobSeeker.occupations.same" desc')],
    ],
    where,
    distinct: true,
    subQuery: false,
    attributes: { exclude: ['password', 'role', 'position', 'createdAt', 'updatedAt', 'id'] },
    include: [
      {
        model: JobSeeker,
        as: 'jobSeeker',
        order: [sequelize.literal(`"JobSeeker"."id" in (${boostedJobSeekerIds}) DESC`), ['updatedAt', 'DESC']],
        where: jobSeekerWhere,
        include: [
          {
            model: Interest,
            as: 'Interests',
            through: { attributes: [] },
            attributes: ['name', 'id', [sequelize.literal(`(case when "jobSeeker->Interests"."id" in (${requirement.interests}) then true else false end)`), 'same']],
          },
          {
            model: Industry,
            as: 'Industries',
            through: { attributes: [] },
            attributes: ['id', 'name', [sequelize.literal(`(case when "jobSeeker->Industries"."id" in (${requirement.industries}) then true else false end)`), 'same']],
          },
          {
            model: Education,
            as: 'Education',
            attributes: { exclude: ['id', 'location', 'jobSeekerId', 'userId', 'weight', 'createdAt', 'updatedAt'] },
          },
          {
            model: Employment,
            as: 'Employment',
            attributes: ['jobTitle', 'company', 'startDate', 'endDate', 'present'],
          },
          {
            model: Skills,
            as: 'skills',
            through: { attributes: [] },
            attributes: ['name', 'id'],
          },
          {
            model: Occupation,
            as: 'occupations',
            through: { attributes: [] },
            attributes: ['id', 'name', [sequelize.literal(`(case when "jobSeeker->occupations"."id" in (${requirement.occupations}) then true else false end)`), 'same']],
            plain: true,
          },
        ],
      },
    ],
  });

  return {
    success: true,
    result: {
      suggestedJobSeekers: suggestedJobSeekers.rows,
      total: suggestedJobSeekers.count,
    },
  };
};

exports.markAsFavorite = async (user, jobId) => {
  await FavoriteJobs.upsert({ userId: user.id, jobId });
  return { success: true };
};

exports.unMarkJobAsFavorite = async (user, jobId) => {
  await FavoriteJobs.destroy({ where: { userId: user.id, jobId } });
  return { success: true };
};
