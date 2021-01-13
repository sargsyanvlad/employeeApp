/* eslint-disable no-console */
const axios = require('axios');
const {
  JobSeeker,
  User,
  Company,
  UserDevices,
  UserNotificationSettings,
} = require('../../../data/models/index');

const { mailerService } = require('../mailer');
const { errorLogger } = require('../../../utils/logger');

exports.sendNotification = async (userId, interView, message) => {
  try {
    const notificationSettings = await UserNotificationSettings.findOne({
      where: {
        userId,
      },
    });

    if (notificationSettings && notificationSettings.allowNotifications) {
      const devices = await UserDevices.findAll({
        where: { userId },
        attributes: ['cloudToken'],
      });

      const registrationIds = devices.map(item => item.cloudToken);

      await axios({
        method: 'post',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
          Authorization: process.env.FIREBASE_TOKEN,
        },
        data: {
          notification: {
            title: 'Congratulations',
            notificationData: {
              jobSeekerId: interView.jobSeekerId,
              userId: interView.userId,
              jobId: interView.jobId,
            },
            body: message || 'You Have New Notification',
            icon: 'firebase-logo.png',
            click_action: 'localhost:8081',
          },
          registration_ids: registrationIds,
        },
      });
    }
    return {
      success: true,
      message: 'Notification Sent',
    };
  } catch (err) {
    errorLogger.error(err);
    return {
      success: false,
      message: 'Notification Not Sent',
    };
  }
};


exports.sendMatchNotification = async (jobSeekerUserId, companyUserId, jobId) => {
  try {
    let registrationIds = [];
    let jobSeekerId;
    let mailToJobSeeker;
    let mailToCompany;

    const companyNotificationSettings = await UserNotificationSettings.findOne({
      where: {
        userId: companyUserId,
      },
    });
    const jobSeekerNotificationSettings = await UserNotificationSettings.findOne({
      where: {
        userId: jobSeekerUserId,
      },
    });

    if (jobSeekerNotificationSettings && jobSeekerNotificationSettings.allowNotifications) {
      const jobUser = await User.findOne({
        where: { id: jobSeekerUserId },
        include: [
          {
            model: JobSeeker,
            as: 'jobSeeker',
            attributes: ['id'],
            raw: true,
          },
          {
            model: UserDevices,
            as: 'userDevices',
            attributes: ['cloudToken'],
            raw: true,
          },
        ],
        plain: true,
      });
      mailToJobSeeker = jobUser;
      mailToJobSeeker.jobId = jobId;
      jobSeekerId = jobUser.jobSeeker.id;
      registrationIds = jobUser.userDevices.map(item => item.cloudToken);
    }

    if (companyNotificationSettings && companyNotificationSettings.allowNotifications) {
      const companyUser = await User.findOne({
        where: { id: companyUserId },
        include: [
          {
            model: UserDevices,
            as: 'userDevices',
            attributes: ['cloudToken'],
            raw: true,
          },
          {
            model: Company,
            as: 'Company',
            raw: true,
          },
        ],
      });
      mailToCompany = companyUser;
      companyUser.userDevices.map(item => registrationIds.push(item.cloudToken));
    }

    await axios({
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        Authorization: process.env.FIREBASE_TOKEN,
      },
      data: {
        notification: {
          title: 'It\'s a match! Tap for more!! 🎉',
          notificationData: {
            jobSeekerId,
            userId: companyUserId,
            jobId,
          },
          body: 'It\'s a match! Tap for more!! 🎉',
          icon: 'firebase-logo.png',
          clickAction: 'localhost:8081',
        },
        registration_ids: registrationIds,
      },
    });
    mailerService.sendMatchNotificationEmail(mailToCompany, mailToJobSeeker);
    return {
      success: true,
      message: 'Notification Sent',
    };
  } catch (err) {
    errorLogger.error(err);
    return {
      success: false,
      message: 'Notification Not Sent',
    };
  }
};

exports.sendInterViewUpdateNotification = async (user, interView) => {
  let devices;
  let registrationIds;
  let notificationSettings;

  if (user.role === 'company') {
    const jobSeeker = await JobSeeker.findOne({
      where: { id: interView.jobSeekerId },
      attributes: ['userId'],
      raw: true,
    });
    notificationSettings = await UserNotificationSettings.findOne({
      where: {
        userId: jobSeeker.userId,
      },
    });

    if (notificationSettings && notificationSettings.allowNotifications) {
      devices = await UserDevices.findAll({
        where: { userId: jobSeeker.userId },
        attributes: ['cloudToken'],
      });

      registrationIds = devices.map(item => item.cloudToken);
    }
  } else {
    notificationSettings = await UserNotificationSettings.findOne({
      where: {
        userId: interView.userId,
      },
    });

    if (notificationSettings && notificationSettings.allowNotifications) {
      devices = await UserDevices.findAll({
        where: { userId: interView.userId },
        attributes: ['cloudToken'],
        raw: true,
      });
      registrationIds = devices.map(item => item.cloudToken);
    }
  }

  await axios({
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      Authorization: process.env.FIREBASE_TOKEN,
    },
    data: {
      notification: {
        title: `Hi. the ${user.role === 'company' ? 'Company' : 'Candidate'} got in touch with you! Tap to learn.`,
        notificationData: {
          jobSeekerId: interView.jobSeekerId,
          userId: interView.userId,
          jobId: interView.jobId,
        },
        body: 'Hi. the employer got in touch with you! Tap to learn.',
        icon: 'firebase-logo.png',
        clickAction: 'localhost:8081',
      },
      registration_ids: registrationIds,
    },
  });
  return { meta: { success: true } };
};
