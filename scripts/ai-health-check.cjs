#!/usr/bin/env node

/**
 * AI 工程化健壮性自动检查脚本
 *
 * 检查维度：
 *   1. AI 规则文件 (.ai-rules.md) 完整性
 *   2. Windsurf Workflows 覆盖度
 *   3. 文档体系（SYNC_MAP、ARCHITECTURE、PROJECT_PLAN 等）
 *   4. 测试覆盖（是否每个包都有测试）
 *   5. 代码质量护栏（commitlint、eslint、prettier、husky）
 *   6. CI/CD 配置完整性
 *   7. 文档-代码同步映射完整性
 *
 * 用法：
 *   node scripts/ai-health-check.cjs           # 正常输出
 *   node scripts/ai-health-check.cjs --json    # JSON 格式输出
 *   node scripts/ai-health-check.cjs --strict  # 评分 < 7 时退出码非零
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const JSON_MODE = args.includes('--json');
const STRICT_MODE = args.includes('--strict');

// ── 工具函数 ──

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function readFile(relPath) {
  const p = path.join(ROOT, relPath);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : '';
}

function countMatches(content, pattern) {
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

function findFiles(dir, pattern) {
  const results = [];
  const absDir = path.join(ROOT, dir);
  if (!fs.existsSync(absDir)) return results;

  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (
        entry.isDirectory() &&
        !entry.name.startsWith('.') &&
        entry.name !== 'node_modules' &&
        entry.name !== 'dist'
      ) {
        walk(full);
      } else if (entry.isFile() && pattern.test(entry.name)) {
        results.push(full);
      }
    }
  }
  walk(absDir);
  return results;
}

/**
 * 自动检测 Monorepo 包目录
 * 支持 packages/* 和 src/ 两种结构
 */
