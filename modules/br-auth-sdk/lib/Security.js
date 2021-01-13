const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const randomString = require('randomstring');

class Security {
  static generatePasswordHash(password, option = 10) {
    return bcrypt.hashSync(password, option);
  }
  // static decodeToken(token) {
  //   return jwt.decode(token);
  // }
  //
  // static generateRandomString(salt = 32) {
  //   return randomString.generate(salt);
  // }
}


module.exports = Security;
