---
description: 创建新的业务组件（生成 Component Spec）
---

# 创建新组件 Workflow

用于创建业务组件的 Component Spec 文档。

## 使用场景

- 需要创建复杂的业务组件（如预约试驾面板、价格计算器、复杂表单）
- 组件会被多个页面复用
- 组件有独立的 Figma 设计稿

## 步骤

### 1. 收集信息

询问用户以下信息：
- **组件中文名**：如"预约试驾面板"
- **组件英文名**：如"BookingPanel"
- **组件类型**：业务组件 / 通用组件
- **所属页面**（如果是页面特有组件）：如"车辆详情页"
- **Figma 设计稿链接**（可选）：如 `https://figma.com/...?node-id=0-200`
- **所属模块**：如"car"（车辆模块）

### 2. 确定文件路径

根据组件类型确定路径：

**页面特有业务组件**：
```
docs/pages/{module}/components/{component-name}.spec.md
```

**跨页面通用组件**：
```
docs/components/{component-name}.spec.md
```

### 3. 生成 Component Spec

基于 `docs/pages/_component-template.spec.md` 模板生成 Spec 文件。

**如果用户提供了 Figma 链接**：
1. 调用 Figma MCP 的 `get_design_context` 工具获取设计数据
2. 自动填充以下内容：
   - 布局结构（基于 Figma 节点树）
   - 设计规范（颜色、字号、间距）
   - 子组件清单（基于 Figma 组件）
3. 手动补充：
   - Props 接口定义
   - 交互说明
   - 状态管理
   - 接口依赖

**如果用户未提供 Figma 链接**：
1. 使用模板生成基础 Spec
2. 提示用户后续补充 Figma 链接和设计细节

### 4. 创建目录（如不存在）

```bash
mkdir -p docs/pages/{module}/components
# 或
mkdir -p docs/components
```

### 5. 验证 Spec 完整性

检查以下必填项：
- ✅ 组件职责描述
- ✅ Props 接口定义
- ✅ 布局结构
- ✅ 交互说明
- ✅ 设计规范（如有 Figma 链接）

### 6. 更新父页面的 Page Spec

如果是页面特有组件，在父页面的 Page Spec 中添加引用：

```markdown
## 组件清单

| 组件 | 说明 | Spec 文档 | 是否已有 |
|------|------|----------|---------|
| {ComponentName} | {组件说明} | `components/{component-name}.spec.md` | ❌ |
```

## 示例

### 用户输入

```
组件中文名：预约试驾面板
组件英文名：BookingPanel
组件类型：业务组件
所属页面：车辆详情页
所属模块：car
Figma 链接：https://figma.com/design/xxx?node-id=0-200
```

### 生成文件

`docs/pages/car/components/booking-panel.spec.md`

### 更新父页面

在 `docs/pages/car/car-detail.spec.md` 中添加：

```markdown
## 组件清单

| 组件 | 说明 | Spec 文档 | 是否已有 |
|------|------|----------|---------|
| BookingPanel | 预约试驾浮层面板 | `components/booking-panel.spec.md` | ❌ |
```

## 注意事项

1. **区分组件类型**：
   - 简单 UI 组件（Button、Input）→ 不需要 Component Spec
   - 复杂业务组件 → 需要 Component Spec
   - 可复用组件 → 放在 `docs/components/`

2. **Figma MCP 使用**：
   - 如果有 Figma 链接，优先使用 Figma MCP 提取设计数据
   - 提取后的数据需要人工审核和补充

3. **Props 设计原则**：
   - 必填 props 放在前面
   - 回调函数以 `on` 开头
   - 提供合理的默认值

4. **文档同步**：
   - 组件开发完成后，在 Spec 中标记 ✅
   - 设计变更时，及时更新 Spec 和同步日期
