const fetch = (callback) => {
  setTimeout(() => {
    callback('Text');
    console.log('Done');
  }, 1500);
};

setTimeout(() => {
  console.log('Timer is done');
  fetch((text) => {
    console.log(text);
  });
}, 1);

console.log('Hello');
console.log('Hi');
