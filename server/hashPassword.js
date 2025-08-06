// hashPassword.js
const bcrypt = require('bcrypt');

async function generateHashedPassword() {
  const plainPassword = 'Admin@000';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('Hashed password:', hashedPassword);
}

generateHashedPassword();
