const { USER_PROVIDERS } = require('../../../utils/constants');

exports.idSchema = {
  id: {
    type: 'number',
    optional: false,
    empty: false,
    convert: true,
  },
};

exports.appleSchema = {
  provider: {
    type: 'string',
    optional: false,
    empty: false,
    enum: [USER_PROVIDERS.APPLE],
  },
  id_token: {
    type: 'string',
    optional: false,
    empty: false,
  },
};

exports.linkedInSchema = {
  provider: {
    type: 'string',
    optional: false,
    empty: false,
    enum: [USER_PROVIDERS.FACEBOOK],
  },
  id_token: {
    type: 'string',
    optional: false,
    empty: false,
  },
};

exports.facebookSchema = {
  provider: {
    type: 'string',
    optional: false,
    empty: false,
    enum: [USER_PROVIDERS.FACEBOOK],
  },
  id_token: {
    type: 'string',
    optional: false,
    empty: false,
  },
};

exports.benefitsSchema = {
  benefits: {
    type: 'array',
    items: 'number',
    empty: false,
  },
};

exports.changeDateSchema = {
  interViewId: {
    type: 'number',
    optional: false,
    empty: false,
  },
  suggestedDates: {
    type: 'object',
    optional: false,
    empty: false,
  },
};


exports.jobSeekerJobSchema = {
  jobId: {
    type: 'number',
    optional: false,
    convert: true,
    empty: false,
  },
  jobSeekerId: {
    type: 'number',
    optional: false,
    convert: true,
    empty: false,
  },
};

exports.interViewSchema = {
  jobSeekerId: {
    type: 'number',
    empty: false,
    optional: false,
    convert: true,
  },
  jobId: {
    type: 'number',
    empty: false,
    optional: false,
    convert: true,
  },
  suggestedDates: {
    type: 'object',
    empty: false,
    optional: false,
    minLength: 1,
  },
  location: {
    type: 'object',
    optional: false,
    empty: false,
  },
};

exports.confirmInterViewSchema = {
  id: {
    type: 'number',
    optional: false,
    empty: false,
  },
  day: {
    type: 'string',
    optional: false,
    empty: false,
  },
  hour: {
    type: 'string',
    optional: false,
    empty: false,
  },
};

exports.educationSchema = {
  degree: {
    type: 'string',
    empty: false,
    optional: false,
    enum: ['N/A', 'High school degree', 'Associate degree', 'Bachelors degree', 'Master\'s degree', 'PhD'],
  },
  school: {
    type: 'string',
    empty: false,
    optional: false,
  },
  fieldOfStudy: {
    type: 'string',
    empty: false,
    optional: false,
  },
  fromYear: {
    type: 'string',
    empty: false,
    optional: false,
    convert: true,
  },
  toYear: {
    type: 'string',
    empty: false,
    optional: false,
    convert: true,
  },
  location: {
    type: 'object',
    optional: true,
    empty: true,
    props: {
      latitude: {
        type: 'number', optional: false, empty: false, convert: true,
      },
      longitude: {
        type: 'number', optional: false, empty: false, convert: true,
      },
    },
  },
};

exports.jobSeekerUpdateSchema = {
  firstName: { type: 'string', optional: false, empty: false },
  lastName: { type: 'string', optional: false, empty: false },
  about: { type: 'string', optional: true, empty: true },
  email: { type: 'email', optional: false, empty: false },
  avatar: { type: 'string', optional: true, empty: true },
  gender: { type: 'enum', values: ['male', 'female', 'rather not specify'], empty: false },
  educations: { type: 'array', optional: false, min: 1 },
  employments: { type: 'array', optional: true },
  industries: {
    type: 'array',
    min: 2,
    max: 5,
    optional: true,
    items: {
      type: 'object',
      props: {
        id: { type: 'number', positive: true },
        name: { type: 'string', empty: false },
      },
    },
  },
  interests: {
    type: 'array',
    min: 2,
    max: 5,
    optional: true,
    items: {
      type: 'object',
      props: {
        id: { type: 'number', positive: true },
        name: { type: 'string', empty: false },
      },
    },
  },
  location: {
    type: 'object',
    optional: false,
    empty: false,
    props: {
      latitude: {
        type: 'number', optional: false, empty: false, convert: true,
      },
      longitude: {
        type: 'number', optional: false, empty: false, convert: true,
      },
      city: {
        type: 'string', optional: false, empty: false, convert: false,
      },
      country: {
        type: 'string', optional: false, empty: false, convert: false,
      },
      state: {
        type: 'string', optional: true, empty: true, convert: false,
      },
    },
  },
  skills: {
    type: 'array',
    min: 2,
    optional: false,
    empty: false,
    items: {
      type: 'number',
    },
  },
  notificationSettings: {
    $$strict: true,
    type: 'object',
    optional: true,
    props: {
      allowNotifications: { type: 'boolean' },
      allowNewMessages: { type: 'boolean' },
    },
  },
};

