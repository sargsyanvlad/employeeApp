/* eslint-disable no-param-reassign */
const { SEQUELIZE_ERRORS, JWT_ERRORS, FACEBOOK_API_ERRORS } = require('../exceptions/constants');
const {
  SequelizeError, BaseError, InternalServerError, AuthenticationError,
} = require('../exceptions');

function normalizeError(exception) {
  if (SEQUELIZE_ERRORS[exception.name]) {
    return new SequelizeError(exception);
  }
  if (JWT_ERRORS[exception.name]) {
    return new AuthenticationError(exception);
  }
  if (FACEBOOK_API_ERRORS[exception.name]) {
    return new AuthenticationError(exception.response.error);
  }
  return exception;
}

module.exports = (ctx, exception) => {
  exception = normalizeError(exception);
  if (exception instanceof BaseError) {
    return exception;
  }

  return new InternalServerError();
};

