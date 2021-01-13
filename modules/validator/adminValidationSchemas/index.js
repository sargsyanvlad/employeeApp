exports.getAllJobSeekersSchema = {
  filter: {
    type: 'object',
    props: {
      text: { type: 'string', convert: true, optional: true },
      key: { type: 'string', optional: true, enum: ['firstName', 'lastName'], },
    },
  },
  limit: { type: 'number', convert: true, optional: true },
  offset: { type: 'number', convert: true, optional: true },
  order: {
    type: 'array',
    optional: true,
    enum: [
      '"id" desc', '"id" asc',
      '"createdAt" asc', '"createdAt" desc',
      '"updatedAt" asc', '"updatedAt" desc',
    ]
  },
  date: {
    type: 'object',
    optional: true,
    props: {
      from: {
        type: 'date', empty: false, optional: false, convert: true
      },
      to: {
        type: 'date', empty: false, optional: false, convert: true
      },
      $$strict: true
    }
  },
  groupBy: { type: 'string', enum: ['year', 'month', 'day', 'week'] }
};

exports.getAllCompaniesSchema = {
  filter: {
    type: 'object',
    optional: true,
    props: {
      text: { type: 'string', convert: true, optional: true },
      key: { type: 'string', optional: true, enum: ['name', 'email'], },
    },
  },
  limit: { type: 'number', convert: true, optional: true },
  offset: { type: 'number', convert: true, optional: true },
  order: {
    type: 'array',
    optional: true,
    enum: [
      '"id" desc', '"id" asc',
      '"createdAt" asc', '"createdAt" desc',
      '"updatedAt" asc', '"updatedAt" desc',
    ]
  },
  date: {
    type: 'object',
    optional: true,
    props: {
      from: {
        type: 'date', empty: false, optional: false, convert: true
      },
      to: {
        type: 'date', empty: false, optional: false, convert: true
      },
      $$strict: true
    }
  },
  groupBy: { type: 'string', enum: ['year', 'month', 'day', 'week'] }
};

exports.getAllUserSchema = {
  filter: {
    type: 'object',
    optional: true,
    props: {
      text: { type: 'string', convert: true, optional: true },
      key: { type: 'string', optional: true, enum: ['firstName', 'lastName', 'email'], },
    },
  },
  limit: { type: 'number', convert: true, optional: true },
  offset: { type: 'number', convert: true, optional: true },
  order: {
    type: 'array',
    optional: true,
    enum: [
      '"role" asc', '"role" desc',
      '"blocks" desc', '"blocks" asc',
      '"reports" asc', '"reports" desc',
      '"createdAt" asc', '"createdAt" desc',
      '"updatedAt" asc', '"updatedAt" desc',
    ]
  },
  date: {
    type: 'object',
    optional: true,
    props: {
      from: {
        type: 'date', empty: false, optional: false, convert: true
      },
      to: {
        type: 'date', empty: false, optional: false, convert: true
      },
      $$strict: true
    }
  },
  groupBy: { type: 'string', enum: ['year', 'month', 'day', 'week'] }
};

exports.getReportedUsersSchema = {
  filter: {
    type: 'object',
    optional: true,
    props: {
      text: { type: 'string', convert: true, optional: true },
      key: { type: 'string', optional: true, enum: ['firstName', 'lastName', 'email'], },
    },
  },
  limit: { type: 'number', convert: true, optional: true },
  offset: { type: 'number', convert: true, optional: true },
  order: {
    type: 'array',
    optional: true,
    enum: [
      '"role" asc', '"role" desc',
      '"blocks" desc', '"blocks" asc',
      '"reports" asc', '"reports" desc',
      '"createdAt" asc', '"createdAt" desc',
      '"updatedAt" asc', '"updatedAt" desc',
    ]
  },
  date: {
    type: 'object',
    optional: true,
    props: {
      from: {
        type: 'date', empty: false, optional: false, convert: true
      },
      to: {
        type: 'date', empty: false, optional: false, convert: true
      },
      $$strict: true
    }
  },
  groupBy: { type: 'string', enum: ['year', 'month', 'day', 'week'] }
};


exports.getAllJobsSchema = {
  filter: {
    type: 'object',
    optional: true,
    props: {
      text: { type: 'string', convert: true, optional: true },
      key: { type: 'string', optional: true, enum: ['title', 'companyName', 'type', 'title'], },
    },
  },
  limit: { type: 'number', convert: true, optional: true },
  offset: { type: 'number', convert: true, optional: true },
  order: {
    type: 'array',
    optional: true,
    enum: [
      '"id" asc', '"id" desc',
      '"salary" asc', '"salary" desc',
      '"updatedAt" asc', '"updatedAt" desc',
      '"createdAt" desc', '"createdAt" asc',
    ]
  },
  date: {
    type: 'object',
    optional: true,
    props: {
      from: {
        type: 'date', empty: false, optional: false, convert: true
      },
      to: {
        type: 'date', empty: false, optional: false, convert: true
      },
      $$strict: true
    }
  },
  groupBy: { type: 'string', enum: ['year', 'month', 'day', 'week'] }
};

exports.getAllMatchesSchema = {
  limit: { type: 'number', convert: true, optional: true },
  offset: { type: 'number', convert: true, optional: true },
  order: {
    type: 'array',
    optional: true,
    enum: [
      '"id" asc', '"id" desc',
      '"updatedAt" asc', '"updatedAt" desc',
      '"createdAt" desc', '"createdAt" asc',
    ]
  },
  date: {
    type: 'object',
    optional: true,
    props: {
      from: {
        type: 'date', empty: false, optional: false, convert: true
      },
      to: {
        type: 'date', empty: false, optional: false, convert: true
      },
      $$strict: true
    }
  },
  groupBy: { type: 'string', enum: ['year', 'month', 'day', 'week'] }
};

exports.loginSchema = {
  email: {
    type: 'email',
    optional: false,
    empty: false,
  },
  password: { type: 'string', optional: false, empty: false },
};

exports.idSchema = {
  id: {
    type: 'number',
    optional: false,
    empty: false,
    convert: true,
  },
};