exports.companyUpdatingData = {
  $$strict: true,
  avatar: { type: 'string', optional: true },
  benefits: { type: 'array', optional: true },
  email: { type: 'email', optional: false, empty: false },
  name: { type: 'string', optional: false, empty: false },
  phone: {
    type: 'number',
    optional: true,
    convert: true,
    min: 1000000000,
    max: 99999999999,
    // pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g,
  },
  description: { type: 'string', optional: false, empty: false },
  type: {
    type: 'array',
    min: 1,
    max: 3,
    optional: false,
    items: { type: 'number' },
  },
  location: {
    type: 'object',
    optional: false,
    empty: false,
  },
};

exports.locationSchema = {
  location: {
    type: 'object',
    optional: false,
    empty: false,
    props: {
      latitude: {
        type: 'number', optional: false, empty: false, convert: true,
      },
      longitude: {
        type: 'number', optional: false, empty: false, convert: true,
      },
      city: {
        type: 'string', optional: false, empty: false, convert: true,
      },
      country: {
        type: 'string', optional: false, empty: false, convert: true,
      },
      state: {
        type: 'string', optional: true, empty: true
      },
    },
  },
};

exports.employmentsSchema = {
  employments: {
    type: 'array',
    optional: true,
    min: 1,
    items: {
      type: 'object',
      props: {
        jobTitle: { type: 'string', empty: false, optional: false },
        company: { type: 'string', empty: false, optional: false },
        description: { type: 'string', empty: true, optional: true },
        startDate: {
          type: 'date', empty: false, optional: false, convert: true,
        },
        endDate: {
          type: 'date', empty: false, optional: true, convert: true,
        },
        location: {
          type: 'object',
          optional: false,
          empty: false,
          props: {
            latitude: {
              type: 'number', optional: false, empty: false, convert: true,
            },
            longitude: {
              type: 'number', optional: false, empty: false, convert: true,
            },
          },
        },
      },
    },
  },
};

exports.employmentsUpdateSchema = {
  employments: {
    type: 'array',
    optional: true,
    min: 1,
    items: {
      type: 'object',
      optional: false,
      props: {
        jobTitle: { type: 'string', empty: false, optional: false },
        company: { type: 'string', empty: false, optional: false },
        description: { type: 'string', empty: true, optional: true },
        startDate: {
          type: 'date', empty: false, optional: false, convert: true,
        },
        endDate: {
          type: 'date', empty: false, optional: true, convert: true,
        },
        location: {
          type: 'array',
          optional: false,
          empty: false,
          items: {
            type: 'object',
            props: {
              latitude: {
                type: 'number', optional: false, empty: false, convert: true,
              },
              longitude: {
                type: 'number', optional: false, empty: false, convert: true,
              },
            },
          },
        },
      },
    },
  },
};

