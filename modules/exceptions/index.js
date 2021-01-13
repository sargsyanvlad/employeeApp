const { BASE_ERRORS } = require('./constants');
const { errorLogger } = require('../../utils/logger');

class BaseError extends Error {}

class InternalServerError extends BaseError {
  constructor(details) {
    super();
    this.details = details;
  }
  getError() {
    let error = BASE_ERRORS.INTERNAL_SERVER_ERROR;
    if (this.details) {
      error = { ...error, details: this.details };
    } else error = { ...error, details: BASE_ERRORS.INTERNAL_SERVER_ERROR.debug };

    return error;
  }
}


class InvalidUserCredentials extends BaseError {
  constructor(details) {
    super();
    this.details = details;
  }

  getError() {
    let error = BASE_ERRORS.INVALID_USER_CREDENTIALS;

    if (this.details) {
      error = { ...error, details: this.details };
    } else error = { ...error, details: BASE_ERRORS.INVALID_USER_CREDENTIALS.debug };
    errorLogger.error('InvalidUserCredentials', { error });
    return error;
  }
}

class AccessDeniedError extends BaseError {
  constructor(details) {
    super();
    this.details = details;
  }
  getError() {
    let error = BASE_ERRORS.ACCESS_DENIED_ERROR;

    if (this.details) {
      return { ...error, details: this.details };
    } error = { ...error, details: BASE_ERRORS.ACCESS_DENIED_ERROR.debug };
    errorLogger.error('AccessDeniedError', { AccessDeniedError: { error } });
    return error;
  }
}

class AuthenticationError extends BaseError {
  constructor(details) {
    super();
    this.details = details;
  }
  getError() {
    let error = BASE_ERRORS.AUTHENTICATION_ERROR;

    if (this.details) {
      error = { ...error, details: this.details };
    } else error = { ...error, details: BASE_ERRORS.AUTHENTICATION_ERROR.debug };
    errorLogger.error('AuthenticationError', { AuthenticationError: { error } });
    return error;
  }
}

class InvalidUserInput extends BaseError {
  constructor(details) {
    super();
    this.details = details;
  }

  getError() {
    let error = BASE_ERRORS.INVALID_USER_INPUT;
    if (this.details) {
      error = { ...error, details: this.details };
    }
    errorLogger.error('InvalidUserInput', { InvalidUserInput: { error } });
    return error;
  }
}

class RequiredParameterNotProvided extends BaseError {
  constructor(details) {
    super();
    this.details = details;
  }

  getError() {
    let error = BASE_ERRORS.REQUIRED_PARAMETER_NOT_PROVIDED;
    if (this.details) {
      error = { ...error, details: this.details };
    }
    errorLogger.error('RequiredParameterNotProvided', { RequiredParameterNotProvided: { error } });
    return error;
  }
}

class SequelizeError extends BaseError {
  constructor(exception) {
    super();
    this.exception = exception;
    this.details = exception.errors ? exception.errors[0].message : exception.message;
  }

  getError() {
    let error = BASE_ERRORS.INVALID_USER_INPUT;
    if (this.details) {
      error = { ...error, details: this.details };
      if (!this.exception.errors) { [error.details, error.debug] = [error.debug, error.details]; }
      error.details = {
        message: error.details,
      };
    }
    errorLogger.error('SequelizeError', { SequelizeError: { error } });
    return error;
  }
}

class SomethingWentWrong extends BaseError {
  constructor(details) {
    super();
    this.details = details;
  }
  getError() {
    let error = BASE_ERRORS.SOMETHING_WENT_WRONG;
    if (this.details) {
      error = { ...error, details: this.details };
    }
    errorLogger.error('SomethingWentWrong', { SomethingWentWrong: { error } });
    return error;
  }
}

class ChatAuthenticationError extends BaseError {
  constructor(details) {
    super();
    this.details = details;
  }
  getError() {
    let error = BASE_ERRORS.AUTHENTICATION_ERROR;

    if (this.details) {
      error = { ...error, details: this.details };
    } else error = { ...error, details: BASE_ERRORS.AUTHENTICATION_ERROR.debug };
    errorLogger.error('ChatAuthenticationError', { ChatAuthenticationError: { error } });
    return error;
  }
}


module.exports = {
  BaseError,
  SequelizeError,
  InvalidUserInput,
  AccessDeniedError,
  SomethingWentWrong,
  AuthenticationError,
  InternalServerError,
  InvalidUserCredentials,
  ChatAuthenticationError,
  RequiredParameterNotProvided,
};
