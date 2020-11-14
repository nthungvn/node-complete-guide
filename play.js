const name = 'Hung';
let age = 28;
const isHobbies = true;

age = 29;

// const getSummary = function (name, age, isHobbies) { // Function expression
const getSummary = (name, age, isHobbies) => {
  return (
    'My name is ' + name + ', age is ' + age + ' and has hobbies ' + isHobbies
  );
};

console.log(getSummary(name, age, isHobbies));

const person = {
  name: 'Hung',
  age: 28,
  // greet: () => { // Ignore this keyword
  // greet: function () {
  greet() {
    console.log('Hi, my name is', this.name);
  },
};

person.greet();

const hobbies = ['Sport', 'Coding', 'Walking'];
for (let hobby of hobbies) {
  console.log(hobby);
}
console.log(hobbies.map((hobby) => 'Hobby: ' + hobby));
console.log(hobbies);

hobbies.push('Swimming');

console.log(hobbies);