function detectPackages() {
  const packagesDir = path.join(ROOT, 'packages');
  if (fs.existsSync(packagesDir)) {
    return fs
      .readdirSync(packagesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
      .map((d) => d.name);
  }
  // 非 Monorepo：检查 src/ 目录
  if (fs.existsSync(path.join(ROOT, 'src'))) {
    return ['.']; // 单包项目
  }
  return [];
}

/**
 * 获取包的源码目录
 */
function getSourceDir(pkg) {
  if (pkg === '.') return 'src';
  return `packages/${pkg}/src`;
}

// ── 检查函数 ──

function checkAiRules() {
  const issues = [];
  const content = readFile('.ai-rules.md');

  if (!content) {
    return { score: 0, maxScore: 10, issues: ['.ai-rules.md 不存在'] };
  }

  let score = 0;
  const maxScore = 10;

  // 基础结构（通用章节）
  const sections = [
    { heading: '## 项目概览', weight: 1 },
    { heading: '## 通用规则', weight: 1 },
    { heading: '## 代码质量', weight: 1 },
    { heading: '## 测试规则', weight: 1 },
    { heading: '## 参考文档', weight: 1 },
  ];

  for (const section of sections) {
    if (content.includes(section.heading)) {
      score += section.weight;
    } else {
      issues.push(`缺少 ${section.heading} 章节`);
    }
  }

  // 项目特定规则（可选但推荐）
  if (content.includes('## 项目特定规则') || content.includes('## 项目结构')) {
    score += 1;
  } else {
    issues.push('缺少项目特定规则/结构章节');
  }

  // AI 工作流索引
  if (content.includes('## AI 工作流') || content.includes('Workflow')) {
    score += 1;
  } else {
    issues.push('缺少 AI 工作流索引');
  }

  // commit 规范
  if (content.includes('commit') || content.includes('提交')) {
    score += 1;
  } else {
    issues.push('缺少提交规范相关说明');
  }

  // 环境变量或敏感信息提醒
  if (content.includes('.env') || content.includes('环境变量')) {
    score += 1;
  } else {
    issues.push('缺少环境变量/敏感信息规则');
  }

  // 非占位符内容（检查是否仍是模板未填写状态）
  if (content.includes('{{PROJECT_NAME}}') || content.includes('{{PROJECT_DESCRIPTION}}')) {
    score -= 2;
    issues.push('.ai-rules.md 仍包含占位符，需填写项目信息');
  } else {
    score += 1;
  }

  return { score: Math.max(0, Math.min(score, maxScore)), maxScore, issues };
}

function checkWorkflows() {
  const issues = [];
  let score = 0;
  const maxScore = 10;

  const workflowDir = '.windsurf/workflows';
  if (!fileExists(workflowDir)) {
    return { score: 0, maxScore, issues: ['.windsurf/workflows/ 目录不存在'] };
  }

  const workflows = findFiles(workflowDir, /\.md$/);
  const workflowNames = workflows.map((f) => path.basename(f, '.md'));

  // 核心 workflow 检查
  const requiredWorkflows = ['fix-bug', 'new-feature', 'new-page'];
  for (const name of requiredWorkflows) {
    if (workflowNames.includes(name)) {
      score += 1.5;
    } else {
      issues.push(`缺少核心 workflow: ${name}.md`);
    }
  }

  // 额外 workflow 加分（每个 0.5，上限 2 分）
  const extraWorkflows = workflowNames.filter(
    (n) => !requiredWorkflows.includes(n) && !n.startsWith('_'),
  );
  score += Math.min(extraWorkflows.length * 0.5, 2);

  // workflow 格式检查：每个 workflow 应有 frontmatter description
  let formatOk = 0;
  for (const wf of workflows) {
    const content = fs.readFileSync(wf, 'utf-8');
    if (content.startsWith('---') && content.includes('description:')) {
      formatOk++;
    } else {
      issues.push(`${path.basename(wf)} 缺少 YAML frontmatter (description)`);
    }
  }
  if (workflows.length > 0) {
    score += (formatOk / workflows.length) * 1.5;
  }

  // CONTRIBUTING.md 中是否列出了 workflows
  const contributing = readFile('CONTRIBUTING.md');
  if (contributing.includes('/new-feature') && contributing.includes('/fix-bug')) {
    score += 1;
  } else {
    issues.push('CONTRIBUTING.md 中未列出 AI 工作流');
  }

  return { score: Math.min(score, maxScore), maxScore, issues };
}

function checkDocs() {
  const issues = [];
  let score = 0;
  const maxScore = 10;

  // 核心文档存在性（权重可调）
  const requiredDocs = {
    'docs/SYNC_MAP.md': 1.5,
    'docs/testing-strategy.md': 1.5,
    'docs/design/design-tokens.md': 1,
    'CONTRIBUTING.md': 1,
    'README.md': 0.5,
  };

  // 可选但推荐的文档
  const optionalDocs = {
    'docs/ARCHITECTURE.md': 1,
    'docs/PROJECT_PLAN.md': 1,
  };

  for (const [doc, weight] of Object.entries(requiredDocs)) {
    if (fileExists(doc)) {
      score += weight;
    } else {
      issues.push(`缺少文档: ${doc}`);
    }
  }

  for (const [doc, weight] of Object.entries(optionalDocs)) {
    if (fileExists(doc)) {
      score += weight;
    } else {
      issues.push(`建议添加文档: ${doc}`);
    }
  }

  // Page Spec 覆盖度
  const pageSpecs = findFiles('docs/pages', /\.spec\.md$/);
  if (pageSpecs.length >= 3) {
    score += 1.5;
  } else if (pageSpecs.length >= 1) {
    score += 0.5;
    issues.push(`Page Spec 数量不足（当前: ${pageSpecs.length}，建议 ≥3）`);
  } else {
    issues.push('无 Page Spec 文件（建议至少 3 个）');
  }

  // .env.example 存在
  if (fileExists('.env.example')) {
    score += 0.5;
  } else {
    issues.push('缺少 .env.example');
  }

  return { score: Math.min(score, maxScore), maxScore, issues };
}

function checkTests() {
  const issues = [];
  let score = 0;
  const maxScore = 10;

  const packages = detectPackages();

  if (packages.length === 0) {
    issues.push('未检测到源码包');
    // 仍检查根目录
    const rootTests = findFiles('src', /\.(test|spec)\.(ts|tsx|js)$/);
    if (rootTests.length > 0) score += 3;
  }

  // 检查每个包是否有测试文件
  const packagesWithTests = [];
  let totalTestFiles = 0;

  for (const pkg of packages) {
    const srcDir = getSourceDir(pkg);
    const testFiles = findFiles(srcDir, /\.(test|spec)\.(ts|tsx|js)$/);
    totalTestFiles += testFiles.length;

    if (testFiles.length > 0) {
      packagesWithTests.push(pkg);
    } else {
      issues.push(`${pkg === '.' ? '项目' : pkg + ' 包'}无测试文件`);
    }
  }

  // 按覆盖比例评分（满分 6 分）
  if (packages.length > 0) {
    const ratio = packagesWithTests.length / packages.length;
    score += ratio * 6;
  }

  // 测试策略文档
  if (fileExists('docs/testing-strategy.md')) {
    score += 1;
  } else {
    issues.push('缺少测试策略文档');
  }

  // CI 中是否运行测试
  const ci = readFile('.github/workflows/ci.yml');
  if (ci.includes('test')) {
    score += 1;
  } else {
    issues.push('CI 流水线中未运行测试');
  }

  // 测试文件总数加分
  if (totalTestFiles >= 6) score += 2;
  else if (totalTestFiles >= 3) score += 1;
  else if (totalTestFiles >= 1) score += 0.5;
  else issues.push(`测试文件总数过少（当前: ${totalTestFiles}）`);

  return { score: Math.min(score, maxScore), maxScore, issues };
}

function checkQualityGuardrails() {
  const issues = [];
  let score = 0;
  const maxScore = 10;

  // ESLint 配置
  if (
    fileExists('.eslintrc.js') ||
    fileExists('.eslintrc.cjs') ||
    fileExists('.eslintrc.json') ||
    fileExists('eslint.config.js') ||
    fileExists('eslint.config.mjs')
  ) {
    score += 1.5;
  } else {
    issues.push('缺少 ESLint 配置');
  }

  // Prettier 配置
  if (
    fileExists('.prettierrc') ||
    fileExists('.prettierrc.js') ||
    fileExists('prettier.config.js')
  ) {
    score += 1;
  } else {
    issues.push('缺少 Prettier 配置');
  }

  // commitlint 配置
  if (fileExists('commitlint.config.js') || fileExists('commitlint.config.ts')) {
    score += 1.5;
    const content = readFile('commitlint.config.js');
    // body 规则（可选加分）
    if (content.includes('body-empty')) {
      score += 0.5;
    }
  } else {
    issues.push('缺少 commitlint 配置');
  }

  // Husky
  if (fileExists('.husky')) {
    score += 1;
  } else {
    issues.push('缺少 Husky (git hooks)');
  }

  // lint-staged
  if (
    fileExists('.lintstagedrc.js') ||
    fileExists('.lintstagedrc.json') ||
    fileExists('lint-staged.config.js')
  ) {
    score += 1;
  } else {
    issues.push('缺少 lint-staged 配置');
  }

  // TypeScript strict
  const tsconfig = readFile('tsconfig.json');
  if (tsconfig.includes('"strict": true') || tsconfig.includes('"strict":true')) {
    score += 1.5;
  } else {
    issues.push('tsconfig.json 未启用 strict 模式');
  }

  // EditorConfig
  if (fileExists('.editorconfig')) {
    score += 0.5;
  } else {
    issues.push('缺少 .editorconfig');
  }

  // Turbo 配置（Monorepo 才需要，非 Monorepo 不扣分）
  const turbo = readFile('turbo.json');
  if (turbo) {
    score += 0.5;
    if (turbo.includes('typecheck')) {
      score += 0.5;
    }
  } else if (detectPackages().length > 1) {
    issues.push('Monorepo 项目缺少 turbo.json');
  }

  return { score: Math.min(score, maxScore), maxScore, issues };
}

function checkCI() {
  const issues = [];
  let score = 0;
  const maxScore = 10;

  const ci = readFile('.github/workflows/ci.yml');
  if (!ci) {
    return { score: 0, maxScore, issues: ['缺少 CI 配置文件 (.github/workflows/ci.yml)'] };
  }

  // 基础步骤
  const steps = [
    { name: 'typecheck', pattern: /typecheck/i, weight: 2 },
    { name: 'lint', pattern: /lint/i, weight: 2 },
    { name: 'format', pattern: /format/i, weight: 1 },
    { name: 'test', pattern: /test/i, weight: 2 },
    { name: 'doc-sync-check', pattern: /doc-sync/i, weight: 1.5 },
  ];

  for (const step of steps) {
    if (step.pattern.test(ci)) {
      score += step.weight;
    } else {
      issues.push(`CI 缺少 ${step.name} 步骤`);
    }
  }

  // PR 模板
  if (fileExists('.github/PULL_REQUEST_TEMPLATE.md')) {
    score += 1;
  } else {
    issues.push('缺少 PR 模板');
  }

  // 缓存配置
  if (ci.includes('cache')) {
    score += 0.5;
  } else {
    issues.push('CI 未配置依赖缓存');
  }

  return { score: Math.min(score, maxScore), maxScore, issues };
}

function checkSyncMap() {
  const issues = [];
  let score = 0;
  const maxScore = 10;

  const content = readFile('docs/SYNC_MAP.md');
  if (!content) {
    return { score: 0, maxScore, issues: ['缺少 docs/SYNC_MAP.md'] };
  }

  // 映射条目数量
  const rows = content.match(/^\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|$/gm) || [];
  // 减去表头和分隔行
  const mappingCount = Math.max(0, rows.length - 2);

  if (mappingCount >= 8) score += 3;
  else if (mappingCount >= 5) score += 2;
  else if (mappingCount >= 3) score += 1.5;
  else if (mappingCount >= 1) score += 0.5;
  else issues.push(`SYNC_MAP 映射条目过少（当前: ${mappingCount}）`);

  // 同步级别覆盖
  if (content.includes('strict')) score += 1.5;
  else issues.push('SYNC_MAP 缺少 strict 级别映射');

  if (content.includes('warn')) score += 1;
  else issues.push('SYNC_MAP 缺少 warn 级别映射');

  // doc-sync-check.js 脚本存在
  if (fileExists('scripts/doc-sync-check.js')) {
    score += 2;
  } else {
    issues.push('缺少 doc-sync-check.js 同步检查脚本');
  }

  // 映射格式正确性（简单检查是否有 glob 语法）
  if (content.includes('**') || content.includes('*')) {
    score += 1;
  } else {
    issues.push('SYNC_MAP 映射未使用 glob 通配符');
  }

  // 文档同步检查是否集成到 CI
  const ci = readFile('.github/workflows/ci.yml');
  if (ci.includes('doc-sync')) {
    score += 1.5;
  } else {
    issues.push('CI 未集成文档同步检查');
  }

  return { score: Math.min(score, maxScore), maxScore, issues };
}

// ── 主流程 ──

function main() {
  const checks = {
    'AI 规则文件': checkAiRules(),
    'Windsurf Workflows': checkWorkflows(),
    文档体系: checkDocs(),
    测试覆盖: checkTests(),
    代码质量护栏: checkQualityGuardrails(),
    'CI/CD 配置': checkCI(),
    '文档-代码同步': checkSyncMap(),
  };

  // 计算总分
  let totalScore = 0;
  let totalMax = 0;
  for (const check of Object.values(checks)) {
    totalScore += check.score;
    totalMax += check.maxScore;
  }
  const normalizedScore = (totalScore / totalMax) * 10;

  if (JSON_MODE) {
    const output = {
      score: Math.round(normalizedScore * 10) / 10,
      maxScore: 10,
      timestamp: new Date().toISOString(),
      dimensions: {},
    };
    for (const [name, check] of Object.entries(checks)) {
      const dimScore = Math.round((check.score / check.maxScore) * 100) / 10;
      output.dimensions[name] = {
        score: dimScore,
        maxScore: 10,
        issues: check.issues,
      };
    }
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║          AI 工程化健壮性自动检查报告                    ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    let allIssues = 0;
    for (const [name, check] of Object.entries(checks)) {
      const dimScore = Math.round((check.score / check.maxScore) * 100) / 10;
      const bar = '█'.repeat(Math.round(dimScore)) + '░'.repeat(10 - Math.round(dimScore));
      const icon = dimScore >= 8 ? '✅' : dimScore >= 6 ? '⚠️' : '❌';
      console.log(`  ${icon} ${name.padEnd(18)} ${bar}  ${dimScore.toFixed(1)}/10`);

      if (check.issues.length > 0) {
        allIssues += check.issues.length;
        for (const issue of check.issues) {
          console.log(`     └─ ${issue}`);
        }
      }
    }

    console.log('');
    console.log('──────────────────────────────────────────────────────────');
    const emoji = normalizedScore >= 8.5 ? '🟢' : normalizedScore >= 7 ? '🟡' : '🔴';
    console.log(`  ${emoji} 综合评分: ${normalizedScore.toFixed(1)} / 10`);
    console.log(`     共发现 ${allIssues} 个待改进项`);
    console.log('');

    if (normalizedScore >= 8.5) {
      console.log('  💡 状态良好！继续保持。');
    } else if (normalizedScore >= 7) {
      console.log('  💡 基本达标，建议处理上述 ⚠️ 项。');
    } else {
      console.log('  💡 需要改进！优先处理 ❌ 项以提升 AI 辅助开发效果。');
    }
    console.log('');
  }

  // strict 模式
  if (STRICT_MODE && normalizedScore < 7) {
    process.exit(1);
  }
}

main();
