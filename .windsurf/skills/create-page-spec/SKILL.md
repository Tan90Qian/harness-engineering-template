---
name: create-page-spec
description: 为新页面生成结构化的 Page Spec 描述文件模板
---

# Create Page Spec Skill

## 步骤

1. 确认页面名称、模块、运行端与核心功能。
2. 在 `docs/pages/{module}/` 创建 `{page}.spec.md`。
3. 以 `docs/pages/_template.spec.md` 为模板填充骨架。
4. 标注接口依赖、关键交互与跨端差异。
5. 提醒开发者确认 Spec 后再进入代码生成。
