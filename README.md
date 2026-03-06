# Harness Engineering Template

> 一个与业务无关、技术栈无关的前端/全栈工程化模板。
> 提供 AI 辅助开发护栏、代码质量工具链、测试策略、CI 流水线和结构化文档体系。

## Harness Engineering 核心组成部分

“Harness Engineering”的本质是为 AI 辅助开发装上护栏（harness = 缰绳/护套），确保 AI 产出可靠、一致、可维护的代码。

它由以下 **7 个核心组成部分** 构成，按优先级从高到低：

| 优先级 | 组成部分 | 价值 | 本模板对应 |
|--------|---------|------|----------|
| **P0** | **类型安全** | AI 写错字段/类型 → 编译立即报错，是 AI 工程化的基石 | `tsconfig.json`（strict mode） |
| **P0** | **AI 上下文规则** | 让 AI 理解项目规范，避免每次重复说明 | `.ai-rules.md` + Windsurf Memory |
| **P0** | **代码质量工具链** | 统一代码风格，自动拦截不规范代码 | ESLint + Prettier + commitlint + Husky |
| **P1** | **结构化文档** | AI 生成 UI 时有据可依，避免猜测布局和样式 | Design Tokens + Page Spec 模板 |
| **P1** | **CI 流水线** | 自动执行质量门禁，AI 无法绕过 | GitHub Actions CI |
| **P1** | **自动化测试** | 以机器速度验证 AI 产出的正确性 | `docs/testing-strategy.md` 测试策略指南 |
| **P2** | **文档同步防护** | 防止上下文过期导致 AI 生成偏差 | SYNC_MAP + CI 检查 + PR 模板 |
| **P2** | **AI 行为引导** | 引导 AI 按标准流程开发，信息不足时提醒而非猜测 | Windsurf Workflows |

### 各组成部分的价值说明

- **类型安全**：最高优先级。TypeScript strict 是 AI 工程化的基石——类型正确 → 代码大概率正确；类型错误 → 代码一定有问题。
- **AI 上下文规则**：最高优先级。没有 `.ai-rules.md`，AI 每次都在猜测项目规范，生成结果不可控。
- **代码质量工具链**：AI 生成的代码也必须符合团队规范，lint-staged + Husky 确保每次提交都经过检查。
- **结构化文档**：花 15 分钟写 Page Spec，比花 30 分钟跟 AI 来回对话调整高效得多。
- **CI 流水线**：自动执行 typecheck + lint + test，是质量的最后一道防线。
- **自动化测试**：AI 让代码生成速度提升数倍，但引入缺陷的速度也同步加快，自动化测试是唯一能以同等速度验证正确性的手段。
- **文档同步防护**：解决渐进性退化问题——代码变了文档没跟上，AI 效果逐渐下降。
- **AI 行为引导**：Workflow 确保 AI 按标准流程开发，不跳步、不猜测。

## 为什么需要这个模板？

现代项目不缺框架和库，缺的是**工程化护栏**——确保 AI 辅助开发、团队协作、代码质量始终在轨道上的基础设施。

本模板从实际项目中提炼，解决以下问题：

| 问题 | 模板方案 |
|------|---------|
| AI 不了解项目上下文 | `.ai-rules.md` — 项目级 AI 规则，Git 版本控制 |
| AI 插件覆写项目规则文件 | `.windsurfrules` 已 gitignore，规则独立存放 |
| 代码风格不统一 | ESLint + Prettier + EditorConfig 统一配置 |
| 提交信息混乱 | Conventional Commits + commitlint 强制规范 |
| 缺少质量门禁 | GitHub Actions CI — typecheck + lint + test |
| AI 生成 UI 风格不一致 | `docs/design/design-tokens.md` — 设计规范 |
| AI 不知道页面需求 | `docs/pages/_template.spec.md` — Page Spec 模板 |
| AI 产出无法快速验证 | `docs/testing-strategy.md` — 测试策略指南 |
| 文档与代码逐渐脱节 | `docs/SYNC_MAP.md` + CI 自动检测 + PR 清单 |

## 快速开始

### 1. 使用模板

```bash
# 方式一：GitHub Template（推荐）
# 点击 GitHub 页面上的 "Use this template" 按钮

# 方式二：手动克隆
git clone https://github.com/YOUR_USERNAME/harness-engineering-template.git my-project
cd my-project
rm -rf .git
```

### 2. 运行初始化脚本

```bash
node scripts/setup.js
```

