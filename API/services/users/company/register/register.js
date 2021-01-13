const { USER_PROVIDERS } = require('../../../../../utils/constants');
const exceptions = require('../../../../../modules/exceptions/index');
const errorDetails = require('../../../../../utils/errorDetails');

const {
  emailRegister,
} = require('./index');

/**
 *
 * @param {Object} data
 * @param {String|Number} | expIn Jwt valid expIn format
 * @returns {Promise<*> }
 */


module.exports = async (data) => {
  if (data.provider === USER_PROVIDERS.EMAIL) {
    return emailRegister(data);
  }
  throw new exceptions.InvalidUserInput(errorDetails.INVALID_PROVIDER);
};
