

module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    {
      tableName: 'Packages',
      schema: 'public',
    },
    [
      {
        for: 'company',
        name: 'Additional JobPosting 1',
        extraData: JSON.stringify({
          type: 'JobPosting',
          jobPostingCount: 1,
        }),
      },
      {
        for: 'company',
        name: 'Additional JobPosting 5',
        extraData: JSON.stringify({
          type: 'JobPosting',
          jobPostingCount: 5,
        }),
      },
      {
        for: 'company',
        name: 'Additional JobPosting 10',
        extraData: JSON.stringify({
          type: 'JobPosting',
          jobPostingCount: 10,
        }),
      },
      {
        for: 'company',
        name: 'Additional JobPosting Upgraded 5',
        extraData: JSON.stringify({
          type: 'JobPosting',
          jobPostingCount: 5,
        }),
      },
      {
        for: 'company',
        name: 'Additional JobPosting Upgraded 10',
        extraData: JSON.stringify({
          type: 'JobPosting',
          jobPostingCount: 10,
        }),
      },
      {
        for: 'company',
        name: 'Additional JobPosting Premium 1',
        extraData: JSON.stringify({
          type: 'JobPosting',
          jobPostingCount: 1,
        }),
      },
      {
        for: 'company',
        name: 'Additional JobPosting Premium 5',
        extraData: JSON.stringify({
          type: 'JobPosting',
          jobPostingCount: 5,
        }),
      },
      {
        for: 'company',
        name: 'Additional JobPosting Premium 10',
        extraData: JSON.stringify({
          type: 'JobPosting',
          jobPostingCount: 10,
        }),
      },
    ],
  ),
};
