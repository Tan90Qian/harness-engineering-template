---
description: 开发一个新页面
---

// turbo
1. **Context check**
   - Read `docs/pages/{module}/{page}.spec.md` → create if missing
   - Read types for this module → create if missing
   - Read `docs/design/design-tokens.md` → use defaults if missing

2. **Context complete → generate; incomplete → guide completion first**

3. **Generate page file**
   - Follow project's UI framework conventions
   - Import shared types from the central types package
   - Handle loading/error/empty states

4. **Update routing config**

// turbo
5. **Run typecheck**

6. **Output file list**
