/**
 * Returns random number from given range.
 * @param {number} min - Included in the range.
 * @param {number} max - Not included in the range.
 */
export default function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const flipCoin = () => Math.floor(Math.random() * 2) == 0;
