/* eslint-disable no-console */
const {
  Company, CompanyUsers,
  User, Benefit, ResetToken,
  Job, Industry, sequelize
} = require('../../../../data/models/index');
const exceptions = require('../../../../modules/exceptions/index');
const { generateToken } = require('../../../../utils/helpers');
const { mailerService } = require('../../mailer');


exports.getCompanyProfileById = async (companyId) => {
  console.log('=====> getCompanyProfileById <=====');
  const user = await User.findOne({
    attributes: ['email'],
    include: {
      model: Company,
      as: 'Company',
      where: {
        id: companyId,
      },
      required: true,
      plain: true,
      include: [
        {
          model: Industry,
          as: 'type',
          through: { attributes: [] },
          attributes: ['name', 'id'],
        },
        {
          model: Benefit,
          as: 'benefits',
          through: { attributes: [] },
          attributes: ['name', 'id', 'url'],
          plain: true
        },
        {
          model: User,
          as: 'companyUsers',
          through: { attributes: [] },
          required: false,
          attributes: ['role', 'email', 'avatar', 'id', 'position', 'firstName', 'lastName'],
        },
      ],
    },
    plain: true,
  });
  const company = {
    ...user.Company.dataValues,
    email: user.email
  };
  return {
    success: true,
    result: {
      company
    },
  };
};

exports.updateCompanyProfile = async (companyUser, body) => {
  console.log('=====> updateCompanyProfile <=====');
  const transaction = await sequelize.transaction();
  try {
    const {
      name,
      meta,
      phone,
      description,
      location,
      avatar,
      email,
      type,
    } = body;

    const user = await User.findOne({
      where: { id: companyUser.id },
    });
    const company = await Company.findOne({
      where: { id: companyUser.company.id }
    });

    await user.update({ email, avatar }, { transaction });

    await Job.update(
      { companyLogo: avatar },
      { where: { userId: companyUser.id }, transaction },
    );

    await company.update(
      {
        name,
        meta,
        phone,
        description,
        ...location,
        companyLogo: avatar,
      },
      { transaction },
    );

    // const typesArray = types.map(item => item.id);
    // await company.setTypes(types, { transaction });

    await company.setType(type, { transaction });

    await transaction.commit();
    return this.getCompanyProfileById(companyUser.company.id);
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.getCompanyProfile = async user => this.getCompanyProfileById(user.company.id);

exports.addCompanyUser = async (user, userData) => {
  const transaction = await sequelize.transaction();
  try {
    const userCreated = await User.create({ ...userData, role: 'companyUser', completed: true }, { transaction, returning: true });

    await CompanyUsers.create({
      UserId: userCreated.id,
      companyId: user.company.id,
    }, { transaction });

    const setPasswordToken = await generateToken();

    await ResetToken.upsert({ resetToken: setPasswordToken, userId: userCreated.id }, { transaction });

    mailerService.sendCompanyUserRegistrationEmail(userData.email, setPasswordToken);
    await transaction.commit();
    return {
      success: true,
    };
  } catch (err) {
    console.log('errr',err)
    await transaction.rollback();
    throw err;
  }
};

exports.deleteCompanyUser = async (user, companyUserId) => {
  const transaction = await sequelize.transaction();
  try {
    console.log('=====> DeleteCompanyUser <=====');

    const companyUser = await CompanyUsers.findOne({
      where: {
        companyId: user.company.id,
        UserId: companyUserId,
      },
    });

    if (!companyUser) throw new exceptions.InvalidUserInput({ message: 'Incorrect Company User Id' });

    const destroyed = await User.destroy({
      where: {
        id: companyUserId,
      },
    }, { transaction });

    if (!destroyed) throw new exceptions.SomethingWentWrong({ message: 'Cant Delete Company User' });
    await transaction.commit();
    return {
      success: true,
    };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
