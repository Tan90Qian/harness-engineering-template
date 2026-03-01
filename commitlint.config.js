/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Customize scopes for your project
    // Run `node scripts/setup.js` to configure automatically
    'scope-enum': [
      2,
      'always',
      ['all', 'core', 'docs', 'ci', 'deps'],
    ],
    'subject-max-length': [2, 'always', 72],
  },
};
