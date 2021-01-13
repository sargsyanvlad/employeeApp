

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      {
        tableName: 'Degree',
        schema: 'public',
      },
      [
        { type: 'High school degree', weight: 1 },
        { type: 'Associate degree', weight: 2 },
        { type: 'Bachelors degree', weight: 3 },
        { type: 'Master\'s degree', weight: 4 },
        { type: 'PhD', weight: 5 },
        { type: 'N/A', weight: 0 },
      ],
    );
  }
};
