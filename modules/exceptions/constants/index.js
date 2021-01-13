
const SEQUELIZE_ERRORS = {
  SequelizeValidationError: true,
  SequelizeUniqueConstraintError: true,
  SequelizeForeignKeyConstraintError: true,
  SequelizeDatabaseError: true,
};

const JWT_ERRORS = {
  JsonWebTokenError: true,
  TokenExpiredError: true,
};

const FACEBOOK_API_ERRORS = {
  FacebookApiException: true,
};

const BASE_ERRORS = {
  INTERNAL_SERVER_ERROR: { status: 500, statusName: 'internalServerError', debug: 'INTERNAL_SERVER_ERROR' },
  AUTHENTICATION_ERROR: { status: 401, statusName: 'unauthorized', debug: 'AUTHENTICATION_ERROR' },
  INVALID_USER_CREDENTIALS: { status: 400, statusName: 'badRequest', debug: 'INVALID_USER_CREDENTIALS' },
  INVALID_USER_INPUT: { status: 400, statusName: 'badRequest', debug: 'INVALID_USER_INPUT' },
  REQUIRED_PARAMETER_NOT_PROVIDED: { status: 400, statusName: 'badRequest', debug: 'REQUIRED_PARAMETER_NOT_PROVIDED' },
  NOT_FOUND_ERROR: { status: 404, statusName: 'notFound', debug: 'NOT_FOUND_ERROR' },
  ACCESS_DENIED_ERROR: { status: 403, statusName: 'forbidden', debug: 'ACCESS_DENIED_ERROR' },
  SOMETHING_WENT_WRONG: { status: 409, statusName: 'forbidden', debug: 'SOMETHING_WENT_WRONG' },
  CHAT_AUTHENTICATION_ERROR: { status: 406, statusName: 'forbidden', debug: 'SOMETHING_WENT_WRONG' },
};

module.exports = {
  SEQUELIZE_ERRORS,
  BASE_ERRORS,
  JWT_ERRORS,
  FACEBOOK_API_ERRORS,
};
