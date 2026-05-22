const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  console.log('Vercel env validation skipped outside Vercel.');
  process.exit(0);
}

const missing = required.filter((key) => !process.env[key]);
const invalid = [];

if (process.env.VITE_FIREBASE_API_KEY && !process.env.VITE_FIREBASE_API_KEY.startsWith('AIza')) {
  invalid.push('VITE_FIREBASE_API_KEY must start with AIza');
}

if (process.env.VITE_FIREBASE_AUTH_DOMAIN && !process.env.VITE_FIREBASE_AUTH_DOMAIN.endsWith('.firebaseapp.com')) {
  invalid.push('VITE_FIREBASE_AUTH_DOMAIN must end with .firebaseapp.com');
}

if (process.env.VITE_FIREBASE_APP_ID && !process.env.VITE_FIREBASE_APP_ID.includes(':web:')) {
  invalid.push('VITE_FIREBASE_APP_ID must contain :web:');
}

if (missing.length || invalid.length) {
  console.error('\nFirebase environment variables are not ready for Vercel deployment.');
  if (missing.length) console.error(`Missing: ${missing.join(', ')}`);
  if (invalid.length) console.error(`Invalid: ${invalid.join(', ')}`);
  console.error('\nSet them in Vercel Project Settings > Environment Variables, then redeploy.\n');
  process.exit(1);
}

console.log('Vercel Firebase env validation passed.');
