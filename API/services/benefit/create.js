const { Benefit } = require('../../../data/models/index');
/**
 *
 * @param email
 * @param password
 * @param provider
 * @param phone
 * @param payload
 * @param expIn
 * @param params
 * @returns {Promise<any>}
 */

module.exports = async (params) => {
  const result = await Benefit.bulkCreate(params, { returning: true });
  return result;
};
