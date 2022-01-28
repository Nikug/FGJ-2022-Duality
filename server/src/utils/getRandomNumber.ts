/**
 * Returns random number from given range.
 * @param {string} min - Included in the range.
 * @param {string} max - Not included in the range.
 */
function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