exports.jobSchema = {
  $$strict: true,
  title: { type: 'string', optional: false, empty: false },
  salary: {
    type: 'number', optional: true, empty: false, convert: true,
  },
  description: { type: 'string', optional: false, empty: false },
  type: {
    type: 'string',
    empty: false,
    optional: false,
    enum: ['Full-time', 'Part-time', 'Internship', 'Other'],
  },
  location: {
    type: 'object',
    optional: false,
    empty: false,
  },
  requirements: {
    type: 'object',
    optional: false,
    empty: false,
    props: {
      educationLevel: {
        type: 'string', empty: false, optional: true, enum: ['N/A', 'High school degree', 'Associate degree', 'Bachelors degree', 'Master\'s degree', 'PhD'],
      },
      generalRequirement: { type: 'string', empty: true, optional: true },
      position: { type: 'string', empty: false, optional: true },
      duration: {
        type: 'number', empty: false, optional: true, convert: true,
      },
      maxiDistance: { type: 'number', empty: false, optional: true },
      // fixme Should be removed in future
      industries: {
        type: 'array',
        min: 2,
        max: 5,
        optional: true,
        items: {
          type: 'object',
          props: {
            id: { type: 'number', positive: true },
            name: { type: 'string', empty: false },
          },
        },
      },
      // fixme Should be removed in future
      interests: {
        type: 'array',
        min: 2,
        max: 5,
        optional: true,
        items: {
          type: 'object',
          props: {
            id: { type: 'number', positive: true },
            name: { type: 'string', empty: false },
          },
        },
      },
      occupations: {
        type: 'array',
        min: 1,
        // fixme change optional to false, after frontEnd implement occupations
        optional: true,
        empty: false,
        items: {
          type: 'number',
        },
      },
    },
  },
};

exports.companyUserSchema = {
  firstName: { type: 'string', empty: false, optional: false },
  lastName: { type: 'string', empty: false, optional: false },
  position: { type: 'string', empty: false, optional: false },
  email: { type: 'email', empty: false, optional: false },
};

exports.companySchema = {
  email: { type: 'email', optional: false, empty: false },
  password: {
    type: 'string', optional: false, empty: false, min: 6,
  },
  name: { type: 'string', optional: false, empty: false },
  provider: { type: 'enum', values: ['email', 'facebook', 'linedIn'] },
  description: { type: 'string', optional: false, empty: false },
  type: {
    $$strict: true,
    type: 'array',
    min: 1,
    max: 3,
    optional: false,
    items: {
      type: 'object',
      props: {
        id: { type: 'number', positive: true },
        name: { type: 'string', empty: false },
      },
    },
  },
  location: {
    type: 'object',
    optional: false,
    empty: false,
  },
};

exports.signUpSchema = {
  provider: { type: 'enum', enum: Object.values(USER_PROVIDERS) },
  firstName: { type: 'string', empty: false, optional: false },
  lastName: { type: 'string', empty: false, optional: false },
  email: { type: 'email', empty: false, optional: false },
  avatar: { type: 'string', empty: true, optional: true },
  password: {
    type: 'string', optional: false, empty: false, min: 6,
  },
};

exports.continueSignUpSchema = {
  gender: { type: 'enum', values: ['male', 'female', 'rather not specify'], empty: false },
  educations: { type: 'array', optional: false, min: 1 },
  employments: { type: 'array', optional: true },
  industries: { // fixme should be Removed
    type: 'array',
    min: 2,
    max: 5,
    optional: true,
    items: {
      type: 'object',
      props: {
        id: { type: 'number', positive: true },
        name: { type: 'string', empty: false },
      },
    },
  },
  interests: { // fixme should be Removed
    type: 'array',
    min: 2,
    max: 5,
    optional: true,
    items: {
      type: 'object',
      props: {
        id: { type: 'number', positive: true },
        name: { type: 'string', empty: false },
      },
    },
  },
  about: { type: 'string', optional: true, convert: true },
  location: {
    type: 'object',
    optional: false,
    empty: false,
    props: {
      latitude: {
        type: 'number', optional: false, empty: false, convert: true,
      },
      longitude: {
        type: 'number', optional: false, empty: false, convert: true,
      },
      city: {
        type: 'string', optional: false, empty: false, convert: false,
      },
      country: {
        type: 'string', optional: false, empty: false, convert: false,
      },
      state: {
        type: 'string', optional: true, empty: true, convert: false,
      },
    },
  },
  skills: {
    type: 'array',
    min: 2,
    optional: false,
    empty: false,
    items: {
      type: 'number',
    },
  },
  occupations: {
    type: 'array',
    min: 1,
    optional: false,
    empty: false,
    items: {
      type: 'number',
    },
  },
};
