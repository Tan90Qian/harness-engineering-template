---
description: 基于 Figma MCP 自动填充 Page Spec 或 Component Spec
globs:
  - "docs/pages/**/*.spec.md"
  - "docs/components/**/*.spec.md"
---

# 从 Figma 生成 Spec

基于 Figma MCP 自动提取设计数据并填充 Spec 文档。

## 使用场景

- 创建新的 Page Spec 或 Component Spec
- 更新现有 Spec 的设计规范部分
- 从 Figma 设计稿同步最新的视觉规范

## 前置条件

1. Figma MCP Server 已配置（详见 `docs/design/FIGMA_MCP_SETUP.md`）
2. 有 Figma 设计稿链接（格式：`https://figma.com/design/{fileKey}/...?node-id={nodeId}`）
3. Figma PAT 已配置且有文件访问权限

## 工作流程

### 1. 提取 Figma 信息

从用户提供的 Figma 链接中提取：
- **fileKey**：文件 ID
- **nodeId**：节点 ID（格式：`1:100` 或 `1-100`）

示例链接：
```
https://www.figma.com/design/g80uY1TZ6mJiBGZilDKFNZ/Design?node-id=0-44020
                              ^^^^^^^^^^^^^^^^^^^              ^^^^^^^
                              fileKey                          nodeId (转为 0:44020)
```

### 2. 调用 Figma MCP 工具

使用 `get_design_context` 工具获取设计数据：

```typescript
mcp0_get_design_context({
  fileKey: "g80uY1TZ6mJiBGZilDKFNZ",
  nodeId: "0:44020",
  clientFrameworks: "vue,react",  // 根据项目技术栈
  clientLanguages: "typescript,javascript"
})
```

### 3. 解析返回数据

Figma MCP 返回的数据包含：

| 数据类型 | 提取内容 |
|---------|---------|
| **截图** | 页面/组件截图（自动生成） |
| **节点名称** | 页面/组件名称 |
| **颜色** | 背景色、文字颜色、边框颜色等（hex 格式） |
| **字体** | 字体家族、字号、字重 |
| **布局** | 尺寸、位置、间距、圆角 |
| **组件结构** | 子组件层级关系（通过 `data-name` 和 `data-node-id`） |
| **图片资源** | 图标/图片的 CDN URL（7 天有效） |

### 4. 自动填充 Spec

#### 4.1 填充 Figma 章节

```markdown
## Figma 设计稿

| 设计稿 | Figma 链接 | 说明 | 最后同步 |
|--------|-----------|------|---------|
| {节点名称} | {Figma 链接} | {自动提取或用户输入} | {当前日期} |
```

#### 4.2 填充设计规范

从 Figma 数据中提取并填充：

```markdown
## 设计规范

参考 `docs/design/design-tokens.md`

### 页面/组件特定规范
- **背景色**: {从 Figma 提取}
- **文字颜色**: 
  - 主文字: {从 Figma 提取}
  - 次要文字: {从 Figma 提取}
- **字体**: {从 Figma 提取}
- **字号**: 
  - 标题: {从 Figma 提取}
  - 正文: {从 Figma 提取}
  - 辅助: {从 Figma 提取}
- **圆角**: {从 Figma 提取}
- **间距**: {从 Figma 提取}
```

#### 4.3 填充布局结构（可选）

基于 Figma 节点树生成布局描述：

```markdown
## 布局结构

### 顶部区域
{基于 Figma 节点结构描述}

### 主体区域
{基于 Figma 节点结构描述}

### 底部区域
{基于 Figma 节点结构描述}
```

#### 4.4 填充组件清单（可选）

从 Figma 组件节点中提取：

```markdown
## 组件清单

| 组件 | 说明 | Spec 文档 | 是否已有 |
|------|------|----------|---------|
| {从 Figma 节点名提取} | {节点描述} | - | ❌ |
```

### 5. 人工补充

以下内容需要人工补充（Figma 无法提供）：

- ✅ 路由信息
- ✅ 接口依赖
- ✅ 交互说明
- ✅ 状态管理
- ✅ Props 接口定义（Component Spec）
- ✅ 错误处理
- ✅ 性能优化

## 使用示例

### 场景 1: 创建新的 Page Spec

用户提供：
```
页面名称：车辆详情
模块：car
Figma 链接：https://figma.com/design/xxx?node-id=1-100
```

执行：
1. 调用 Figma MCP 获取设计数据
2. 基于 `_template.spec.md` 生成 Spec
3. 自动填充 Figma 章节、设计规范、布局结构
4. 提示用户补充接口依赖和交互说明

### 场景 2: 更新现有 Spec 的设计规范

用户提供：
```
Spec 文件：docs/pages/car/car-detail.spec.md
Figma 链接：https://figma.com/design/xxx?node-id=1-100（已更新）
```

执行：
1. 读取现有 Spec
2. 调用 Figma MCP 获取最新设计数据
3. 更新 Figma 章节的"最后同步日期"
4. 更新设计规范章节
5. 保留其他章节内容不变

### 场景 3: 创建 Component Spec

用户提供：
```
组件名称：预约试驾面板
所属页面：车辆详情
Figma 链接：https://figma.com/design/xxx?node-id=0-200
```

执行：
1. 调用 Figma MCP 获取组件设计数据
2. 基于 `_component-template.spec.md` 生成 Spec
3. 自动填充 Figma 章节、设计规范、布局结构
4. 提示用户补充 Props 接口和交互说明

## 注意事项

### 1. Figma MCP 限制

- **图片资源 URL 有效期**：7 天（需定期重新提取）
- **速率限制**：Figma API 有速率限制，避免频繁调用
- **权限要求**：需要对 Figma 文件有查看权限

### 2. 数据准确性

- Figma MCP 提取的数据需要人工审核
- 复杂布局可能需要手动调整描述
- 颜色值可能需要对照 design-tokens 统一

### 3. 技术栈适配

Figma MCP 默认返回 React + Tailwind 代码，需要转换为项目技术栈：
- **云车库项目**：Vue 3 + uni-app（小程序端）、Vue 3 + Element Plus（管理端）
- **转换要点**：
  - React → Vue 3 Composition API
  - Tailwind classes → 项目样式系统
  - `className` → `class`
  - `onClick` → `@click`

### 4. 多端适配

如果 Figma 中有多端设计（小程序端、管理端），需要：
1. 分别提取各端的设计数据
2. 在 Spec 中标注跨端差异
3. 使用条件编译或响应式布局

## 错误处理

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| Figma MCP 未连接 | MCP Server 未配置 | 参考 `docs/design/FIGMA_MCP_SETUP.md` 配置 |
| 无权限访问文件 | Figma PAT 无文件权限 | 在 Figma 中添加查看权限 |
| node-id 格式错误 | URL 中的 node-id 格式不正确 | 确保格式为 `1-100` 或 `1:100` |
| 返回数据为空 | 节点不存在或已删除 | 检查 Figma 链接是否正确 |

## 最佳实践

1. **先提取，后补充**：先用 Figma MCP 提取设计数据，再人工补充业务逻辑
2. **定期同步**：设计变更后，重新调用 Figma MCP 更新 Spec
3. **保留历史**：更新 Spec 时，记录"最后同步日期"，方便追溯
4. **分层处理**：Page Spec 引用多个 Figma 链接，Component Spec 只引用单个
5. **验证数据**：提取后的颜色、字号等数值需对照 design-tokens 验证
