const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Done!');
    }, 1500);
  });
};

setTimeout(() => {
  console.log('Timer is done');
  fetchData()
    .then((data) => {
      console.log(data);
      return fetchData();
    })
    .then((data2) => {
      console.log(data2);
    });
}, 1);

console.log('Hello');
console.log('Hi');

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Text');
  }, 2000);
});

promise
  .then((data) => {
    return 'Chain promise with data: ' + data;
  })
  .then((message) => {
    console.log(message);
  });

const asyncAwaitCode = async () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Async - Await');
    }, 2000);
  });

  const message = await promise;
  console.log(await promise);
  // console.log(message);
};

asyncAwaitCode();
