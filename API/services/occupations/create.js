// const Async = require("async");
const { Occupation, sequelize } = require('../../../data/models/index');

const { Op } = sequelize;
/**
 *
 * @returns {Promise<any>}
 * @param interests
 */


module.exports = async (interests) => {
  const transaction = await sequelize.transaction();
  try {
    const names = [];
    const findIn = [];
    for (let i = 0; i < interests.length; i += 1) {
      names.push({ name: interests[i].name });
      findIn.push(interests[i].name);
    }

    await Occupation.destroy({
      where: { name: { [Op.in]: findIn } }
    }, { transaction });

    await Occupation.bulkCreate(names, { transaction });

    await transaction.commit();

    return Occupation.findAll({
      where: {
        name: {
          [Op.in]: findIn,
        },
      },
    });
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
