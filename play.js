const name = 'Hung';
let age = 28;
const isHobbies = true;

age = 29;

function getSummary(name, age, isHobbies) {
  return (
    'My name is ' + name + ', age is ' + age + ' and has hobbies ' + isHobbies
  );
}

console.log(getSummary(name, age, isHobbies));
