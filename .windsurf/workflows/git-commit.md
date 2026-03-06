---
description: 编写规范的 git commit 信息（英文 header + 中文 body）
---

# 编写 Git Commit 信息

> 生成符合 Conventional Commits 规范的提交信息。

## 规范

```
<type>(<scope>): <subject>  ← Header 英文，小写开头

<中文 body>                  ← Body 中文，用 - 列表描述改动

<footer>（可选）
```

## 步骤

1. **分析暂存的变更**
   // turbo
   运行 `git diff --cached --stat` 查看变更范围

2. **确定 type 和 scope**
   - type: `feat` | `fix` | `refactor` | `docs` | `test` | `ci` | `chore` | `perf` | `style`
   - scope: 参照 `commitlint.config.js` 中定义的 scope 白名单

3. **生成 commit 信息**
   - Header：英文，简洁描述（不超过 72 字符），小写开头
   - Body：中文，用 `- ` 列表描述具体改动（What / Why / How）
   - Footer（可选）：关联 issue、破坏性变更等

4. **输出格式示例**

```
feat(web): add user profile page

- 新增用户资料页面组件
- 实现头像上传功能
- 添加表单验证逻辑

动机：用户需要管理个人信息。
```

```
fix(core): resolve null pointer in data parser

- 修复解析空数据时抛出异常的问题
- 添加空值边界检查

根因：未处理输入为 null 的边界情况。
```

5. **提交**
   将生成的信息提供给用户，由用户确认后执行 `git commit`
