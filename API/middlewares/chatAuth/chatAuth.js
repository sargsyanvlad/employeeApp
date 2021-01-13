const { User, Company, ChatAuthTokens } = require('../../../data/models');
const { ChatAuthenticationError } = require('../../../modules/exceptions');
const { globalAuth } = require('../globalAuth');
const errorDetails = require('../../../utils/errorDetails');

class ChatAuthClass {
  static async asChatCreateAccess(ctx, next) {
    console.log('=====> asCompanyUserData <=====');
    const { _id } = await globalAuth.authenticate(ctx);
    const user = await User.findOne({
      where: { id: _id },
      attributes: [
        'id',
        'role',
        'email',
        'avatar',
      ],
      raw: true,
    });

    const company = await Company.findOne({
      where: {
        userId: user.id,
      },
      raw: true,
    });

    if (!user || user.role !== 'company' || !company) {
      throw new ChatAuthenticationError({ message: errorDetails.PERMISSION_DENIED });
    }

    const chatAuthToken = await ChatAuthTokens.findOne({
      where: {
        userId: user.id,
      },
      raw: true,
    });

    if (!chatAuthToken) throw new ChatAuthenticationError({ message: 'Chat Authorization token Required' });

    // fixme logic to allow create chat only when Users matched each other
    // fixme commented for internal tests, should be uncommented when fronted implement chat Feature
    // const chatAuthToken = await ChatAuthClass.getChatAuthToken(ctx.request.headers);

    // const tokenExists = await ChatAuthTokens.findOne({
    //   where: {
    //     userId: user.id,
    //     authToken: chatAuthToken,
    //   },
    //   raw: true,
    // });

    // if (!tokenExists) throw new ChatAuthenticationError({ message: 'Invalid Chat AuthToken' });

    // const jobSeeker = await JobSeeker.findOne({
    //   where: {
    //     userId: ctx.request.body.userId,
    //   },
    //   attributes: ['id'],
    //   raw: true,
    // });

    // const matched = await JobsMap.findOne({
    //   where: {
    //     jobSeekerId: jobSeeker.id,
    //     appliedByCompany: true,
    //     appliedByJobSeeker: true,
    //     userId: user.id,
    //   },
    //   raw: true,
    // });
    // if (!matched) throw new ChatAuthenticationError({ message: 'you Can Create Conversation only When matched with JobSeeker' });
    ctx.state.user = user;
    ctx.state.user.company = company;
    ctx.state.user.chatAuthToken = chatAuthToken;
    await next();
  }

  static async asChatRemoveAccess(ctx, next) {
    console.log('=====> asCompanyUserData <=====');
    const { _id } = await globalAuth.authenticate(ctx);
    const user = await User.findOne({
      where: { id: _id },
      attributes: [
        'id',
        'role',
        'email',
        'avatar',
      ],
      raw: true,
    });

    if (!user) {
      throw new ChatAuthenticationError({ message: errorDetails.PERMISSION_DENIED });
    }

    const chatAuthToken = await ChatAuthTokens.findOne({
      where: { userId: user.id },
      raw: true,
    });

    if (!chatAuthToken) throw new ChatAuthenticationError({ message: 'Chat Authorization token Required' });

    // const chatAuthToken = await ChatAuthClass.getChatAuthToken(ctx.request.headers);

    // const tokenExists = await ChatAuthTokens.findOne({
    //   where: {
    //     userId: user.id,
    //     authToken: chatAuthToken,
    //   },
    //   raw: true,
    // });
    //
    // if (!tokenExists) throw new ChatAuthenticationError({ message: 'Invalid Chat AuthToken' });

    ctx.state.user = user;
    ctx.state.user.chatAuthToken = chatAuthToken;
    await next();
  }

  static async getChatAuthToken(headers) {
    console.log('===> getChatAuthToken <===');
    if (!headers || !headers.chatauthtoken) {
      throw new ChatAuthenticationError({ message: 'Chat Authorization token Required' });
    }

    const parted = headers.chatauthtoken.split(' ');

    if (parted.length) {
      return parted[0];
    }
    throw new ChatAuthenticationError({ message: 'Invalid Chat Authorization Token' });
  }
}

module.exports = ChatAuthClass;
