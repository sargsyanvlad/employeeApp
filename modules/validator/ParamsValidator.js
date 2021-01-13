/* eslint-disable no-underscore-dangle, no-console, class-methods-use-this */
const Validator = require('fastest-validator');
const moment = require('moment');

const FV = new Validator();
const exceptions = require('../exceptions');
const { logger } = require('../../utils/logger');
const { USER_PROVIDERS } = require('../../utils/constants');

const {
  educationSchema,
  benefitsSchema,
  jobSeekerUpdateSchema,
  locationSchema,
  companyUpdatingData,
  employmentsSchema,
  jobSchema,
  companyUserSchema,
  interViewSchema,
  companySchema,
  employmentsUpdateSchema,
  signUpSchema,
  continueSignUpSchema,
  facebookSchema,
  linkedInSchema,
  appleSchema,
} = require('./validationSchemas');

class ParamsValidator {
  constructor() {
    this.supportedValidators = {
      asLocation: true,
      asUpdatingData: true,
      asEducations: true,
      asEmployments: true,
      asDegree: true,
    };
    this.degree = ['N/A', 'High school degree', 'Associate degree', 'Bachelors degree', 'Master\'s degree', 'PhD'];
  }

  customValidation(fieldsToValidate, validateAgainst) {
    const validated = FV.validate(fieldsToValidate, validateAgainst);
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }
  }

  nestedValidation(fields, targets) {
    console.log('===> nestedValidation <====');
    const params = {};
    fields.forEach((item) => {
      const flag = `as${item[0].toUpperCase()}${item.substring(1)}`;
      console.log(flag,'flag')
      if (this.supportedValidators[flag]) {
        console.log('this.flag', this[flag]);
        this[flag](targets[item]);
      }
      params[item] = targets[item];
    });
    return params;
  }

  asCompanyBenefits(target) {
    console.log('====> Validate as CompanyBenefits <=====');
    const validated = FV.validate({ benefits: target }, benefitsSchema);
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }
  }

  asJobSeekerUpdateData(data) {
    console.log('====> Validate as JobSeeker Profile Update <=====');
    console.log('data', data)
    const validated = FV.validate(data, jobSeekerUpdateSchema);

    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }

    if (data.employments && data.employments.length) {
      const validEmployments = this.asEmploymentsUpdate(data.employments);
      if (Array.isArray(validEmployments)) {
        throw new exceptions.InvalidUserInput(validEmployments);
      }
    }
    const nestedValidationKeys = Object.keys(jobSeekerUpdateSchema);
    const index = nestedValidationKeys.indexOf('employments');
    delete nestedValidationKeys[index];

    this.nestedValidation(nestedValidationKeys, data);
  }

  asSignUp(data) {
    logger.info('====> as asSignUp <====');
    logger.info('Data ====>', data);
    console.log('asSignUp Data ====>', data);
    let validated;
    switch (data.provider) {
      case USER_PROVIDERS.EMAIL: {
        console.log('EMAIL');
        validated = FV.validate(data, signUpSchema);
        break;
      }
      case USER_PROVIDERS.FACEBOOK: {
        console.log('FACEBOOK');
        validated = FV.validate(data, facebookSchema);
        break;
      }
      case USER_PROVIDERS.LINKEDIN: {
        console.log('LINKEDIN');
        validated = FV.validate(data, linkedInSchema);
        break;
      }
      case USER_PROVIDERS.APPLE: {
        console.log('APPLE');
        validated = FV.validate(data, appleSchema);
        break;
      }
      default: throw new exceptions.InvalidUserInput({ message: 'Invalid Provider' });
    }
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }
  }

  asContinueSignUp(data) {
    logger.info('====> as asContinueSignUp <====');
    logger.info('Data ====>', data);
    const validated = FV.validate(data, continueSignUpSchema);

    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }

    if (data.employments && data.employments.length) {
      const validEmployments = this.asEmployments(data.employments);
      if (Array.isArray(validEmployments)) {
        throw new exceptions.InvalidUserInput(validEmployments);
      }
    }

    const nestedValidationKeys = Object.keys(continueSignUpSchema);
    const index = nestedValidationKeys.indexOf('employments');
    delete nestedValidationKeys[index];

    this.nestedValidation(nestedValidationKeys, data);
  }

  asCompanyRegisterData(data) {
    const validated = FV.validate(data, companySchema);
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }
    const nestedValidationKeys = Object.keys(companySchema);

    nestedValidationKeys.employments = undefined;

    this.nestedValidation(nestedValidationKeys, data);
  }

  asCompanyUpdatingData(data) {
    const validated = FV.validate(data, companyUpdatingData);
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }
    const nestedValidationKeys = Object.keys(companyUpdatingData);
    this.nestedValidation(nestedValidationKeys, data);
  }

  asCompanyUserData(data) {
    console.log('====>Validate asCompanyUserData <====');
    const validated = FV.validate(data, companyUserSchema);
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }
  }

  asJob(params) {
    console.log('====> asJob <====');
    const validated = FV.validate(params, jobSchema);
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }
    const nestedValidationKeys = Object.keys(jobSchema);
    this.nestedValidation(nestedValidationKeys, params);
  }

  asEmployments(employments) {
    console.log('====> Validate As Employments <====');

    const validated = FV.validate({ employments }, employmentsSchema);
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }

    employments.map((item, index) => {
      if (!item.present && !item.endDate) {
        throw new exceptions.InvalidUserInput({
          type: 'required',
          field: `employments[${index}].endDate`,
          message: 'endDate Required when presentOption is not Set!',
          status: 400,
        });
      }
      const start = moment(item.startDate);
      const end = moment(item.endDate);
      const diff = moment.duration(end.diff(start));

      if (diff.asYears() < 0) {
        throw new exceptions.InvalidUserInput({
          type: 'required',
          field: `employments[${index}].startDate`,
          message: 'Employments startDate Cant Be Greater Than endDate!',
          status: 400,
        });
      }
      return true;
    });
  }

  asEmploymentsUpdate(employments) {
    console.log('====> Validate As Update Employments <====');

    const validated = FV.validate({ employments }, employmentsUpdateSchema);
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }

    employments.map((item, index) => {
      if (!item.present && !item.endDate) {
        throw new exceptions.InvalidUserInput({
          type: 'required',
          field: `employments[${index}].endDate`,
          message: 'endDate Required when presentOption is not Set!',
          status: 400,
        });
      }
      const start = moment(item.startDate);
      const end = moment(item.endDate);
      const diff = moment.duration(end.diff(start));

      if (diff.asYears() < 0) {
        throw new exceptions.InvalidUserInput({
          type: 'required',
          field: `employments[${index}].startDate`,
          message: 'Employments startDate Cant Be Greater Than endDate!',
          status: 400,
        });
      }

      return true;
    });
  }

  asLocation(location) {
    console.log('====>Validate asLocation <====');
    const validated = FV.validate({ location }, locationSchema);
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }
  }

  asInterView(data) {
    console.log('====>Validate asInterView <====');
    const validated = FV.validate(data, interViewSchema);
    if (Array.isArray(validated)) {
      throw new exceptions.InvalidUserInput(validated);
    }
    const nestedValidationKeys = Object.keys(interViewSchema);

    this.nestedValidation(nestedValidationKeys, data);
  }

  asEducations(educations) {
    console.log('====>Validate As Education <====');
    for (let i = 0; i < educations.length; i += 1) {
      if (educations[i].degree !== 'N/A') {
        const validated = FV.validate(educations[i], educationSchema);
        if (Array.isArray(validated)) {
          throw new exceptions.InvalidUserInput(validated);
        }
        const start = moment(`${educations[i].fromYear.toString()}-01-01`);
        const end = moment(`${educations[i].toYear.toString()}-01-01`);
        const diff = moment.duration(end.diff(start));

        if (diff.asYears() < 0) {
          throw new exceptions.InvalidUserInput({
            type: 'required',
            field: `educations[${i}].fromYear`,
            message: 'Education fromYear Cant Be Greater Than toYear!',
            status: 400,
          });
        }
      }
    }
  }
}

module.exports = ParamsValidator;
