const {
  Employment, EmploymentLocation,
} = require('../../../../data/models/index');
const { getDate } = require('../../../../utils/helpers');

exports.createOrUpdate = async (data, userId, transaction) => {
  console.log('=====> create Or Update Employment <=====');
  const employmentsArray = [];
  const locations = [];
  if (userId) {
    await Employment.destroy({
      where: { userId },
    }, { transaction });
  }

  data.employments.forEach((employment) => {
    const employmentEndDate = employment.presentOption ? employment.endDate : getDate();

    const employmentObj = {
      jobTitle: employment.jobTitle,
      company: employment.company,
      startDate: employment.startDate,
      endDate: employmentEndDate,
      jobSeekerId: data.jobSeekerId,
      present: employment.presentOption,
      userId,
    };
    employmentsArray.push(employmentObj);
  });

  const employmentData = await Employment.bulkCreate(
    employmentsArray,
    {
      returning: true,
      transaction,
    },
  );

  data.employments.forEach((employment, index) => {
    const { dataValues: { id: employmentId } } = employmentData[index];
    const location = {
      latitude: employment.location.latitude || employment.location[0].latitude,
      longitude: employment.location.longitude || employment.location[0].longitude,
      country: employment.location.country || employment.location[0].country,
      state: employment.location.state || employment.location[0].state,
      city: employment.location.city || employment.location[0].city,
      employmentId,
    };
    locations.push(location);
  });

  await EmploymentLocation.bulkCreate(locations, { transaction });
  return true;
};

