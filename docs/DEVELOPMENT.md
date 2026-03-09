# 📖 开发指南

> 完整的开发流程：代码开发 + 文档同步

## 目录

- [日常开发流程](#日常开发流程)
- [类型系统](#类型系统)
- [文档同步](#文档同步)
- [团队协作](#团队协作)

---

## 日常开发流程

### 总览

```
需求分析 → 准备上下文 → 创建分支 → 编码 → 测试 → 提交 → MR → CI → Review → 合并
```

### 1. 需求分析

确定需求类型，选择对应 Skill 链路：

| 需求类型 | Skill 链路 | 说明 |
|---------|------------|------|
| 新功能 | `check-context` → `create-type-definition` → `create-page-spec` → `create-*-page/create-bff-module` | 从类型定义到实现的完整链路 |
| 新页面 | `check-context` → `create-page-spec` → `create-react-page/create-uni-page` | 上下文检查后生成页面并更新路由 |
| 新组件 | `check-context` → `create-component-spec` → `complete-implementation` | 先规格再实现 |
| Bug 修复 | `fix-bug` | 定位根因 → 最小修复 → 回归验证 |
| 补全实现 | `complete-implementation` | 对比 spec 补全缺失组件/功能 |

### 2. 准备上下文

| 上下文 | 路径 | 必要性 |
|--------|------|--------|
| 接口类型 | `src/types/{module}.ts` | **必须** — 没有类型不允许写业务代码 |
| Page Spec | `docs/pages/{module}/{page}.spec.md` | **推荐** — AI 生成准确率提升 50%+ |
| 设计规范 | `docs/design/design-tokens.md` | 已有 — 直接引用 |
| 状态机 | `src/types/{module}-status.ts` | 涉及状态流转时必须 |

**创建 Page Spec**：

```bash
# 方式 1: 使用 Skill（推荐）
# 按顺序触发：check-context -> create-page-spec
# 按提示输入页面信息，AI 自动生成 Spec

# 方式 2: 手动创建
mkdir -p docs/pages/{module}
cp docs/pages/_template.spec.md docs/pages/{module}/{page}.spec.md
# 编辑填写布局、组件、接口、交互说明
```

### 3. 创建分支

```bash
# 功能分支
git checkout -b feature/add-user-list

# Bug 修复分支
git checkout -b fix/login-crash
```

从 `main`/`develop` 分支切出，完成后合并回主干。

### 4. 编码

**启动开发**：
```bash
pnpm dev
```

**编码规范**：
- 遵循 ESLint + Prettier 规则（提交时自动检查）
- 使用 TypeScript strict 模式
- 组件命名：PascalCase
- 文件命名：kebab-case
- 类型定义优先于 `any`

### 5. 测试

```bash
# 类型检查
pnpm typecheck

# 单元测试
pnpm test

# E2E 测试（可选）
pnpm test:e2e
```

### 6. 提交

**使用 Skill 生成规范提交信息**：
`git-commit`

**手动提交**：
```bash
git add .
git commit -m "feat(user): add user list page

- 新增用户列表页面
- 集成数据表格组件
- 添加筛选和搜索功能"
```

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 7. 提交 MR

```bash
git push origin feature/add-user-list
```

在 GitHub/GitLab 中创建 Merge Request：
- 标题：简洁描述变更
- 描述：What / Why / How
- 关联需求/缺陷 ID
- 指定 Reviewer

### 8. CI 检查

自动执行：
- ESLint + Prettier
- TypeScript 类型检查
- 单元测试
- 文档同步检查（`doc-sync-check`）
- AI 工程质量评分（`health-check`）

### 9. Code Review

Reviewer 检查：
- 代码质量和规范
- 类型定义是否完整
- Page Spec 是否同步
- 测试覆盖率

### 10. 合并

Review 通过后，合并到主干分支。

---

## 类型系统

### 核心原则

**类型优先**：先定义类型，再写业务代码。

```
src/types/{module}.ts  →  业务代码
         ↑
    唯一类型源
```

### 类型定义位置

| 类型 | 位置 | 示例 |
|------|------|------|
| 业务实体 | `src/types/{module}.ts` | `User`, `Order`, `Product` |
| API 请求/响应 | `src/types/{module}.ts` | `UserListQuery`, `UserDetailResponse` |
| 状态机 | `src/types/{module}-status.ts` | `OrderStatus`, `OrderStatusTransition` |
| API 路由 | `src/types/api-routes.ts` | `/api/user/list`, `/api/order/:id` |
| 通用类型 | `src/types/common.ts` | `Pagination`, `ApiResponse` |

### 类型变更流程

```
1. 在 src/types/ 中修改类型定义
2. 运行 pnpm typecheck
3. 编译报错 → 找到所有需要修改的地方
4. 修改所有引用方
5. typecheck 通过 → 提交 MR
```

类型是全栈共享的，变更一处全端感知，CI 自动验证。

---

## 文档同步

### 核心问题

代码变了但文档没跟上 → AI 读到过期上下文 → 生成代码偏离实际。

### 四层防护机制

| 层级 | 机制 | 触发时机 | 强度 |
|------|------|---------|------|
| L1 | `docs/SYNC_MAP.md` 声明式映射 | 文件创建时 | 约定 |
| L2 | Skill 强制步骤 | AI 开发时 | 引导 |
| L3 | PR 模板检查清单 | 代码 Review 时 | 人工 |
| L4 | `doc-sync-check.js` CI 门禁 | MR 合并前 | 自动 |

### SYNC_MAP 工作原理

`docs/SYNC_MAP.md` 声明代码与文档的对应关系：

```markdown
| 代码路径 | 对应文档 | 同步级别 |
|----------|---------|----------|
| `src/pages/**/*` | `docs/pages/*.spec.md` | strict |
| `src/types/**/*.ts` | `docs/design/design-tokens.md` | warn |
```

**同步级别**：
- **strict**：代码变了文档没变 → CI 报错，阻止合并
- **warn**：CI 警告，不阻止但会在 PR 中提示
- **info**：仅 AI 开发时提醒

### 手动运行检查

```bash
# 检查当前分支 vs main
node scripts/doc-sync-check.js

# 检查最近一次提交
node scripts/doc-sync-check.js --base=HEAD~1

# strict 模式（不通过时退出码非零）
node scripts/doc-sync-check.js --strict
```

---

## 团队协作

### 分支规范

| 分支 | 用途 |
|------|------|
| `main` / `master` | 生产环境，仅通过 MR 合入 |
| `develop` | 开发主干 |
| `feature/*` | 功能分支 |
| `fix/*` | Bug 修复分支 |
| `hotfix/*` | 紧急修复 |

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

- 中文描述改动点1
- 中文描述改动点2
```

### 知识互备

| 机制 | 频率 | 说明 |
|------|------|------|
| MR 描述 | 每次提交 | 写清 What / Why / How |
| Swagger 文档 | 实时 | 任何人都能理解接口 |
| `.ai-rules.md` | 维护 | AI 也能理解项目规范 |
| 代码走读 | 每周 | 互相讲解核心变更 |

---

## 常见问题

### Q1: 如何处理类型变更？

1. 在 `src/types/` 中修改类型
2. 运行 `pnpm typecheck` 查看影响范围
3. 修改所有引用方（编译器会提示）
4. 确保所有 typecheck 通过
5. 提交 MR，注明"类型变更"

### Q2: 如何处理文档变更？

1. 更新对应的 Spec 文档
2. 更新 `docs/SYNC_MAP.md` 映射关系
3. 在 MR 描述中说明文档变更
4. CI 自动检查文档同步

### Q3: 如何保证文档和代码同步？

1. CI 自动运行 `doc-sync-check` 检查
2. MR Review 时检查 Page Spec 是否更新
3. 使用 `pnpm health-check` 定期评分

---

## 下一步

- ⚡ 快速开始：[`QUICK_START.md`](QUICK_START.md)
- 🤝 协作规范：[`../CONTRIBUTING.md`](../CONTRIBUTING.md)
- 🏗️ 架构说明：[`ARCHITECTURE.md`](ARCHITECTURE.md)
- 🧪 测试策略：[`testing-strategy.md`](testing-strategy.md)
- 🔗 文档同步：[`SYNC_MAP.md`](SYNC_MAP.md)
