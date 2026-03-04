const T = 32;

export const LEVELS = [
  {
    id: 'level-1',
    size: { width: 120 * T, height: 24 * T },
    playerSpawn: { x: 2 * T, y: 15 * T },
    platforms: [
      { x: 0, y: 22 * T, width: 120 * T, height: 2 * T },
      { x: 9 * T, y: 18 * T, width: 6 * T, height: T / 2 },
      { x: 18 * T, y: 15 * T, width: 7 * T, height: T / 2 },
      { x: 30 * T, y: 19 * T, width: 8 * T, height: T / 2 },
      { x: 42 * T, y: 16 * T, width: 8 * T, height: T / 2 },
      { x: 54 * T, y: 13 * T, width: 10 * T, height: T / 2 },
      { x: 68 * T, y: 17 * T, width: 7 * T, height: T / 2 },
      { x: 82 * T, y: 14 * T, width: 9 * T, height: T / 2 },
      { x: 98 * T, y: 11 * T, width: 9 * T, height: T / 2 },
    ],
    enemies: [
      { x: 20 * T, y: 14 * T, patrol: { minX: 18 * T, maxX: 25 * T } },
      { x: 84 * T, y: 13 * T, patrol: { minX: 82 * T, maxX: 91 * T } },
    ],
    coins: [
      { x: 11 * T, y: 16.5 * T }, { x: 22 * T, y: 13.5 * T }, { x: 34 * T, y: 17.5 * T },
      { x: 46 * T, y: 14.5 * T }, { x: 58 * T, y: 11.5 * T }, { x: 71 * T, y: 15.5 * T },
      { x: 86 * T, y: 12.5 * T }, { x: 101 * T, y: 9.5 * T },
    ],
    hazards: [
      { x: 26 * T, y: 22 * T, width: 4 * T, height: T, hazardType: 'spikes' },
      { x: 75 * T, y: 22 * T, width: 4 * T, height: T, hazardType: 'spikes' },
    ],
    triggers: { levelEndX: 112 * T },
  },
  {
    id: 'level-2',
    size: { width: 130 * T, height: 24 * T },
    playerSpawn: { x: 2 * T, y: 15 * T },
    platforms: [
      { x: 0, y: 22 * T, width: 130 * T, height: 2 * T },
      { x: 8 * T, y: 18 * T, width: 5 * T, height: T / 2 },
      { x: 18 * T, y: 15 * T, width: 5 * T, height: T / 2 },
      { x: 28 * T, y: 12 * T, width: 6 * T, height: T / 2 },
      { x: 42 * T, y: 16 * T, width: 6 * T, height: T / 2 },
      { x: 57 * T, y: 12 * T, width: 6 * T, height: T / 2 },
      { x: 72 * T, y: 16 * T, width: 7 * T, height: T / 2 },
      { x: 88 * T, y: 12 * T, width: 8 * T, height: T / 2 },
      { x: 107 * T, y: 15 * T, width: 9 * T, height: T / 2 },
    ],
    enemies: [
      { x: 29 * T, y: 11 * T, patrol: { minX: 28 * T, maxX: 34 * T } },
      { x: 58 * T, y: 11 * T, patrol: { minX: 57 * T, maxX: 63 * T } },
      { x: 108 * T, y: 14 * T, patrol: { minX: 107 * T, maxX: 116 * T } },
    ],
    coins: [
      { x: 9 * T, y: 16.5 * T }, { x: 19 * T, y: 13.5 * T }, { x: 30 * T, y: 10.5 * T },
      { x: 44 * T, y: 14.5 * T }, { x: 59 * T, y: 10.5 * T }, { x: 74 * T, y: 14.5 * T },
      { x: 90 * T, y: 10.5 * T }, { x: 110 * T, y: 13.5 * T },
    ],
    hazards: [
      { x: 24 * T, y: 22 * T, width: 3 * T, height: T, hazardType: 'pit' },
      { x: 52 * T, y: 22 * T, width: 3 * T, height: T, hazardType: 'pit' },
      { x: 101 * T, y: 22 * T, width: 3 * T, height: T, hazardType: 'pit' },
    ],
    triggers: { levelEndX: 122 * T },
  },
  {
    id: 'level-3',
    size: { width: 140 * T, height: 24 * T },
    playerSpawn: { x: 2 * T, y: 15 * T },
    platforms: [
      { x: 0, y: 22 * T, width: 140 * T, height: 2 * T },
      { x: 10 * T, y: 17 * T, width: 5 * T, height: T / 2 },
      { x: 22 * T, y: 14 * T, width: 5 * T, height: T / 2 },
      { x: 35 * T, y: 11 * T, width: 6 * T, height: T / 2 },
      { x: 50 * T, y: 15 * T, width: 6 * T, height: T / 2 },
      { x: 66 * T, y: 12 * T, width: 6 * T, height: T / 2 },
      { x: 82 * T, y: 9 * T, width: 7 * T, height: T / 2 },
      { x: 100 * T, y: 13 * T, width: 8 * T, height: T / 2 },
      { x: 120 * T, y: 10 * T, width: 9 * T, height: T / 2 },
    ],
    enemies: [
      { x: 23 * T, y: 13 * T, patrol: { minX: 22 * T, maxX: 27 * T } },
      { x: 51 * T, y: 14 * T, patrol: { minX: 50 * T, maxX: 56 * T } },
      { x: 83 * T, y: 8 * T, patrol: { minX: 82 * T, maxX: 89 * T } },
      { x: 121 * T, y: 9 * T, patrol: { minX: 120 * T, maxX: 129 * T } },
    ],
    coins: [
      { x: 11 * T, y: 15.5 * T }, { x: 23 * T, y: 12.5 * T }, { x: 36 * T, y: 9.5 * T },
      { x: 51 * T, y: 13.5 * T }, { x: 67 * T, y: 10.5 * T }, { x: 83 * T, y: 7.5 * T },
      { x: 102 * T, y: 11.5 * T }, { x: 122 * T, y: 8.5 * T },
    ],
    hazards: [
      { x: 16 * T, y: 22 * T, width: 4 * T, height: T, hazardType: 'spikes' },
      { x: 61 * T, y: 22 * T, width: 4 * T, height: T, hazardType: 'spikes' },
      { x: 111 * T, y: 22 * T, width: 4 * T, height: T, hazardType: 'spikes' },
    ],
    triggers: { levelEndX: 133 * T },
  },
];
