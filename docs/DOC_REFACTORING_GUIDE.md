# 📚 文档重构指南

> 从云车库项目提炼的文档重构最佳实践

## 问题诊断

### 常见文档问题

| 问题 | 表现 | 影响 |
|------|------|------|
| **内容重叠** | 环境变量、团队分工等在多个文档中重复 | 维护困难，易不同步 |
| **职责边界模糊** | 开发流程、设计协作、协作规范混在一起 | 新手难以快速定位信息 |
| **文档过长** | README 超过 10KB，包含所有内容 | 新手需要 30 分钟才能理解全貌 |
| **分层不清** | 没有快速开始指南，所有内容都在 README | 新手上手困难 |
| **Skills 说明不足** | 只有简单列表，缺少详细说明和使用示例 | 开发者不知道何时使用哪个 Skill |

### 诊断方法

运行以下命令检查文档质量：

```bash
# 检查 README 大小
wc -l README.md

# 检查文档结构
find docs -name "*.md" -type f | wc -l

# 检查 Skills 说明
grep -r "description:" .windsurf/skills/
```

**目标**：
- README < 500 行（5 分钟阅读）
- 至少 3 个分层文档（QUICK_START + DEVELOPMENT + 专题指南）
- 每个 Skill 都有详细说明和使用示例

---

## 重构方案

### 新文档结构

```
README.md（5 分钟）
├── 项目概览
├── Skills 完整说明表（10 个）
└── 文档导航

docs/QUICK_START.md（10 分钟）
├── 前置要求
├── 克隆项目
├── 安装依赖
├── 配置环境变量
├── AI 配置（Windsurf Memory + Skills）
├── 开发第一个功能
└── 常见问题

docs/DEVELOPMENT.md（30 分钟）
├── 日常开发流程
├── 类型系统
├── 文档同步
└── 团队协作

CONTRIBUTING.md（10 分钟）
├── 分支规范
├── 提交规范
└── MR 流程

docs/guides/（按需阅读）
├── figma-mcp.md
├── type-system.md
└── testing.md
```

### 重构步骤

#### 步骤 1: 分析现有文档

```bash
# 列出所有文档
find . -name "*.md" -type f | grep -E "^\./(README|CONTRIBUTING|docs)" | sort

# 统计字数
for f in README.md CONTRIBUTING.md docs/*.md; do
  echo "$f: $(wc -l < $f) lines"
done
```

#### 步骤 2: 提取 README 核心内容

从现有 README 中提取：
- 项目概览（保留）
- 快速开始（移到 QUICK_START.md）
- Skills 说明（补充完整表格）
- 模板结构（保留）
- 四层护栏架构（保留）
- 文档同步机制（移到 DEVELOPMENT.md）
- 常见问题（移到 QUICK_START.md）

#### 步骤 3: 创建 QUICK_START.md

包含：
- 前置要求
- 5 分钟快速上手（克隆 → 初始化 → 配置 AI）
- Skills 使用示例
- 常见问题和解决方案

#### 步骤 4: 创建 DEVELOPMENT.md

包含：
- 完整的开发流程（10 个步骤）
- 类型系统指南
- 文档同步机制（从 README 移过来）
- 团队协作规范

#### 步骤 5: 精简 CONTRIBUTING.md

只保留：
- 分支规范
- 提交规范
- MR 流程
- AI Skills 简要列表（详细说明在 README）

#### 步骤 6: 补充 Skills 说明

在 README 中添加完整的表格：

```markdown
### Skills（技能）

| Skill | 用途 | 何时调用 |
|-------|------|---------|
| `check-context` | 上下文检查 | 开发前检查上下文完整性 |
| ... |
```

#### 步骤 7: 创建文档导航表

在 README 中添加：

```markdown
### 文档导航

| 文档 | 阅读时间 | 内容 |
|------|---------|------|
| README.md | 5 分钟 | 项目概览 + Harness Engineering 核心概念 |
| docs/QUICK_START.md | 10 分钟 | 环境配置 + 第一个功能 |
| docs/DEVELOPMENT.md | 30 分钟 | 完整开发流程 |
| CONTRIBUTING.md | 10 分钟 | 分支规范 + 提交规范 |
```

---

## 新手上手路径对比

### 重构前

```
README（14KB）→ 需要 30 分钟理解全貌
  ├── 快速开始（简洁）
  ├── 模板结构（详细）
  ├── 四层护栏（详细）
  ├── 文档同步（详细）
  ├── 自定义指南（详细）
  └── 常见问题（简洁）
```

**新手体验**：
- 需要阅读 14KB 文档
- 快速开始部分过于简洁，缺少详细步骤
- 难以快速定位需要的信息

