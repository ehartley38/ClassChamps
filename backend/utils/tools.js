// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

const generateCode = (length) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// Calculate XP gained from assignment submission
// Each time a user completes an assignment, XP gained is halved and rounded to the nearest 5
// 200 is the constant
const xpCalculator = (submissionCount) => {
  let xp = (200 / Math.pow(2, submissionCount))
  let roundedXp = Math.ceil(xp/5)*5
  
  return roundedXp
}

module.exports = { generateCode, xpCalculator }