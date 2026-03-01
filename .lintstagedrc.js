module.exports = {
  '*.{ts,tsx}': ['pnpm exec eslint --fix', 'pnpm exec prettier --write'],
  '*.vue': ['pnpm exec eslint --fix', 'pnpm exec prettier --write'],
  '*.{js,cjs,mjs}': ['pnpm exec eslint --fix', 'pnpm exec prettier --write'],
  '*.{json,md,yaml,yml}': ['pnpm exec prettier --write'],
};