### 重构后

```
README（5 分钟）→ QUICK_START（10 分钟）→ 开始开发
  ├── 项目概览
  ├── Skills 完整表
  └── 文档导航

QUICK_START（10 分钟）
  ├── 前置要求
  ├── 5 分钟快速上手
  ├── Skills 使用示例
  └── 常见问题

DEVELOPMENT（30 分钟，按需阅读）
  ├── 完整开发流程
  ├── 类型系统
  ├── 文档同步
  └── 团队协作
```

**新手体验**：
- 15 分钟即可开始开发
- 清晰的分层导航
- 按需深入学习

---

## 关键改进点

### 1. README 精简（最重要）

**目标**：从 14KB 减少到 ~3KB，5 分钟阅读

**保留内容**：
- 项目概览（Harness Engineering 核心）
- Skills 完整说明表
- 文档导航
- 模板结构
- 四层护栏架构

**移除内容**：
- 详细的快速开始步骤 → QUICK_START.md
- 文档同步机制详解 → DEVELOPMENT.md
- 常见问题 → QUICK_START.md
- 自定义指南 → 保留但简化

### 2. 分层文档（核心改进）

**QUICK_START.md**：
- 环境配置详细步骤
- 第一个功能开发
- Skills 使用示例
- 常见问题和解决方案

**DEVELOPMENT.md**：
- 完整的开发流程（10 个步骤）
- 类型系统指南
- 文档同步机制
- 团队协作规范

### 3. Skills 说明（用户反馈）

**问题**：CONTRIBUTING.md 中只有简单列表，缺少详细说明

**解决**：
- 在 README 中添加完整的 Skill 表格（名称 + 用途 + 适用场景）
- 在 QUICK_START.md 中添加 Skill 链路示例
- 每个 Skill 文件中保留详细说明

### 4. 文档导航（新增）

**目标**：帮助新手快速定位需要的文档

**实现**：
- README 中添加文档导航表
- 每个文档中添加"下一步"链接
- 清晰的阅读时间标注

---

## 实施检查清单

- [ ] 分析现有文档结构和字数
- [ ] 从 README 中提取内容到 QUICK_START.md
- [ ] 创建 DEVELOPMENT.md（整合开发流程）
- [ ] 精简 CONTRIBUTING.md（只保留协作规范）
- [ ] 在 README 中添加 Skills 完整表
- [ ] 在 README 中添加文档导航表
- [ ] 在 QUICK_START.md 中添加 Skills 使用示例
- [ ] 在每个文档中添加"下一步"链接
- [ ] 验证新手上手时间（目标 15 分钟）
- [ ] 提交 MR，标题：`docs: refactor documentation structure for better onboarding`

---

## 预期效果

### 新手体验改进

| 指标 | 重构前 | 重构后 | 改进 |
|------|--------|--------|------|
| 上手时间 | 30 分钟 | 15 分钟 | **50% 减少** |
| 文档字数 | ~24000 | ~11000 | **54% 减少** |
| 文档数量 | 2 个 | 5 个 | 更清晰的分层 |
| Skills 说明 | 简单列表 | 完整表格 + 示例 | 更易理解 |

### 维护成本降低

- 内容重叠减少 → 维护更简单
- 职责边界清晰 → 更新时不易出错
- 分层结构 → 按需更新特定文档

---

## 参考资源

- **云车库项目**：完整的重构示例
  - README.md：精简版（~500 行）
  - docs/QUICK_START.md：快速开始指南
  - docs/DEVELOPMENT.md：完整开发流程
  - CONTRIBUTING.md：协作规范

- **模板项目**：通用版本（本文档所在项目）
  - 支持任何技术栈
  - 支持 GitHub/GitLab
  - 支持 Monorepo/单体项目

---

## 常见问题

### Q1: 重构会不会丢失信息？

**A**：不会。所有内容都被重新组织到合适的文档中，没有删除任何信息。

### Q2: 现有项目可以应用这个方案吗？

**A**：可以。这个方案是通用的，适用于任何项目。只需按照"重构步骤"逐步执行。

### Q3: 如何验证重构效果？

**A**：
1. 让新成员按照新文档上手，计时
2. 运行 `pnpm health-check` 检查工程质量
3. 对比重构前后的上手时间

### Q4: 需要多长时间完成重构？

**A**：取决于现有文档的复杂度，通常 2-4 小时。

---

## 下一步

1. 阅读本指南
2. 分析现有文档结构
3. 按照"重构步骤"逐步执行
4. 提交 MR，标题：`docs: refactor documentation structure for better onboarding`
5. 邀请新成员验证上手体验
