/* eslint-disable no-underscore-dangle, no-console */
const { User, JobSeeker, UserPackages } = require('../../../data/models');
const { globalAuth } = require('../globalAuth');
const { AuthenticationError, SomethingWentWrong } = require('../../../modules/exceptions');
const errorDetails = require('../../../utils/errorDetails');
// const moment = require('moment');

class JobSeekerAuthClass {
  // static async asSwipe(ctx, next) {
  //     console.log('=====> asSwipe <=====');
  //     // fixme call globalAuth authenticate
  //     const { _id } = await globalAuth.authenticate(ctx);
  //     const user = await User.findOne({
  //       where: { id: _id },
  //       attributes: [
  //         'id',
  //         'role',
  //         'email',
  //         'avatar',
  //       ],
  //       include: [
  //         {
  //           model: JobSeeker,
  //           as: 'jobSeeker',
  //           plain: true,
  //         },
  //       ],
  //       plain: true,
  //     });
  //
  //     if (!user || user.role !== 'jobSeeker' || !user.jobSeeker) {
  //       throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });
  //     }
  //
  //     // Note swipe limitation logic
  //     // const now = moment(new Date());
  //     // const start = moment(user.swipeStarted);
  //     // const duration = moment.duration(now.diff(start)).asHours();
  //     //
  //     // if (!user.swipeStarted) {
  //     //   await User.update({ swipeStarted: now }, { where: { id: user.id } });
  //     // }
  //     //
  //     // if (duration >= 24) {
  //     //   const updatedUser = await User.update({
  //     //     swipeStarted: now,
  //     //     swipeCount: 0,
  //     //   }, { where: { id: user.id }, raw: true, returning: true });
  //     //   user.swipeLimit = updatedUser[1].swipeLimit;
  //     //   user.swipeCount = updatedUser[1].swipeCount;
  //     // }
  //     // Note swipe limitation logic
  //
  //     // const isPremium = await UserPackages.findAll({
  //     //   where: {
  //     //     userId: user.id,
  //     //     PackageId: 3,
  //     //     exhausted: false,
  //     //     validThru: { $gte: new Date() },
  //     //   },
  //     // });
  //     //
  //     // if (isPremium.length) {
  //     //   ctx.state.user = user;
  //     //   return await next();
  //     // }
  //     //
  //     // if (user.swipeCount >= user.swipeLimit) {
  //     //   console.log('user.swipeCount >= user.swipeLimit', user.swipeCount >= user.swipeLimit);
  //     //   throw new SomethingWentWrong({ message: 'You Have Reached Your daily limit of swipe' });
  //     // }
  //     // Note swipe limitation logic end
  //
  //     ctx.state.user = user;
  //     return await next();
  // }

  static async hasJobSeekerPremiumAccess(ctx, next) {
    console.log('====> hasJobSeekerPremiumAccess <=====');
    const { _id } = await globalAuth.authenticate(ctx);

    const user = await User.findOne({
      where: { id: _id },
      include: [
        {
          model: JobSeeker,
          as: 'jobSeeker',
          plain: true,
        },
      ],
      plain: true,
    });

    const packages = await UserPackages.findAll({
      where: {
        userId: user.id,
        PackageId: 3,
        exhausted: false,
        validThru: { $gte: new Date() },
      },
      raw: true,
    });


    if (!packages.length) {
      throw new SomethingWentWrong({ message: 'You Have Not Any active packages' });
    }

    if (!user || user.role !== 'jobSeeker' || !user.jobSeeker) {
      throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });
    }

    ctx.state.user = user;
    ctx.state.user.packages = packages.map(item => item.PackageId);
    await next();
  }

  static async asJobSeeker(ctx, next) {
    console.log('=====> asJobSeeker <=====');
    const { _id } = await globalAuth.authenticate(ctx);
    const user = await User.findOne({
      where: { id: _id },
      attributes: [
        'id',
        'role',
        'email',
        'avatar',
      ],
      include: [
        {
          model: JobSeeker,
          as: 'jobSeeker',
          plain: true,
        },
      ],
      plain: true,
    });
    if (!user || user.role !== 'jobSeeker' || !user.jobSeeker) {
      throw new AuthenticationError({ message: errorDetails.PERMISSION_DENIED });
    }

    const packages = await UserPackages.findAll({
      where: {
        userId: user.id,
        PackageId: 3,
        exhausted: false,
        validThru: { $gte: new Date() },
      },
      raw: true,
    });

    ctx.state.user = user;
    ctx.state.user.packages = packages.map(item => item.PackageId);

    await next();
  }

  static async swipedOnMeAccess(ctx, next) {
    console.log('=====> swipedOnMeAccess <=====');
    const { _id } = await globalAuth.authenticate(ctx);

    const user = await User.findOne({
      where: { id: _id },
      attributes: [
        'id',
        'role',
        'email',
        'avatar',
      ],
      include: [
        {
          model: JobSeeker,
          as: 'jobSeeker',
          plain: true,
        },
      ],
      plain: true,
    });

    const packages = await UserPackages.findAll({
      attributes: ['PackageId'],
      where: {
        userId: user.id,
        PackageId: 1,
        exhausted: false,
        validThru: { $gte: new Date() },
      },
      raw: true,
    });

    if (!packages || !packages.length) {
      throw new AuthenticationError({ message: 'You haven\'t Active Package' });
    }
    ctx.state.user = user;
    await next();
  }
}

module.exports = JobSeekerAuthClass;
