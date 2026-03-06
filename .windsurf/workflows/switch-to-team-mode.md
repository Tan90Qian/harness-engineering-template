---
description: 一键切换项目到团队模式（不可逆）
---

# 切换到团队模式

> ⚠️ 此操作不可逆。切换后文档先行变为强制要求。

## 前提

- 当前项目处于单人模式（`docs/.doc-mode` 内容为 `solo`）
- 确认团队已准备好遵循文档先行规范

## 步骤

1. **确认切换意图**
   提醒用户：此操作不可逆，切换后：
   - 文档先行变为**强制**（提交前自动检查）
   - 新增组件文档要求
   - 文档检查更严格

2. **执行切换**
   // turbo
   运行 `node scripts/manage-doc-constraint.js --switch-to-team`

3. **验证切换结果**
   // turbo
   - 检查 `docs/.doc-mode` 内容变为 `team`
   - 检查 `docs/.doc-constraint.json` 已更新
   - 检查 `.ai-rules.md` 中文档先行规则已激活

4. **更新 Workflows**（如需要）
   - 确认 `/new-feature` 和 `/new-page` workflow 包含强制文档步骤

5. **通知团队**
   输出切换完成摘要，提醒团队成员注意新的文档要求。
