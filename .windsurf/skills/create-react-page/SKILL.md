---
name: create-react-page
description: 根据 Page Spec 和类型定义生成 React 页面
---

# Create React Page Skill

## 前置条件

1. Page Spec 已存在。
2. 类型定义已存在。
3. 设计规范已存在或已确认默认值。

## 生成步骤

1. 基于 spec 生成页面结构与交互。
2. 从统一类型入口导入类型，避免页面内自造类型。
3. 生成/更新服务层调用与路由配置。
4. 运行 `typecheck` 与 `lint`。
