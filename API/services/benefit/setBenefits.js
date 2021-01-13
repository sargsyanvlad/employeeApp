const { User, Company } = require('../../../data/models/index');

module.exports = async (userId, body) => {
  const user = await User.findOne({
    where: {
      id: userId,
    },
    include: {
      model: Company,
      as: 'Company'
    }
  });
  user.Company.setBenefits(body);
};
