---
name: create-type-definition
description: 为新模块生成 TypeScript 接口类型定义模板
---

# Create Type Definition Skill

## 步骤

1. 确认模块名称、核心字段、API 列表与状态流转。
2. 创建类型文件（如 `{module}.ts`），定义实体、请求/响应类型。
3. 需要状态流转时补充 `{module}-status.ts`。
4. 更新统一导出入口（如 `index.ts`）。
5. 运行 `typecheck` 确认无错误。
