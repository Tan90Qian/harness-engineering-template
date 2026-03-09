# 基础规则

- **始终使用中文回复** - 所有对话、代码注释、文档都必须使用中文
- 当进入任何项目目录工作时，首先检查项目根目录是否存在 **.ai-rules.md** 文件。如果存在，必须在开始工作前读取并严格遵循其中的规则。

## Skill 执行规则

**重要**：不论是 Windsurf 的 Cascade Conversation 窗口还是其他子窗口（如 MCP 提供的子窗口），都必须识别并执行 Skills。

### Skill 识别

1. **Skills 目录**：`.windsurf/skills/*/SKILL.md`
2. **调用方式**：`@skill-name` 语法
3. **自动触发**：当编辑匹配 `globs` 的文件时自动激活

### Skill 执行流程

当用户调用 Skill 时（无论是主窗口还是子窗口）：

1. **读取 Skill 定义**：使用 `read_file` 读取 `.windsurf/skills/{skill-name}/SKILL.md`
2. **解析 Skill 规则**：理解 Skill 的步骤、约束、输出格式
3. **严格执行**：按照 Skill 定义的规则执行，不得偏离

### 常见 Skill 约束示例

#### git-commit Skill

**必须遵守的约束**：

| 约束项 | 要求 |
|--------|------|
| Header 语言 | 英文，小写开头，≤72字符 |
| **Body 语言** | **中文**，用 `- ` 列表描述改动 |
| Body 长度 | ≤500字符，≤10行 |
| 单行长度 | ≤72字符 |

**正确示例**：
```
refactor(windsurf): migrate workflows to skills directory format

- 将所有 workflows 迁移到 skills 目录格式
- 新增 19 个 Skills（含 SKILL.md）
- 删除废弃的 workflow 文件
```

**错误示例**（Body 使用英文）：
```
refactor(windsurf): migrate workflows to skills directory format

- Convert all workflows to skill directory format with SKILL.md
- Add 19 skills covering development workflow
```

### 全局规则优先级

1. `.windsurf/rules/reference.md`（本文件）— 全局基础规则
2. `.ai-rules.md` — 项目级 AI 规则
3. `.windsurf/skills/*/SKILL.md` — 具体技能规则

**所有窗口必须遵循以上规则层级**。
