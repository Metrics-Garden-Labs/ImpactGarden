import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
console.log(`Reading environment variables from: ${envPath}`);

const envContent = fs.readFileSync(envPath, { encoding: 'utf8' });
console.log(`.env.local content:\n${envContent}`);
