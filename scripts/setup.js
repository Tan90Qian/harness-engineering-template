#!/usr/bin/env node

/**
 * Harness Engineering Template - 交互式初始化脚本
 *
 * 用法：
 *   node scripts/setup.js
 *
 * 此脚本为你的项目定制模板：
 *   1. 项目名称和描述
 *   2. 包管理器（pnpm / npm / yarn）
 *   3. Monorepo 模式（可选：自动创建 pnpm-workspace.yaml + turbo.json）
 *   4. 提交 scope（按项目自定义）
 *   5. 初始化 git + husky
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// ── Helpers ──

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

function ask(rl, question, defaultValue) {
  const suffix = defaultValue ? ` (${defaultValue})` : '';
  return new Promise((resolve) => {
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

function run(cmd) {
  console.log(`  → ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

// ── Main ──

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n🔧 Harness Engineering Template 初始化\n');

  // 1. 基本信息
  const projectName = await ask(rl, '项目名称', 'my-project');
  const projectDesc = await ask(rl, '项目描述', '一个新项目');

  // 2. 包管理器
  const pm = await ask(rl, '包管理器 (pnpm/npm/yarn)', 'pnpm');

  // 3. Monorepo
  const isMonorepo = (await ask(rl, '是否启用 Monorepo？(y/n)', 'n')).toLowerCase() === 'y';
  let workspacePackages = '';
  if (isMonorepo) {
    workspacePackages = await ask(rl, '工作空间包路径 glob', 'packages/*');
  }

  // 4. 提交 scope
  const defaultScopes = isMonorepo ? 'all,core,docs,ci,deps' : 'all,core,docs,ci,deps';
  const scopesInput = await ask(rl, '提交 scope（逗号分隔）', defaultScopes);
  const scopes = scopesInput.split(',').map((s) => s.trim()).filter(Boolean);

  // 5. Node 版本
  const nodeVersion = await ask(rl, '最低 Node.js 版本', '18');

  rl.close();

  console.log('\n📦 正在配置项目...\n');

  // ── Apply configuration ──

  // package.json
  const pkg = readJson(path.join(ROOT, 'package.json'));
  pkg.name = projectName;
  pkg.description = projectDesc;
  if (nodeVersion) {
    pkg.engines = { node: `>=${nodeVersion}` };
  }

  if (pm === 'pnpm') {
    pkg.packageManager = 'pnpm@9.15.4';
    pkg.engines = { ...pkg.engines, pnpm: '>=9.0.0' };
  }

  // 根据包管理器调整 lint-staged 命令
  if (pm !== 'pnpm') {
    const lintStagedPath = path.join(ROOT, '.lintstagedrc.js');
    let content = fs.readFileSync(lintStagedPath, 'utf-8');
    const execCmd = pm === 'yarn' ? 'yarn' : 'npx';
    content = content.split('pnpm exec').join(execCmd);
    fs.writeFileSync(lintStagedPath, content, 'utf-8');
  }

  writeJson(path.join(ROOT, 'package.json'), pkg);

  // commitlint.config.js — update scopes
  const commitlintPath = path.join(ROOT, 'commitlint.config.js');
  const scopeArrayStr = scopes.map((s) => `'${s}'`).join(', ');
  let commitlintContent = fs.readFileSync(commitlintPath, 'utf-8');
  commitlintContent = commitlintContent.replace(
    /\['all', 'core', 'docs', 'ci', 'deps'\]/,
    `[${scopeArrayStr}]`,
  );
  fs.writeFileSync(commitlintPath, commitlintContent, 'utf-8');

  // .ai-rules.md — replace placeholders
  replaceInFile(path.join(ROOT, '.ai-rules.md'), {
    '{{PROJECT_NAME}}': projectName,
    '{{PROJECT_DESCRIPTION}}': projectDesc,
    "`all` | `core`": scopes.map((s) => `\`${s}\``).join(' | '),
  });

  // CI workflow — adjust package manager
  const ciPath = path.join(ROOT, '.github', 'workflows', 'ci.yml');
  if (pm !== 'pnpm') {
    let ciContent = fs.readFileSync(ciPath, 'utf-8');
    if (pm === 'npm') {
      ciContent = ciContent
        .replace(/# pnpm\n\s+- name: Setup pnpm[\s\S]*?version: 9\n/m, '')
        .replace(/cache: 'pnpm'/g, "cache: 'npm'")
        .replace(/pnpm install --frozen-lockfile/g, 'npm ci')
        .replace(/pnpm /g, 'npm run ');
    } else if (pm === 'yarn') {
      ciContent = ciContent
        .replace(/# pnpm\n\s+- name: Setup pnpm[\s\S]*?version: 9\n/m, '')
        .replace(/cache: 'pnpm'/g, "cache: 'yarn'")
        .replace(/pnpm install --frozen-lockfile/g, 'yarn install --frozen-lockfile')
        .replace(/pnpm /g, 'yarn ');
    }
    fs.writeFileSync(ciPath, ciContent, 'utf-8');
  }

  // Monorepo setup
  if (isMonorepo) {
    // pnpm-workspace.yaml
    if (pm === 'pnpm') {
      const wsContent = `packages:\n  - '${workspacePackages}'\n`;
      fs.writeFileSync(path.join(ROOT, 'pnpm-workspace.yaml'), wsContent, 'utf-8');
    }

    // turbo.json
    const turboConfig = {
      $schema: 'https://turbo.build/schema.json',
      tasks: {
        build: {
          dependsOn: ['^build'],
          outputs: ['dist/**', 'build/**'],
        },
        dev: {
          cache: false,
          persistent: true,
        },
        typecheck: {
          dependsOn: ['^typecheck'],
        },
        lint: {},
        test: {},
      },
    };
    writeJson(path.join(ROOT, 'turbo.json'), turboConfig);

    // Add turbo to devDependencies
    pkg.devDependencies = pkg.devDependencies || {};
    pkg.devDependencies.turbo = '^2.3.3';
    writeJson(path.join(ROOT, 'package.json'), pkg);
  }

  console.log('✅ 配置完成。\n');

  // ── Initialize ──

  console.log('📦 正在安装依赖...\n');
  const installCmd = pm === 'pnpm'
    ? 'pnpm install'
    : pm === 'yarn'
      ? 'yarn install'
      : 'npm install';

  try {
    if (pm === 'pnpm') {
      run(`COREPACK_INTEGRITY_KEYS="" ${installCmd}`);
    } else {
      run(installCmd);
    }
  } catch {
    console.warn('⚠️  安装失败，请手动运行安装命令。\n');
  }

  // Git init
  if (!fs.existsSync(path.join(ROOT, '.git'))) {
    console.log('\n🔧 正在初始化 Git...\n');
    run('git init');
    run('git add -A');
    run('git commit -m "chore: initial project setup from harness-engineering-template" --no-verify');
  }

  // ── Done ──

  console.log(`
╔══════════════════════════════════════════════════╗
║  ✅ ${projectName} 已就绪！
║
║  下一步：
║  1. 编辑 .ai-rules.md 填写项目规则
║  2. 编辑 docs/design/design-tokens.md 设计规范
║  3. 开始编码！
║
║  AI 配置（每位开发者一次性操作）：
║  在 Windsurf 中发送：
║  "请创建 Memory：当进入任何项目目录时，
║   检查 .ai-rules.md，存在则读取并遵循其中规则"
╚══════════════════════════════════════════════════╝
`);
}

main().catch(console.error);
