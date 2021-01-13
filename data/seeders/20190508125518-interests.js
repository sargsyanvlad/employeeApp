module.exports = {

  async up(queryInterface) {
    await queryInterface.bulkInsert(
      { tableName: 'Interests', schema: 'public' },
      [
        { name: 'Accountant' },
        { name: 'Accounting - Assessor' },
        { name: 'Accounting - Auditor' },
        { name: 'Accounting - Bookkeeper' },
        { name: 'Accounting - Budget Analyst' },
        { name: 'Accounting - Tax Specialist' },
        { name: 'Administrative Assistant/Secretary' },
        { name: 'Animal Trainer' },
        { name: 'Arts - Animator ' },
        { name: 'Arts - Graphic Designer' },
        { name: 'Arts - Illustrator' },
        { name: 'Arts - Photography' },
        { name: 'Arts - Actor' },
        { name: 'Arts - Architect' },
        { name: 'Arts - Art Appraiser' },
        { name: 'Arts - Art Auctioneer' },
        { name: 'Arts - Artist' },
        { name: 'Arts - Museum Jobs' },
        { name: 'Arts - Music Conductor' },
        { name: 'Assistant' },
        { name: 'Aviation' },
        { name: 'Aviation - Aircraft Dispatcher' },
        { name: 'Aviation - Aircraft Mechanic' },
        { name: 'Aviation - Airline Pilot' },
        { name: 'Aviation - Flight Attendant' },
        { name: 'Bank Teller' },
        { name: 'Brand Partnerships' },
        { name: 'Business Consultant' },
        { name: 'Business Development' },
        { name: 'Business Management' },
        { name: 'Call Center' },
        { name: 'Concierge' },
        { name: 'Dialect Coach' },
        { name: 'Digital Media' },
        { name: 'Doorman' },
        { name: 'Driver' },
        { name: 'Entertainment - A&R' },
        { name: 'Entertainment - Audio Engineer Technician ' },
        { name: 'Entertainment - Booking Agent' },
        { name: 'Entertainment - Boom Operator' },
        { name: 'Entertainment - Broadcast Technician' },
        { name: 'Entertainment - Cinematographer' },
        { name: 'Entertainment - Concert Promoter' },
        { name: 'Entertainment - Costume Designer' },
        { name: 'Entertainment - Director' },
        { name: 'Entertainment - Film ' },
        { name: 'Entertainment - Lighting Technician' },
        { name: 'Entertainment - Mixing Engineer' },
        { name: 'Entertainment - Music Journalist ' },
        { name: 'Entertainment - Music Publisher ' },
        { name: 'Entertainment - Music ' },
        { name: 'Entertainment - Musician' },
        { name: 'Entertainment - News Anchor ' },
        { name: 'Entertainment - Performing Artist ' },
        { name: 'Entertainment - Producer' },
        { name: 'Entertainment - Production Designer' },
        { name: 'Entertainment - Prop Maker ' },
        { name: 'Entertainment - Radio Announcer ' },
        { name: 'Entertainment - Recording Engineer ' },
        { name: 'Entertainment - Sound Effects Editor ' },
        { name: 'Entertainment - Sound Plugger ' },
        { name: 'Entertainment - Studio Cheif ' },
        { name: 'Entertainment - Stunt Performer ' },
        { name: 'Entertainment - Television' },
        { name: 'Entertainment - Television Editor ' },
        { name: 'Entertainment - Television Producer ' },
        { name: 'Entertainment - Voice Actor ' },
        { name: 'Entertainment - Writer' },
        { name: 'Esthetician' },
        { name: 'Event Planner' },
        { name: 'Finance' },
        { name: 'Finance - Analyst' },
        { name: 'Finance - Credit Analyst' },
        { name: 'Finance - Credit Manager' },
        { name: 'Finance - Financial Planner' },
        { name: 'Finance - Hedge Fund Manager' },
        { name: 'Finance - Hedge Fund Principal' },
        { name: 'Finance - Hedge Fund Trader' },
        { name: 'Finance - Investment Advisor' },
        { name: 'Finance - Investment Banker' },
        { name: 'Finance - Investor Relations Officer' },
        { name: 'Finance - Leveraged Buyout Officer' },
        { name: 'Finance - Loan Officer' },
        { name: 'Finance - Mortgage Banker' },
        { name: 'Finance - Mutual Fund Analyst' },
        { name: 'Finance - Portfolio Management Marketing' },
        { name: 'Finance - Portfolio Manager' },
        { name: 'Finance - Ratings Analyst ' },
        { name: 'Finance - Stockbroker' },
        { name: 'Finance - Trust Officer' },
        { name: 'Finance - Weath Manager' },
        { name: 'Fundraiser' },
        { name: 'Funeral Director' },
        { name: 'Gaffer' },
        { name: 'Hair Stylist' },
        { name: 'HR' },
        { name: 'HR - Benefits Officer' },
        { name: 'HR - Compensation Analyst' },
        { name: 'HR - Employee Relations ' },
        { name: 'HR - Retirement Plan Counseling' },
        { name: 'HR - Staffing' },
        { name: 'HR - Union Organization' },
        { name: 'Insurance' },
        { name: 'Insurance - Actuary' },
        { name: 'Insurance - Claims Adjuster' },
        { name: 'Insurance - Damage Appraiser' },
        { name: 'Insurance - Insurance Agent' },
        { name: 'Insurance - Insurance Appraiser' },
        { name: 'Insurance - Insurance Broker' },
        { name: 'Insurance - Insurance Claims Examiner ' },
        { name: 'Insurance - Loss Control Specialist' },
        { name: 'Insurance - Underwriter' },
        { name: 'Insurance - Insurance Investigator' },
        { name: 'Intern' },
        { name: 'IT' },
        { name: 'IT - Computer Network Architect' },
        { name: 'IT - Content Manager' },
        { name: 'IT - Content Strategist' },
        { name: 'IT - Database Administrator' },
        { name: 'IT - Digital Marketing Manager' },
        { name: 'IT - Full Stack Developer' },
        { name: 'IT - Information Architect' },
        { name: 'IT - Marketing Technolgist' },
        { name: 'IT - Mobile Developer' },
        { name: 'IT - Network Administrator' },
        { name: 'IT - Project Manager' },
        { name: 'IT - Social Media Manager' },
        { name: 'IT - Software Developer' },
        { name: 'IT - Software Engineer ' },
        { name: 'IT - Systems Administrator ' },
        { name: 'IT - Systems Engineer' },
        { name: 'IT - Web Analytics Developer' },
        { name: 'IT - Web Developer' },
        { name: 'IT - Webmaster' },
        { name: 'IT - Business Systems Analyst' },
        { name: 'IT - User Interface Specialist' },
        { name: 'Janitor' },
        { name: 'Journalist' },
        { name: 'Lawyer' },
        { name: 'Makeup Artist' },
        { name: 'Market Development' },
        { name: 'Market Research Analyst' },
        { name: 'Marketing' },
        { name: 'Media' },
        { name: 'Media - Book Publishing' },
        { name: 'Media - Freelance Editor' },
        { name: 'Media - Freelance Writer' },
        { name: 'Media - PR' },
        { name: 'Media - Writer/Editor' },
        { name: 'Medical - Dermatologist ' },
        { name: 'Medical - Doctor ' },
        { name: 'Medical - Nurse ' },
        { name: 'Medical - Paramedic ' },
        { name: 'Medical - Psychologist' },
        { name: 'Medical - Social Worker' },
        { name: 'Medical - Veterinarian' },
        { name: 'Medical ' },
        { name: 'Music Teacher ' },
        { name: 'Nonprofit Job' },
        { name: 'Personal Fitness Trainer' },
        { name: 'Photography ' },
        { name: 'Physical Therapist' },
        { name: 'PR' },
        { name: 'Production' },
        { name: 'Publicist' },
        { name: 'Purchasing' },
        { name: 'Quality Assurance' },
        { name: 'R&D' }, //
        { name: 'Real Estate - Buisness Transfer Agent ' },
        { name: 'Real Estate - Business Broker' },
        { name: 'Real Estate - Commercial Appraiser' },
        { name: 'Real Estate - Commercial Real Estate Agent' },
        { name: 'Real Estate - Commercial Real Estate Broker' },
        { name: 'Real Estate - Developer' },
        { name: 'Real Estate - Officer' },
        { name: 'Real Estate - Real Estate Appraiser ' },
        { name: 'Real Estate - Residential Real Estate Agent ' },
        { name: 'Real Estate - Residential Real Estate Broker ' },
        { name: 'Real Estate - Residential Appraiser' },
        { name: 'Recreation Worker' },
        { name: 'Retail' },
        { name: 'Sales' },
        { name: 'Security' },
        { name: 'Ski Instructor ' },
        { name: 'Sports' },
        { name: 'Sports - Athletic Trainer ' },
        { name: 'Sports - Coach' },
        { name: 'Sports - Equipment Manager' },
        { name: 'Sports - Event Planner' },
        { name: 'Sports - Management ' },
        { name: 'Sports - Photography' },
        { name: 'Sports - Umpire/Refree' },
        { name: 'Sports Psychologist' },
        { name: 'Sports - Fitness Director ' },
        { name: 'Start-up' },
        { name: 'Statistician' },
        { name: 'Teaching' },
        { name: 'Teaching - Career Councelor' },
        { name: 'Teaching - Teaching Abroad' },
        { name: 'Teaching - Teaching Online' },
        { name: 'Teaching - School Jobs' },
        { name: 'Teaching - Substitute Teacher' },
        { name: 'Teaching - Teacher' },
        { name: 'Technology' },
        { name: 'Technology - Video Game Desinger' },
        { name: 'Technology - App Designer ' },
        { name: 'Technology - App Developer' },
        { name: 'Technology - Computer Programmer' },
        { name: 'Technology - Database Administrator' },
        { name: 'Technology - Programmer' },
        { name: 'Technology - Software Developer' },
        { name: 'Technology - UX/UI ' },
        { name: 'Technology - Web Designer' },
        { name: 'Technology - Web Developer' },
        { name: 'Wedding Planner' },
        { name: 'Writer' },
      ],
    );
  }
};