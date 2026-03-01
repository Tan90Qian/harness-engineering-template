#!/usr/bin/env node

/**
 * 文档-代码同步检查脚本
 *
 * 用法：
 *   node scripts/doc-sync-check.js              # 检查当前分支 vs main
 *   node scripts/doc-sync-check.js --base=HEAD~1  # 检查最近一次提交
 *   node scripts/doc-sync-check.js --strict      # strict 级别不通过时以非零退出码退出
 *
 * 原理：
 *   1. 解析 docs/SYNC_MAP.md 中的映射表
 *   2. 用 git diff 获取本次变更的文件列表
 *   3. 对每个变更文件，检查映射的文档是否也有变更
 *   4. 根据同步级别（strict/warn/info）输出检查结果
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── 参数解析 ──

const args = process.argv.slice(2);
const strictMode = args.includes('--strict');
const baseArg = args.find((a) => a.startsWith('--base='));
const base = baseArg ? baseArg.split('=')[1] : 'main';

// ── 解析 SYNC_MAP ──

function parseSyncMap() {
  const mapPath = path.join(ROOT, 'docs', 'SYNC_MAP.md');
  if (!fs.existsSync(mapPath)) {
    console.log('ℹ️  docs/SYNC_MAP.md 不存在，跳过文档同步检查。');
    process.exit(0);
  }

  const content = fs.readFileSync(mapPath, 'utf-8');
  const lines = content.split('\n');
  const mappings = [];

  // 查找映射表（| 代码路径 | 对应文档 | 同步级别 | 说明 |）
  let inTable = false;
  let headerPassed = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('| 代码路径')) {
      inTable = true;
      continue;
    }

    if (inTable && trimmed.startsWith('|---')) {
      headerPassed = true;
      continue;
    }

    if (inTable && headerPassed && trimmed.startsWith('|')) {
      const cells = trimmed
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean);

      if (cells.length >= 3) {
        const codeGlob = cells[0].replace(/`/g, '');
        const docPath = cells[1].replace(/`/g, '');
        const level = cells[2].toLowerCase();

        if (['strict', 'warn', 'info'].includes(level)) {
          mappings.push({ codeGlob, docPath, level });
        }
      }
    } else if (inTable && headerPassed && !trimmed.startsWith('|')) {
      break; // 表格结束
    }
  }

  return mappings;
}

// ── 获取变更文件 ──

function getChangedFiles() {
  try {
    const output = execSync(`git diff --name-only ${base}...HEAD`, {
      cwd: ROOT,
      encoding: 'utf-8',
    }).trim();

    if (!output) return [];
    return output.split('\n').filter(Boolean);
  } catch {
    // 可能 base 分支不存在（新仓库），尝试 diff HEAD
    try {
      const output = execSync('git diff --name-only HEAD~1', {
        cwd: ROOT,
        encoding: 'utf-8',
      }).trim();
      if (!output) return [];
      return output.split('\n').filter(Boolean);
    } catch {
      console.log('ℹ️  无法获取 git diff，跳过检查。');
      return [];
    }
  }
}

// ── Glob 简易匹配 ──

function matchGlob(filePath, glob) {
  // 支持 **/* 和 * 通配符的简易匹配
  const regexStr = glob
    .replace(/\./g, '\\.')
    .replace(/\*\*\//g, '(.+/)?')
    .replace(/\*/g, '[^/]+');

  const regex = new RegExp(`^${regexStr}$`);
  return regex.test(filePath);
}

// ── 检查文档是否也有变更 ──

function checkDocPath(docPath, changedFiles) {
  // docPath 可能包含通配符（如 docs/pages/*.spec.md）
  if (docPath.includes('*')) {
    return changedFiles.some((f) => matchGlob(f, docPath));
  }
  return changedFiles.includes(docPath);
}

// ── 主流程 ──

function main() {
  console.log('📋 文档-代码同步检查\n');

  const mappings = parseSyncMap();
  if (mappings.length === 0) {
    console.log('ℹ️  SYNC_MAP 中无映射规则，跳过。');
    process.exit(0);
  }

  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0) {
    console.log('ℹ️  无文件变更，跳过。');
    process.exit(0);
  }

  console.log(`📂 变更文件数：${changedFiles.length}`);
  console.log(`📐 映射规则数：${mappings.length}\n`);

  const issues = [];

  for (const mapping of mappings) {
    // 找到匹配此 glob 的变更文件
    const matchedCodeFiles = changedFiles.filter((f) => matchGlob(f, mapping.codeGlob));

    if (matchedCodeFiles.length === 0) continue; // 此映射的代码没有变更

    // 检查对应文档是否也有变更
    const docChanged = checkDocPath(mapping.docPath, changedFiles);

    if (!docChanged) {
      issues.push({
        level: mapping.level,
        codeGlob: mapping.codeGlob,
        docPath: mapping.docPath,
        matchedFiles: matchedCodeFiles,
      });
    }
  }

  // ── 输出结果 ──

  if (issues.length === 0) {
    console.log('✅ 所有变更的代码均有对应文档同步更新。\n');
    process.exit(0);
  }

  let hasStrict = false;

  for (const issue of issues) {
    const icon = issue.level === 'strict' ? '❌' : issue.level === 'warn' ? '⚠️' : 'ℹ️';
    const label = issue.level.toUpperCase();

    console.log(`${icon} [${label}] 代码变更但文档未更新：`);
    console.log(`   代码：${issue.codeGlob}`);
    console.log(`   文档：${issue.docPath}`);
    console.log(`   变更文件：`);
    issue.matchedFiles.forEach((f) => console.log(`     - ${f}`));
    console.log('');

    if (issue.level === 'strict') {
      hasStrict = true;
    }
  }

  // 汇总
  const strictCount = issues.filter((i) => i.level === 'strict').length;
  const warnCount = issues.filter((i) => i.level === 'warn').length;
  const infoCount = issues.filter((i) => i.level === 'info').length;

  console.log('── 汇总 ──');
  if (strictCount) console.log(`❌ strict：${strictCount} 项（需立即更新文档）`);
  if (warnCount) console.log(`⚠️  warn：${warnCount} 项（建议尽快更新）`);
  if (infoCount) console.log(`ℹ️  info：${infoCount} 项（仅供参考）`);
  console.log('');

  if (hasStrict && strictMode) {
    console.log('💥 存在 strict 级别的文档未同步，CI 检查不通过。');
    process.exit(1);
  }

  if (hasStrict) {
    console.log('⚠️  存在 strict 级别的文档未同步。使用 --strict 可使 CI 阻止合并。');
  }
}

main();
