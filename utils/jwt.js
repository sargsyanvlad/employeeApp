const jwt = require('jsonwebtoken');
const { secrets } = require('../config');

const generate = async ({ data }) => jwt.sign(data, secrets.jwt, { expiresIn: '7d' });


module.exports = {
  generate,
};
