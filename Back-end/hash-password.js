import bcrypt from 'bcrypt';

// Gerar hash da senha "1234"
const password = '1234';
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Senha original:', password);
console.log('Senha criptografada:', hashedPassword);
console.log('\nUse este comando no MongoDB:');
console.log(`db.users.updateOne({ email: "maju@gmail.com" }, { $set: { password: "${hashedPassword}" } })`);
