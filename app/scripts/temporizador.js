/**
 * Return a promise that act like a Timer based on miliseconds
 *
 * Create 2 timeOuts. The first one trigger resolv with resolvFunction when miliseconds passed.
 * The second one trigger reject with rejectFunction when the double of the miliseconds passed and
 * something went wrong in the first timeOut
 *
 * @param {Int} miliseconds
 * @param {Function} resolvFunction Function to send to resolv
 * @param {Function} rejectFunction Function to send to reject
 * @returns {promise} promise
 */
function setTimer(miliseconds, resolvFunction, rejectFunction) {
  let promise = new Promise((resolv, reject) => {
    var resolvTimer = setTimeout(() => {
      clearTimeout(rejectTimer);
      resolv(resolvFunction);
    }, miliseconds);

    var rejectTimer = setTimeout(() => {
      reject(rejectFunction);
    }, miliseconds * 2);
  });

  return promise;
}

// Export these function so we can use it elsewhere
export { setTimer };
