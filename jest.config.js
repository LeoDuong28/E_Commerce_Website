/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "lib/**/*.js",
    "models/**/*.js",
    "app/api/**/*.js",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 10000,
};

module.exports = config;
