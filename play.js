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

const copiedPerson = { ...person };

person.greet();
copiedPerson.greet();

const hobbies = ['Sport', 'Coding', 'Walking'];
for (let hobby of hobbies) {
  console.log(hobby);
}
console.log(hobbies.map((hobby) => 'Hobby: ' + hobby));
console.log(hobbies);

hobbies.push('Swimming');

console.log(hobbies);

// const copiedArray = hobbies.slice();
// const copiedArray = [hobbies]; // Nested array, not a spread operator
const copiedArray = [...hobbies];

console.log(copiedArray);

const printHobbies = (...hobbies) => {
  for (let hobby of hobbies) {
    console.log(hobby);
  }
};

printHobbies('Hiking', 'Cooking');

const product = {
  type: 'GOOD',
  quantity: 20,
};

const { type, quantity } = product;

console.log(type, quantity);

const [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);

const printName = ({ name }) => {
  console.log(`My name is ${name}`);
};

printName(person);
