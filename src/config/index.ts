export const port = process.env.PORT || 3000;
console.log('🚀 ~ process.env.PORT', process.env.PORT);

if (process.env.MODE === 'dev') {
  console.log('🚀 ~ process.env.MODE_true', process.env.MODE);
} else {
  console.log('🚀 ~ process.env.MODE_false', process.env.MODE);
}
