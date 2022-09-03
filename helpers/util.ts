export const delayedLoop = (array, callback, i) => {
  setTimeout(() => {
    console.log("\n");
    console.log(i);
    console.log(array[i].ticker);
    callback(array[i].ticker);
    i++;
    if (i < array.length) {
      delayedLoop(array, callback, i);
    }
  }, 220);
};
