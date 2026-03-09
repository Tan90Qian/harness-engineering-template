# ⚡ 快速开始

> 10 分钟完成环境配置并开发第一个功能

## 前置要求

- Node.js >= 18
- pnpm >= 9（自动通过 Corepack 启用）
- Git
- 推荐使用 [Windsurf](https://windsurf.ai) IDE

## 1. 使用模板（1 分钟）

```bash
# 方式一：GitHub Template（推荐）
# 点击 GitHub 页面上的 "Use this template" 按钮

# 方式二：手动克隆
git clone https://github.com/YOUR_USERNAME/harness-engineering-template.git my-project
cd my-project
rm -rf .git
```

## 2. 初始化项目（2 分钟）

```bash
# 运行交互式初始化脚本
node scripts/setup.js
```

脚本会询问：
- **Project name**：项目名称
- **Description**：项目描述
- **Package manager**：pnpm / npm / yarn
- **Monorepo mode**：是否启用 Monorepo
- **Commit scopes**：提交 scope 白名单
- **Node version**：最低 Node.js 版本

脚本会自动：
- 替换所有占位符
- 配置 commitlint scope
- 调整 CI 流水线
- 安装依赖
- 初始化 Git 仓库

## 3. 配置 AI 辅助开发（2 分钟）

### 3.1 配置 Windsurf Memory

在 Windsurf 中发送以下消息（**仅需一次**）：

```
请创建一个 Windsurf Memory，内容为：
当进入任何项目目录工作时，首先检查项目根目录是否存在 .ai-rules.md 文件。
如果存在，必须在开始工作前读取并严格遵循其中的规则。
```

### 3.2 可用 Skills（Skill-only）

配置完成后，统一使用 Skills：

| Skill | 用途 |
|------|------|
| `check-context` | 开发前上下文检查 |
| `create-type-definition` | 创建/更新类型定义 |
| `create-page-spec` | 创建 Page Spec |
| `create-component-spec` | 创建 Component Spec |
| `create-react-page` | 生成 React 页面 |
| `create-uni-page` | 生成 uni-app 页面 |
| `create-bff-module` | 生成 BFF 模块 |
| `complete-implementation` | 对照 spec 补全实现 |
| `fix-bug` | 根因定位 + 最小修复 |
| `health-check` | 工程质量评分 |

## 4. 开发第一个功能（3 分钟）

### 场景：添加一个新页面

使用 Skill 链路快速生成页面：

1. `check-context`
2. `create-page-spec`
3. `create-type-definition`
4. `create-react-page` 或 `create-uni-page`

AI 会询问：
- 页面名称：如"用户列表"
- 所属模块：如"user"
- Figma 链接（可选）

AI 会自动：
1. 创建 Page Spec（`docs/pages/user/user-list.spec.md`）
2. 生成页面代码
3. 更新路由配置

### 手动开发流程

如果不使用 AI 生成，按以下步骤：

1. **创建类型定义**（`src/types/user.ts`）
2. **创建 Page Spec**（`docs/pages/user/user-list.spec.md`）
3. **开发页面代码**（`src/pages/user/UserList.tsx`）
4. **更新路由**（`src/routes.tsx`）

## 5. 验证开发环境

运行以下命令验证环境配置：

```bash
# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 运行测试
pnpm test

# AI 工程质量评分
pnpm health-check
```

## 常见问题

### Q1: `pnpm install` 失败

**原因**：网络问题或镜像配置问题。

**解决**：
```bash
# 使用阿里云镜像
pnpm config set registry https://registry.npmmirror.com

# 重新安装
rm -rf node_modules pnpm-lock.yaml
COREPACK_INTEGRITY_KEYS="" pnpm install
```

### Q2: Corepack 签名验证失败

**原因**：阿里云 npm 镜像不支持 Corepack 完整性校验。

**解决**：
```bash
COREPACK_INTEGRITY_KEYS="" pnpm install
```

### Q3: 类型检查失败

**原因**：类型定义不一致。

**解决**：
```bash
# 重新构建
pnpm build

# 重新检查
pnpm typecheck
```

## 下一步

- 📖 阅读 [开发指南](DEVELOPMENT.md) 了解完整开发流程
- 🤝 阅读 [协作规范](../CONTRIBUTING.md) 了解分支和提交规范
- 🏗️ 阅读 [架构说明](ARCHITECTURE.md) 了解项目结构
- 🧪 阅读 [测试策略](testing-strategy.md) 了解测试方法

## 获取帮助

- 项目文档：`docs/` 目录
- AI Skills：查看 `.windsurf/skills/*/SKILL.md`
- 问题反馈：提交 Issue 或 PR
