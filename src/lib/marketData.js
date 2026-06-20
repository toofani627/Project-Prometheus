// Dummy market data representing crop production in India (approximate latest values)
// Production quantities generally in Million Tonnes, except Cotton which is in Million Bales

export const marketData = [
  {
    crop: 'Rice',
    unit: 'Million Tonnes',
    rankings: [
      { rank: 1, state: 'Uttar Pradesh', production: 15.6 },
      { rank: 2, state: 'Telangana', production: 14.8 },
      { rank: 3, state: 'West Bengal', production: 14.5 },
      { rank: 4, state: 'Punjab', production: 12.2 },
      { rank: 5, state: 'Odisha', production: 8.9 }
    ]
  },
  {
    crop: 'Wheat',
    unit: 'Million Tonnes',
    rankings: [
      { rank: 1, state: 'Uttar Pradesh', production: 35.4 },
      { rank: 2, state: 'Madhya Pradesh', production: 22.8 },
      { rank: 3, state: 'Punjab', production: 17.1 },
      { rank: 4, state: 'Haryana', production: 11.2 },
      { rank: 5, state: 'Rajasthan', production: 9.8 }
    ]
  },
  {
    crop: 'Cotton',
    unit: 'Million Bales (170kg)',
    rankings: [
      { rank: 1, state: 'Maharashtra', production: 8.5 },
      { rank: 2, state: 'Gujarat', production: 7.9 },
      { rank: 3, state: 'Telangana', production: 5.2 },
      { rank: 4, state: 'Rajasthan', production: 2.8 },
      { rank: 5, state: 'Haryana', production: 1.9 }
    ]
  },
  {
    crop: 'Sugarcane',
    unit: 'Million Tonnes',
    rankings: [
      { rank: 1, state: 'Uttar Pradesh', production: 198.5 },
      { rank: 2, state: 'Maharashtra', production: 112.4 },
      { rank: 3, state: 'Karnataka', production: 62.1 },
      { rank: 4, state: 'Tamil Nadu', production: 18.2 },
      { rank: 5, state: 'Bihar', production: 13.9 }
    ]
  },
  {
    crop: 'Maize',
    unit: 'Million Tonnes',
    rankings: [
      { rank: 1, state: 'Madhya Pradesh', production: 5.1 },
      { rank: 2, state: 'Karnataka', production: 4.8 },
      { rank: 3, state: 'Bihar', production: 3.5 },
      { rank: 4, state: 'Maharashtra', production: 3.2 },
      { rank: 5, state: 'Telangana', production: 2.9 }
    ]
  }
];
