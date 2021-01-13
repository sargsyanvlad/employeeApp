const {
  Education,
  sequelize,
} = require('../../../../data/models/index');
const { DEGREE_WEIGHTS } = require('../../../../utils/constants');

exports.createOrUpdate = async (data, userId, transaction) => {
  console.log('=====> create Or Update Education <=====');
  const educationsArray = [];

  await Education.destroy({ where: { userId } }, { transaction });

  data.educations.forEach((education) => {
    const {
      // fixme remove default values when fontEnd start to send Location
      location = {
        longitude: '-73.9249',
        latitude: '-49.6943',
        state: 'Yerevan',
        city: 'Yerevan',
        country: 'Armenia',
      },
      fromYear,
      toYear,
      fieldOfStudy,
      school,
      degree,
    } = education;

    const locationPoint = education.degree !== 'N/A' ? sequelize.literal(`ST_GeomFromText('POINT(${location.longitude} ${location.latitude})')`) : null;
    const educationObject = {
      school,
      degree,
      weight: DEGREE_WEIGHTS[degree],
      fromYear: degree !== 'N/A' ? fromYear : fromYear || null,
      toYear: degree !== 'N/A' ? toYear : toYear || null,
      jobSeekerId: data.jobSeekerId,
      fieldOfStudy,
      userId,
      longitude: degree !== 'N/A' ? location.longitude : location.longitude || null,
      latitude: degree !== 'N/A' ? location.latitude : location.latitude || null,
      state: degree !== 'N/A' ? location.state : location.state || null,
      city: degree !== 'N/A' ? location.city : location.city || null,
      country: degree !== 'N/A' ? location.country : location.country || null,
      location: locationPoint,
    };
    educationsArray.push(educationObject);
  });

  await Education.bulkCreate(educationsArray, { transaction });
};