脚本会交互式询问：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| Project name | 项目名称（写入 package.json） | `my-project` |
| Description | 项目描述 | `A new project` |
| Package manager | pnpm / npm / yarn | `pnpm` |
| Monorepo mode | 是否启用 Monorepo（自动创建 turbo.json） | `n` |
| Commit scopes | 提交 scope 白名单 | `all,core,docs,ci,deps` |
| Node version | 最低 Node.js 版本 | `18` |

脚本会自动：
- 替换所有占位符（项目名、描述等）
- 配置 commitlint scope
- 调整 CI 流水线的包管理器
- 安装依赖
- 初始化 Git 仓库

### 3. 配置 AI 辅助开发

每位开发者需**一次性**在 Windsurf 中配置 Memory（约 30 秒）：

```
在 Windsurf 对话中发送：
"请创建一个 Windsurf Memory，内容为：
当进入任何项目目录工作时，首先检查项目根目录是否存在 .ai-rules.md 文件。
如果存在，必须在开始工作前读取并严格遵循其中的规则。"
```

配置后效果：
- ✅ 任何包含 `.ai-rules.md` 的项目都会自动加载工程规则
- ✅ 不受 AI 插件覆写 `.windsurfrules` 的影响
- ✅ 一次配置，所有项目通用

## 模板结构

```
harness-engineering-template/
├── .ai-rules.md                    # 🤖 AI 开发规则（Git 版本控制）
├── .editorconfig                   # ✏️  编辑器统一配置
├── .eslintrc.js                    # 🔍 ESLint 配置
├── .gitignore                      # 🚫 Git 忽略规则
├── .lintstagedrc.js                # 🔗 Git 暂存区 lint
├── .prettierrc                     # 💅 Prettier 格式化
├── .prettierignore                 # 💅 Prettier 忽略
├── commitlint.config.js            # 📝 提交信息规范
├── tsconfig.json                   # 🔧 TypeScript 配置
├── package.json                    # 📦 项目配置
│
├── .github/
│   ├── workflows/
│   │   └── ci.yml                  # 🚀 CI 流水线（含文档同步+健壮性检查）
│   └── PULL_REQUEST_TEMPLATE.md    # 📋 PR 模板（含文档检查清单）
│
├── .windsurf/
│   ├── skills/
│   │   ├── check-context.md        # 🔍 上下文完整性检查
│   │   ├── create-page-spec.md     # 📄 生成 Page Spec 模板
│   │   └── create-type-definition.md # 📐 生成类型定义模板
│   └── workflows/
│       ├── new-feature.md          # 🆕 开发新功能工作流
│       ├── new-page.md             # 📄 开发新页面工作流
│       ├── fix-bug.md              # 🐛 修复 Bug 工作流
│       ├── git-commit.md           # 📝 规范提交信息工作流
│       ├── health-check.md         # 📊 健壮性检查工作流
│       ├── doc-workflow.md         # 📋 文档工作流
│       └── switch-to-team-mode.md  # 🏢 切换团队模式工作流
│
├── docs/
│   ├── .doc-mode                   # 📋 文档模式标记（solo/team）
│   ├── .doc-constraint.json        # 📋 文档约束配置
│   ├── SYNC_MAP.md                 # 🔗 文档-代码同步映射表
│   ├── testing-strategy.md         # 🧪 测试策略指南
│   ├── design/
│   │   └── design-tokens.md        # 🎨 设计规范 Token
│   ├── pages/
│   │   ├── _template.spec.md       # 📋 页面需求模板（含跨端差异）
│   │   └── .gitkeep
│   └── templates/
│       ├── api-routes.ts.md        # 📐 API 路由索引模板
│       └── status-machine.ts.md    # 📐 状态机定义模板
│
├── scripts/
│   ├── setup.js                    # ⚙️  交互式初始化脚本（含 Monorepo 骨架）
│   ├── doc-sync-check.js           # 🔍 文档同步检查脚本
│   ├── ai-health-check.cjs         # 📊 AI 工程化健壮性自动检查
│   └── manage-doc-constraint.js    # 📋 文档模式管理脚本
│
├── README.md                       # 📖 本文件
├── CONTRIBUTING.md                 # 🤝 贡献指南
└── LICENSE                         # ⚖️  MIT 许可
```

## 四层护栏架构

