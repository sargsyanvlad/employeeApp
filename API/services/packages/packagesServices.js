/* eslint-disable no-console */
const {
  CompanyPackages, Packages, UserPackages, sequelize,
} = require('../../../data/models');
const exceptions = require('../../../modules/exceptions');
const moment = require('moment');
const iap = require('in-app-purchase');
// const iap = require('iap');

iap.config({
  /* Configurations for Apple */
  // if you want to exclude old transaction, set this to true. Default is false
  appleExcludeOldTransactions: false,
  applePassword: '5486522ff5e7414785e8d8beee437dd6', // this comes from iTunes Connect (You need this to valiate subscriptions)
  test: false, // For Apple and Googl Play to force Sandbox validation only
  verbose: true, // Output debug logs to stdout stream
});

// function onSuccess(validatedData) {
//   // validatedData: the actual content of the validated receipt
//   // validatedData also contains the original receipt
//   const options = {
//     ignoreCanceled: true, // Apple ONLY (for now...): purchaseData will NOT contain cancceled items
//     ignoreExpired: true, // purchaseData will NOT contain exipired subscription items
//   };
//   // validatedData contains sandbox: true/false for Apple and Amazon
//   const purchaseData = iap.getPurchaseData(validatedData, options);
//   return purchaseData;
// }
//
// function onError(error) {
//   console.log('ererere', error);
//   throw error;
// }

const { Op } = sequelize;

exports.getSuggestedPackages = async (user) => {
  const ids = [1, 2, 3, 4, 5, 6, 7, 8];

  if (user.role === 'company') {
    let packages = await CompanyPackages.findAll({
      attributes: ['PackageId'],
      where: {
        userId: user.id,
        companyId: user.company.id,
        PackageId: {
          [Op.or]: [4, 5],
        },
        validThru: { [Op.gte]: new Date() },
        exhausted: false,
      },
      raw: true,
    });
    packages = packages.map(item => item.PackageId);

    if (packages.includes(5)) {
      ids.push(11, 12, 13);
    } else if (packages.includes(4)) {
      ids.push(9, 10);
    }
  }


  const suggestedPackages = await Packages.findAll({
    attributes: ['name', 'extraData', 'id'],
    where: {
      for: user.role,
      id: {
        [Op.in]: ids,
      },
    },
  });
  return { success: true, suggestedPackages };
};

exports.buyPackage = async (user, packageId, data) => {
  console.log('======> buyPackage <======');
  const {
    metaData
  } = data;
  const packages = {
    PremiumUser: 1,
    WhoSwipedOnYou: 2,
    barevMez: 3,
    hajoxCez: 4,
  };
    // const forPremium = [11, 12, 13];
    // const forUpgraded = [9, 10];

  const validThru = moment().add(2, 'day').format();
  // const pack = await Packages.findOne({
  //   where: {
  //     id: packageId,
  //     for: user.role,
  //   },
  //   raw: true,
  // });
  //
  // if (!pack) throw new exceptions.SomethingWentWrong({ message: 'Incorrect Package' });

  // let companyPackages = await CompanyPackages.findAll({
  //   attributes: ['PackageId'],
  //   where: {
  //     userId: user.id,
  //     companyId: user.company.id,
  //     PackageId: {
  //       [Op.or]: [4, 5],
  //     },
  //     validThru: { [Op.gte]: new Date() },
  //     exhausted: false,
  //   },
  //   raw: true,
  // });
  //
  // companyPackages = companyPackages.map(item => item.PackageId);

  // const isPremium = companyPackages.includes(5) || false;
  // const isUpgraded = companyPackages.includes(4) || false;
  let boughtPack;
  if (user.role === 'company') {
    // if (!isPremium && forPremium.includes(parseInt(packageId, 0))) throw new exceptions.SomethingWentWrong({ message: 'You Can Buy this Package Only After When Premium' });
    // if (!isUpgraded && forUpgraded.includes(parseInt(packageId, 0))) throw new exceptions.SomethingWentWrong({ message: 'You Can Buy this Package Only After When Upgraded' });

    boughtPack = await CompanyPackages.create({
      userId: user.id,
      companyId: user.Company.id,
      PackageId: packages[packageId],
      validThru,
      // Note should be uncommented
      // packageData: pack.extraData,
      metaData,
      packageData: { jobPostingCount: 1000 },
    });

    // const jobPostingCount = boughtPack.packageData.jobPostingCount || 0;

    // await Company.update({ jobPostingHave: sequelize.literal(`"jobPostingHave"+${parseInt(jobPostingCount, 10)}`) }, {
    //   where: {
    //     userId: user.id,
    //   },
    // });
  } else {
    boughtPack = await UserPackages.create({
      userId: user.id,
      jobSeekerId: user.jobSeeker.id,
      PackageId: packages[packageId],
      validThru,
      // packageData: pack.extraData,
      metaData,
      packageData: {},
    });
    // const swipeCount = boughtPack.packageData.swipeCount || 0;
    // await User.update({ swipeLimit: sequelize.literal(`"swipeLimit"+${parseInt(swipeCount, 10)}`) }, {
    //   where: {
    //     id: user.id,
    //   },
    // });
  }

  return { success: true, boughtPack };
};


exports.validateReceipt = async (user, body) => {
  try {
    // const platform = 'apple';
    // const payment = {
    //   receipt: process.env.RECEIPT, // always required
    //   productId: 'WhoSwipedOnYou',
    //   packageName: 'com.mployd.dev',
    //   secret: '5486522ff5e7414785e8d8beee437dd6',
    //   // optional, if google play subscription
    //   subscription: true,
    //   transactionId: '1000000572869057',
    // };
    // // await iap.setup();
    // iap.verifyPayment(platform, payment, (error, response) => {
    //   if (error) throw error;
    //   console.log('response', response);
    // });

    await iap.setup();
    const response = await iap.validate(body.receipt);
    const yes = await iap.isValidated(response);
    const res = await iap.getPurchaseData(response, {
      ignoreCanceled: true,
      ignoreExpired: true,
    });
    // console.log('validated', validated)
    return {
      success: true, response, res, yes,
    };
  } catch (e) {
    console.log('errrrrr', e);
    throw new exceptions.InvalidUserInput({ message: e.message });
  }
};
