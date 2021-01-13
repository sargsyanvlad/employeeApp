const { Industry, sequelize } = require('../../../data/models/index');

const { Op } = sequelize;
/**
 * @param {array} industries
 * @returns {Promise<any>}
 */

module.exports = async (industries) => {
  const transaction = await sequelize.transaction();
  try {
    const names = [];
    const findIn = [];
    for (let i = 0; i < industries.length; i += 1) {
      names.push({ name: industries[i].name });
      findIn.push(industries[i].name);
    }

    await Industry.destroy({
      where: { name: { [Op.in]: findIn } }
    }, { transaction });

    await Industry.bulkCreate(names, { transaction });

    await transaction.commit();

    return Industry.findAll({
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
