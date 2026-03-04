export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const aabbIntersects = (a, b) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;
