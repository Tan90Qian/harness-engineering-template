# Harness Engineering Template

> 一个与业务无关、技术栈无关的前端/全栈工程化模板。
> 提供 AI 辅助开发护栏、代码质量工具链、CI 流水线和结构化文档体系。

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
│   └── workflows/
│       └── ci.yml                  # 🚀 CI 流水线（GitHub Actions）
│
├── .windsurf/
│   └── workflows/
│       ├── new-feature.md          # 🆕 开发新功能工作流
│       ├── new-page.md             # 📄 开发新页面工作流
│       └── fix-bug.md              # 🐛 修复 Bug 工作流
│
├── docs/
│   ├── design/
│   │   └── design-tokens.md        # 🎨 设计规范 Token
│   └── pages/
│       ├── _template.spec.md       # 📋 页面需求模板
│       └── .gitkeep
│
├── scripts/
│   └── setup.js                    # ⚙️  交互式初始化脚本
│
├── README.md                       # 📖 本文件
├── CONTRIBUTING.md                 # 🤝 贡献指南
└── LICENSE                         # ⚖️  MIT 许可
```

## 三层护栏架构

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
└─────────────────────────────────────────────────┘
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
