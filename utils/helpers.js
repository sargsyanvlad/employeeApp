/* eslint-disable no-console */
const moment = require('moment/moment');
const crypto = require('crypto');

exports.getDate = () => {
  const d = new Date();
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
};
exports.getDuration = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  return moment.duration(end.diff(start));
};


exports.generateToken = async ({ stringBase = 'hex', byteLength = 35 } = {}) => new Promise((resolve, reject) => {
  crypto.randomBytes(byteLength, (err, buffer) => {
    if (err) {
      reject(err);
    } else {
      resolve(buffer.toString(stringBase));
    }
  });
});

