/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 按项目实际自定义 scope
    // 运行 `node scripts/setup.js` 自动配置
    'scope-enum': [
      2,
      'always',
      ['all', 'core', 'docs', 'ci', 'deps'],
    ],
    'subject-max-length': [2, 'always', 72],
  },
};
