export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  setupFiles: ['dotenv/config'],
  testMatch: [
    '**/__tests__/**/*.js'
  ],
};