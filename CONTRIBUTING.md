# Contributing Guide

## 开发环境

- Node.js >= 18
- 推荐使用 [Windsurf](https://windsurf.ai) IDE + `.ai-rules.md` 自动加载

## 分支规范

| 分支 | 用途 |
|------|------|
| `main` / `master` | 生产环境，仅通过 MR 合入 |
| `develop` | 开发主干 |
| `feature/*` | 功能分支 |
| `fix/*` | Bug 修复分支 |
| `hotfix/*` | 紧急修复 |

## 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>
```

### Type

| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 格式调整（不影响逻辑） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试 |
| `chore` | 构建/工具/依赖变更 |
| `ci` | CI 配置变更 |

### Scope

在 `commitlint.config.js` 中定义，运行 `setup.js` 时可自定义。

### 示例

```bash
git commit -m "feat(core): add user authentication"
git commit -m "fix(web): resolve login redirect loop"
git commit -m "chore(deps): upgrade typescript to 5.8"
```

## 代码质量

提交前会自动执行（通过 Husky + lint-staged）：

1. **ESLint** — 代码规范检查 + 自动修复
2. **Prettier** — 格式化
3. **commitlint** — 提交信息规范检查

CI 流水线额外检查：

4. **TypeScript** — 类型检查 (`tsc --noEmit`)
5. **Tests** — 自动化测试

## AI 辅助开发

### Windsurf Skills（Skill-only）

本模板不保留 Workflow 入口，统一使用 Skills。

最小可落地 Skill 列表：

- `check-context` — 开发前上下文检查
- `create-type-definition` — 创建/更新类型定义
- `create-page-spec` — 创建页面 Spec
- `create-component-spec` — 创建组件 Spec
- `create-react-page` — 生成 React 页面
- `create-uni-page` — 生成 uni-app 页面
- `create-bff-module` — 生成 BFF 模块
- `complete-implementation` — 对照 Spec 补全实现
- `fix-bug` — 根因定位与最小修复
- `health-check` — 工程化健壮性检查

### Page Spec

新页面开发前，先在 `docs/pages/` 中创建 Page Spec：

```bash
cp docs/pages/_template.spec.md docs/pages/module/page-name.spec.md
```

填写后，AI 可据此生成高质量代码。

## MR 规范

- 标题遵循 Conventional Commits 格式
- 描述写清 What / Why / How
- 必须通过 CI 所有检查
- 至少一人 Review
