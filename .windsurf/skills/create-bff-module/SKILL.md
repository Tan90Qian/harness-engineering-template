---
name: create-bff-module
description: 根据类型定义生成 BFF 模块骨架
---

# Create BFF Module Skill

## 前置条件

1. 目标模块类型定义已存在。
2. 路由约定已确认。

## 生成步骤

1. 创建模块目录与基础文件（module/controller/service/dto）。
2. Controller 对齐接口契约与校验规则。
3. Service 先提供可替换的实现（如 mock 或适配层调用）。
4. 更新模块注册与导出。
5. 运行 `typecheck` 与基础测试。
