/* eslint-disable no-console */
const {
  User,
  sequelize,
  // UserDevices,
  ChatChannels,
  ChatAuthTokens,
} = require('../../../data/models/index');

const { Op } = sequelize;
const PubNub = require('pubnub');
const exceptions = require('../../../modules/exceptions');

const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE,
  secretKey: process.env.PUBNUB_SECRET,
  withPresence: true,
});

exports.getGrantToken = async (user) => {
  const result = await ChatAuthTokens.findOne({
    attributes: [['authToken', 'chatAuthToken']],
    where: {
      userId: user.id,
    },
    raw: true,
  });
  if (!result) throw new exceptions.SomethingWentWrong({ message: 'Cant Find chatToken for user' });
  return {
    success: true,
    result: {
      chatAuthToken: result.chatAuthToken,
    },
  };
};

exports.createConversation = async (user, body) => {
  const transaction = await sequelize.transaction();
  try {
    const userExists = await User.findOne({
      where: {
        id: body.userId,
      },
    });

    if (!userExists) throw new exceptions.InvalidUserInput({ message: 'Invalid User Id' });

    const userAuthKey = await ChatAuthTokens.findOne({
      where: {
        userId: body.userId,
      },
      raw: true,
    });

    if (!userAuthKey) throw new exceptions.SomethingWentWrong({ message: 'Cant Create Chat With JobSeeker' });

    const channel = `private_${user.id}_${body.userId}`;

    const channelExists = await ChatChannels.findOne({
      where: {
        channel,
        [Op.or]: {
          userId: body.userId,
          creatorId: user.id,
        },
      },
      raw: true,
    });

    if (channelExists) {
      // pubnub.push.addChannels(
      //   {
      //     channels: [channel],
      //     device: 'fiE7Q_2F_mM:APA91bHR0t98jkOOeo7QpUewLcqN6DQl9ZQQuQp0hd3IrN7VbBg4WkljBBXhNR1ThNQ7B8L5XsWMMkYZLJOF1rZPAIxyvOw2oo-mo7aMDHsddlGuLvBnEg1MmSTYQdsrgn_WwX9R1p_1',
      //     pushGateway: 'gcm', // apns, gcm, mpns
      //   },
      //   (status, response) => {
      //     if (status.error) {
      //       console.log('operation failed w/ error:', status);
      //     } else {
      //       console.log('operation done!', response);
      //     }
      //   },
      // );
      //
      // pubnub.publish(
      //   {
      //     channel: 'private_350_361',
      //     message: {
      //       pn_gcm: {
      //         message: {
      //           title: 'Company Want to Chat with You',
      //           text: 'Company Want to Chat with You',
      //           icon: 'mployd-logo.png',
      //           click_action: 'localhost:3000/chat/conversations',
      //         },
      //       },
      //     },
      //   },
      //   (status) => {
      //     console.log('operation Success with Status:', status);
      //   },
      // );

      await pubnub.grant({
        channels: [channelExists.channel],
        authKeys: [user.chatAuthToken, userAuthKey],
        read: true,
        write: true,
        manage: false,
      }, (status) => {
        console.log('status', status);
      });
      return { meta: { success: true, result: channel } };
    }

    await ChatChannels.create({
      channel,
      userId: body.userId,
      creatorId: user.id,
      meta: {},
    }, { returning: true, raw: true, transaction });


    pubnub.grant({
      channels: [channel],
      authKeys: [user.chatAuthToken, userAuthKey],
      read: true,
      write: true,
      manage: false,
    }, (status) => {
      console.log('status', status);
    });

    // pubnub.publish(
    //   {
    //     channel: 'private_350_361',
    //     message: {
    //       pn_gcm: {
    //         message: {
    //           title: 'Company Want to Chat with You',
    //           text: 'Company Want to Chat with You',
    //           icon: 'mployd-logo.png',
    //           click_action: 'localhost:3000/chat/conversations',
    //         },
    //       },
    //     },
    //   },
    //   (status) => {
    //     console.log('operation Success with Status:', status);
    //   },
    // );

    await transaction.commit();
    return { meta: { success: true, result: channel } };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};


exports.getConversationsList = async (user) => {
  const channels = await ChatChannels.findAll({
    attributes: ['channel', 'meta', 'userId', 'creatorId'],
    where: {
      [Op.or]: {
        userId: user.id,
        creatorId: user.id,
      },
    },
    raw: true,
  });

  if (!channels.length) throw new exceptions.SomethingWentWrong({ message: 'You Have Not Any Conversations ' });

  return { meta: { success: true, result: channels } };
};

exports.removeConversation = async (user, query) => {
  const { channel } = query;

  const exists = await ChatChannels.findOne({
    attributes: ['channel', 'meta', 'userId', 'creatorId'],
    where: {
      channel,
      [Op.or]: {
        userId: user.id,
        creatorId: user.id,
      },
    },
    raw: true,
  });

  if (!exists) throw new exceptions.SomethingWentWrong({ message: 'Incorrect Channel' });

  const { creatorId, userId } = exists;

  // const userDevices = await UserDevices.findAll({
  //   attributes: ['cloudToken'],
  //   where: {
  //     userId: {
  //       [Op.or]: [creatorId, userId],
  //     },
  //   },
  // });

  await ChatChannels.destroy({
    where: {
      channel,
      [Op.or]: { userId, creatorId },
    },
  });

  // userDevices.map((device) => {
  //   pubnub.push.removeChannels({
  //     channels: [channel],
  //     device: device.cloudToken,
  //     pushGateway: 'gcm',
  //   });
  //   return true;
  // });

  let authTokens = await ChatAuthTokens.findAll({
    attributes: ['authToken'],
    where: {
      userId: {
        [Op.or]: [creatorId, userId],
      },
    },
    raw: true,
  });
  authTokens = authTokens.map(item => item.authToken);

  await pubnub.grant({
    channels: [channel],
    authKeys: authTokens,
    read: false,
    write: false,
    manage: false,
  }, (status) => {
    console.log('Revoke status', status);
  });

  return { meta: { success: true, authTokens } };
};
