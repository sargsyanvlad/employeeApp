// const Async = require("async");
const { Skills, sequelize } = require('../../../data/models/index');

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

    await Skills.destroy({
      where: { name: { [Op.in]: findIn } }
    }, { transaction });

    await Skills.bulkCreate(names, { transaction });

    await transaction.commit();

    return Skills.findAll({
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
