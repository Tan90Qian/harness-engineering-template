---
description: 完善现有实现（对比 spec 文档补全缺失功能）
---

# 完善现有实现 Workflow

用于检查并完善任何 spec 文档对应的实现，确保所有组件/功能都已实现。

## 适用范围

- **页面 Spec** (`docs/pages/*.spec.md`) — 页面组件和交互
- **功能 Spec** (`docs/features/*.spec.md`) — 功能模块和集成
- **组件 Spec** (`docs/components/*.spec.md`) — 独立组件
- **API Spec** (`docs/api/*.spec.md`) — 后端接口

## 使用场景

- 基础功能已实现，但缺少部分组件
- 需要对比 spec 文档检查实现完整度
- Spec 文档与实际代码不同步

## 执行步骤

// turbo

### 1. 检查 spec 文档和现有实现

根据用户指定的 spec 类型：

**页面 Spec** (`docs/pages/*.spec.md`):
- 读取 spec 查看组件清单、接口依赖、交互说明
- 检查 `packages/uni-app/src/pages/` 或 `packages/web-admin/src/pages/` 实现
- 检查对应组件目录

**功能 Spec** (`docs/features/*.spec.md`):
- 读取 spec 查看功能需求和组件清单
- 检查相关模块实现
- 检查集成点是否完整

**API Spec**:
- 读取 `packages/shared/types/api-routes.ts` 路由索引
- 检查 `packages/bff/src/modules/` 对应模块
- 检查类型定义和 DTO

**输出**: 缺失功能/组件清单（逐项列出 ✅ 已实现 / ❌ 缺失）

### 2. 分析缺失功能的实现方式

按依赖顺序规划实现策略：
1. **类型定义** — 在 `packages/shared/types/` 中补充
2. **数据/工具** — 创建工具函数、Hook、Store
3. **核心组件** — 实现主要功能组件
4. **集成** — 在现有代码中集成新功能

### 3. 创建缺失的实现

按照步骤 2 的顺序逐一实现：
- 从 `@cloud-garage/shared/types` 导入类型，不自行定义
- uni-app 页面使用 Vue 3 Composition API + Pinia
- web-admin 页面使用 React + Ant Design + TanStack Query
- BFF 模块使用 Nest.js + Swagger 装饰器
- 处理加载中 / 错误 / 空数据状态
- 跨端差异使用条件编译（`#ifdef`）

### 4. 更新 spec 文档

将组件清单中的实现状态更新为 ✅：

```markdown
| 组件 | 说明 | 是否已有 |
|------|------|---------|
| CarCard | 车辆卡片 | ✅ |
| FilterBar | 筛选栏 | ✅ |
| DetailModal | 详情弹窗 | ✅ |
```

**标记说明**：
- ✅ = 已完成
- ⚠️ = 部分完成或暂未实现
- ❌ = 未实现（应说明原因）
- (P0/P1/P2) = 优先级标记

### 5. 文档同步

- 检查 `docs/SYNC_MAP.md`，确认映射关系
- 如新增了模块，在 SYNC_MAP 中添加映射

// turbo

### 6. 类型检查

```bash
pnpm typecheck
```

确保无类型错误。

### 7. 输出完成总结

列出：
- 新增的文件
- 更新的文件
- 更新的 spec 文档
- 实现完整度统计（如：8/10 项已完成）

## 使用示例

```
/complete 车辆列表页面的筛选和详情弹窗
/complete 订单状态流转功能
/complete 商家认证表单组件
/complete BFF 车辆模块的搜索和收藏接口
```
