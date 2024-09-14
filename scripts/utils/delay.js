/**
 * 
 * @param {number} ms 
 * @returns 
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}