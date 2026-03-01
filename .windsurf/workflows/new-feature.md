---
description: 开发一个完整的新功能（从 spec 到测试）
---

## 步骤

1. **明确需求范围**
   确认涉及哪些模块、哪些页面、核心交互。描述模糊时主动询问。

2. **准备上下文**（缺什么补什么）
   // turbo
   a. 检查该功能的类型定义是否存在 → 不存在则创建
   // turbo
   b. 检查 `docs/pages/` 下是否有对应 Page Spec → 不存在则创建
   // turbo
   c. 检查 `docs/design/design-tokens.md` → 不存在则提醒

3. **生成后端/API 代码**（如需要）
   - 按项目约定创建 module/controller/service
   - 初始使用 Mock 数据，标注 `// TODO: 替换为真实实现`
   - 从共享类型包中导入类型

4. **生成前端页面**（如需要）
   - 遵循项目 UI 框架约定
   - 导入共享类型
   - 处理加载中/错误/空数据状态

5. **生成测试**
   - 工具函数 → 单元测试
   - API 接口 → 集成测试

6. **文档同步**（强制）
   - 检查 `docs/SYNC_MAP.md`，确认本次变更涉及的文档已同步更新
   - 新增模块必须在 SYNC_MAP 中添加映射
   - 更新对应的 `.ai-rules.md`、Page Spec、Design Tokens（如有变化）

// turbo
7. **类型检查**
   运行项目的 typecheck 命令

8. **总结输出**
   列出所有创建/修改的文件（含文档）
