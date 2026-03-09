---
name: create-uni-page
description: 根据 Page Spec 和类型定义生成 uni-app Vue 3 页面
---

# Create Uni Page Skill

## 前置条件

1. Page Spec 已存在。
2. 类型定义已存在。
3. 已明确多端差异与条件编译策略。

## 生成步骤

1. 创建/更新页面 `.vue` 文件并按 spec 实现结构。
2. 引入共享类型，补齐状态与服务调用。
3. 处理条件编译与端差异。
4. 更新路由或 pages 配置。
5. 运行 `typecheck`。
