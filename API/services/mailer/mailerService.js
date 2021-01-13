/* eslint-disable no-console */
const handlebars = require('handlebars');
const fs = require('fs');
const nodemailer = require('nodemailer-promise');
const exceptions = require('../../../modules/exceptions');
const appRootPath = require('app-root-path');

const mailer = nodemailer.config({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL || 'brainstormtechtest@gmail.com',
    pass: process.env.EMAILPASS || 'P12345678',
  },
});

exports.sendForgotPasswordEmail = async (toEmail, resetCode) => {
  try {
    const htmlTemplate = fs.readFileSync(`${appRootPath.path}/utils/templates/forgotPassword/forgotPassword.html`, 'utf8');

    const mailTemplate = handlebars.compile(htmlTemplate);
    const mailOptions = {
      from: process.env.EMAIL || 'brainstormtechtest@gmail.com',
      to: toEmail,
      subject: 'Password Reset',
      html: mailTemplate({ reseturl: `https://app.mploydcareers.com/forget/${resetCode}` }),
    };
    mailer(mailOptions);
  } catch (err) {
    console.error({ sendForgotPasswordMail: err });
    throw new exceptions.SomethingWentWrong('Cant Send Email');
  }
};

exports.sendCompanyUserRegistrationEmail = async (toEmail, token) => {
  try {
    const htmlTemplate = fs.readFileSync(`${appRootPath.path}/utils/templates/createCompanyUser/createCompanyUser.html`, 'utf8');
    const mailTemplate = handlebars.compile(htmlTemplate);
    const mailOptions = {
      from: process.env.EMAIL || 'brainstormtechtest@gmail.com',
      to: toEmail,
      subject: 'Set Password',
      html: mailTemplate({ createpasswordurl: `https://app.mploydcareers.com/setPassword/${token}` }),
    };
    return await mailer(mailOptions);
  } catch (err) {
    console.log('----- send Company User Registration Email ERROR ------', err);
    console.error({ sendCompanyUserRegistrationMail: err });
    throw new exceptions.SomethingWentWrong({ message: 'Cant Send Email' });
  }
};

exports.sendUserConfirmationEmail = async (toEmail, confirmationToken) => {
  try {
    console.log('-----sendUserConfirmationEmail------');
    const htmlTemplate = fs.readFileSync(`${appRootPath.path}/utils/templates/emailConfirmation/emailConfirmation.html`, 'utf8');
    const mailTemplate = handlebars.compile(htmlTemplate);
    const mailOptions = {
      from: process.env.EMAIL || 'brainstormtechtest@gmail.com',
      to: toEmail,
      subject: 'Confirm You Account',
      html: mailTemplate({ confirmUrl: `https://app.mploydcareers.com/forget/${confirmationToken}` }),
    };
    return await mailer(mailOptions);
  } catch (err) {
    console.error({ sendUserConfirmationEmail: err });
    console.log('-----send User Confirmation Email ERROR ------', err);
    throw new exceptions.SomethingWentWrong({ message: 'Cant Send Email' });
  }
};

exports.sendMatchNotificationEmail = async (companyUser, jobUser) => {
  try {
    console.log('-----sendMatchNotificationEmail------');
    const host = process.env.npm_lifecycle_event === 'prod' ? 'http://23.20.24.145:3000' : 'http://localhost:3000';

    const htmlTemplate = fs.readFileSync(`${appRootPath.path}/utils/templates/matchingNotification/mployd.html`, 'utf8');
    const mailTemplate = handlebars.compile(htmlTemplate);
    const avatar = `https://mployd.s3.amazonaws.com/${jobUser.avatar || 'images/75df1c-1568719082009.png'}`;
    const logo = `https://mployd.s3.amazonaws.com/${companyUser.Company.companyLogo || 'images/f7e3cd-1568719165859.png'}`;

    const mailToJobSeeker = {
      from: process.env.EMAIL || 'brainstormtechtest@gmail.com',
      to: [jobUser.email],
      subject: 'It\'s a match!',
      html: mailTemplate({
        viewProfile: `${host}/job/${jobUser.jobId}`,
        companyLogo: logo,
        jobSeekerAvatar: avatar,
      }),
    };

    const mailToCompany = {
      from: process.env.EMAIL || 'brainstormtechtest@gmail.com',
      to: [companyUser.email],
      subject: 'It\'s a match!',
      html: mailTemplate({
        viewProfile: `${host}/jobSeeker/${jobUser.jobSeeker.id}?jobId=${jobUser.jobId}`,
        companyLogo: logo,
        jobSeekerAvatar: avatar,
      }),
    };

    await mailer(mailToCompany);
    await mailer(mailToJobSeeker);
    return { success: true };
  } catch (err) {
    console.log('-----send Notification Match Email ERROR ------', err);
    throw new exceptions.SomethingWentWrong({ message: 'Cant Send Email' });
  }
};
