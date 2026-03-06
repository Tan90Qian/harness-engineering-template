---
description: 为新页面生成结构化的 Page Spec 描述文件模板
---

## 步骤

1. **确认信息**
   确认：页面名称、模块、运行端（如有多端）、核心功能

2. **创建 Page Spec**
   在 `docs/pages/{module}/` 创建 `{page}.spec.md`

3. **按模板生成骨架**
   使用 `docs/pages/_template.spec.md` 作为基础模板

4. **提示开发者填充**
   提醒开发者补充具体内容（布局、组件、接口、交互等）

5. **确认后再生成代码**
   开发者确认 spec 内容后，再执行代码生成
