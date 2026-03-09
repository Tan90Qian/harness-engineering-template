---
name: check-context
description: 在生成页面/组件代码前检查上下文完整性，如有缺失则引导开发者补全
---

# Check Context Skill

## 触发条件

当开发者要求生成页面、组件、或包含接口调用的代码时自动触发。

## 检查步骤

1. 确认目标模块、页面和技术栈。
2. 检查 `docs/pages/{module}/{page}.spec.md` 是否存在。
3. 检查对应类型定义是否存在（如 `src/types/` 或 `packages/shared/types/`）。
4. 检查 `docs/design/design-tokens.md` 是否存在。
5. 若涉及状态流转，检查状态机定义是否存在。
6. 输出检查报告（✅/⚠️/❌），缺失则先引导补全再继续。
