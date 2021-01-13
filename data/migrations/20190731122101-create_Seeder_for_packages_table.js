

module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    {
      tableName: 'Packages',
      schema: 'public',
    },
    [
      {
        for: 'jobSeeker',
        name: 'SwipedOnMe',
        extraData: JSON.stringify({
          swipeCount: 10,
        }),
      },
      {
        for: 'jobSeeker',
        name: 'Boosted',
        extraData: JSON.stringify({ boosted: true }),
      },
      {
        for: 'jobSeeker',
        name: 'Premium',
        extraData: JSON.stringify({
          unlimitedSwipes: true,
          unlimitedMatches: true,
          hasJobFiltering: true,
        }),
      },
      {
        for: 'company',
        name: 'Upgraded',
        extraData: JSON.stringify({
          type: 'JobPosting',
          swipeCount: true,
          seeMatchesCount: 5,
          jobPostingCount: 1,
          hasDiscount: true,
        }),
      },
      {
        for: 'company',
        name: 'Premium',
        extraData: JSON.stringify({
          type: 'JobPosting',
          swipeCount: true,
          seeMatchesCount: true,
          jobPostingCount: 5,
          hasDiscount: true,
        }),
      },
    ],
  ),
};
