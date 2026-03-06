#!/usr/bin/env node

/**
 * 文档模式管理脚本
 *
 * 用法：
 *   node scripts/manage-doc-constraint.js                  # 查看当前模式
 *   node scripts/manage-doc-constraint.js --switch-to-team # 切换到团队模式（不可逆）
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOC_MODE_PATH = path.join(ROOT, 'docs', '.doc-mode');
const DOC_CONSTRAINT_PATH = path.join(ROOT, 'docs', '.doc-constraint.json');

const args = process.argv.slice(2);

function getCurrentMode() {
  if (!fs.existsSync(DOC_MODE_PATH)) return 'solo';
  return fs.readFileSync(DOC_MODE_PATH, 'utf-8').trim();
}

function showStatus() {
  const mode = getCurrentMode();
  console.log(`\n📋 当前文档模式: ${mode === 'team' ? '🏢 团队模式' : '👤 单人模式'}\n`);

  if (fs.existsSync(DOC_CONSTRAINT_PATH)) {
    const constraints = JSON.parse(fs.readFileSync(DOC_CONSTRAINT_PATH, 'utf-8'));
    console.log('约束配置:');
    for (const [key, value] of Object.entries(constraints.constraints)) {
      const icon = value ? '✅' : '⬜';
      console.log(`  ${icon} ${key}`);
    }
  }
  console.log('');
}

function switchToTeam() {
  const currentMode = getCurrentMode();

  if (currentMode === 'team') {
    console.log('\n⚠️  已经是团队模式，无需切换。\n');
    process.exit(0);
  }

  console.log('\n🔄 正在切换到团队模式...\n');

  // 更新 .doc-mode
  fs.writeFileSync(DOC_MODE_PATH, 'team\n', 'utf-8');

  // 更新 .doc-constraint.json
  const constraints = {
    mode: 'team',
    constraints: {
      'page-spec-required': true,
      'design-doc-required': true,
      'architecture-doc-on-refactor': true,
      'component-doc-required': true,
      'storybook-required': false,
      'pre-commit-doc-check': true,
    },
    description: {
      solo: '单人模式：文档建议但非强制，Page Spec 推荐创建',
      team: '团队模式：文档先行强制，提交前自动检查文档完整性',
    },
  };
  fs.writeFileSync(DOC_CONSTRAINT_PATH, JSON.stringify(constraints, null, 2) + '\n', 'utf-8');

  console.log('✅ 已切换到团队模式。');
  console.log('');
  console.log('变更内容:');
  console.log('  ✅ docs/.doc-mode → team');
  console.log('  ✅ docs/.doc-constraint.json 约束已启用');
  console.log('');
  console.log('⚠️  此操作不可逆。团队模式下:');
  console.log('  - 新页面必须先创建 Page Spec');
  console.log('  - 新功能必须先更新相关文档');
  console.log('  - 重构必须先更新架构文档');
  console.log('  - 提交前自动检查文档完整性');
  console.log('');
}

// ── 主流程 ──

if (args.includes('--switch-to-team')) {
  switchToTeam();
} else {
  showStatus();
}
