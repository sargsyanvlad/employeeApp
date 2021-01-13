const HTTP_STATUS_METHODS = {
  ok: 200,
  created: 201,
  accepted: 202,
  noContent: 204,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500,
};

const USER_ROLES = {
  JOBSEEKER: 'jobSeeker',
  COMPANY: 'company',
  COMPANY_USER: 'companyUser',
  SUPER_ADMIN: 'SuperAdmin'
};

const USER_GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'rather not specify',
};

const USER_PROVIDERS = {
  EMAIL: 'email',
  LINKEDIN: 'linkedIn',
  FACEBOOK: 'facebook',
  APPLE: 'apple',
};

const DEGREE_WEIGHTS = {
  'High school degree': 1,
  'Associate degree': 2,
  'Bachelors degree': 3,
  'Master\'s degree': 4,
  PhD: 5,
  'N/A': 0,
};

module.exports = {
  HTTP_STATUS_METHODS,
  USER_ROLES,
  USER_GENDERS,
  USER_PROVIDERS,
  DEGREE_WEIGHTS,
};
