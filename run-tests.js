import { execSync } from 'child_process';

console.log('Running tests...');
try {
  const output = execSync('npx jest', { stdio: 'inherit' });
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Tests failed with error:', error.message);
  process.exit(1);
}