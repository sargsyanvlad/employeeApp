const { Industry, sequelize } = require('../../../data/models/index');

const { Op } = sequelize;

/**
 * @param {object} filter
 * @returns {Promise<any>}
 */


module.exports = async filter => Industry.findAll({
  offset: filter.offset,
  limit: filter.limit,
  attributes: ['id', 'name'],
  where: {
    name: { [Op.iLike]: `%${filter.search}%` } // ILIKE '%hat' (case insensitive)
  },
  /* order: [
      // Will escape full_name and nestedValidation DESC against a list of valid direction parameters
      ['full_name', 'DESC']] */
});