```
┌─────────────────────────────────────────────────┐
│  Layer 1: 结构化上下文（AI 可直接读取）           │
│                                                 │
│  .ai-rules.md       → 项目级 AI 规则            │
│  docs/design/       → Design Tokens（设计规范）   │
│  docs/pages/        → Page Spec（页面结构描述）   │
├─────────────────────────────────────────────────┤
│  Layer 2: 质量护栏（自动执行，无法绕过）           │
│                                                 │
│  tsc --noEmit       → TypeScript 类型检查        │
│  ESLint             → 代码风格 + 潜在错误         │
│  commitlint         → 提交信息规范               │
│  CI 门禁            → MR 合并必须全部通过         │
├─────────────────────────────────────────────────┤
│  Layer 3: Windsurf Workflows（AI 行为引导）       │
│                                                 │
│  new-feature.md     → 功能开发标准流程           │
│  new-page.md        → 页面生成标准流程           │
│  fix-bug.md         → Bug 修复标准流程           │
├─────────────────────────────────────────────────┤
│  Layer 4: 文档同步防护（防止上下文过期）       │
│                                                 │
│  docs/SYNC_MAP.md   → 代码-文档声明式映射      │
│  doc-sync-check.js  → CI 自动检测文档新鲜度    │
│  PR 模板            → 强制文档确认清单          │
│  Workflow 步骤      → AI 开发时强制文档同步    │
└─────────────────────────────────────────────────┘
```

## 文档-代码同步机制

**核心问题**：代码变了但文档没跟上 → AI 读到过期上下文 → 生成代码偏离实际。

### 四层防护机制

| 层级 | 机制 | 触发时机 | 强度 |
|------|------|---------|------|
| L1 | `docs/SYNC_MAP.md` 声明式映射 | 文件创建时 | 约定 |
| L2 | Workflow 强制步骤 | AI 开发时 | 引导 |
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

## 自定义指南

### 添加新的 commit scope

编辑 `commitlint.config.js` 中的 `scope-enum` 数组。

### 添加新的 Windsurf Workflow

在 `.windsurf/workflows/` 中创建 `.md` 文件：

```markdown
---
description: 工作流简要描述
---

1. 步骤一
2. 步骤二
// turbo
3. 可自动执行的步骤
```

### 运行工程质量检查

```bash
# 7 维度健壮性评分
pnpm health-check

# JSON 格式输出（CI 集成）
pnpm health-check:json
```

### 切换文档模式

```bash
# 查看当前模式
node scripts/manage-doc-constraint.js

# 切换到团队模式（不可逆）
node scripts/manage-doc-constraint.js --switch-to-team
```

### 扩展为 Monorepo

如果初始化时未选择 Monorepo，后续可手动添加：

```bash
# 1. 创建 pnpm-workspace.yaml
echo "packages:\n  - 'packages/*'" > pnpm-workspace.yaml

# 2. 添加 turbo
pnpm add -Dw turbo

# 3. 创建 turbo.json
# 参考 setup.js 中的 turboConfig 对象
```

### 切换包管理器

`.lintstagedrc.js` 中的 `pnpm exec` 替换为：
- **npm**: `npx`
- **yarn**: `yarn`

## AI 插件兼容性

本模板解决了 AI IDE 插件（如 z-chat MCP）覆写 `.windsurfrules` 导致项目规则丢失的问题。

**机制**：
- `.windsurfrules` → gitignored，交给插件自由管理
- `.ai-rules.md` → Git 版本控制，项目规则的唯一来源
- Windsurf Memory → 用户级持久化，指引 AI 读取 `.ai-rules.md`

| 场景 | 结果 |
|------|------|
| 插件覆写 `.windsurfrules` | ✅ 不影响项目规则 |
| 换用其他 AI 插件 | ✅ 不影响 |
| 新成员克隆项目 | ✅ `.ai-rules.md` 在 Git 中 |
| 新成员首次使用 Windsurf | ⚠️ 需做一次 Memory 配置 |

## 常见问题

### Corepack 签名验证失败

```bash
# 临时解决
COREPACK_INTEGRITY_KEYS="" pnpm install

# CI 中已自动配置（见 .github/workflows/ci.yml）
```

### ESLint / Prettier 命令找不到

确保使用 `pnpm exec` 前缀（已在 `.lintstagedrc.js` 中配置）：

```bash
pnpm exec eslint --version
pnpm exec prettier --version
```

### commitlint 报 subject-case 错误

提交信息 subject 必须小写开头：

```bash
# ✅ 正确
git commit -m "feat(core): add user authentication"

# ❌ 错误（大写开头）
git commit -m "feat(core): Add user authentication"
```

## License

MIT
