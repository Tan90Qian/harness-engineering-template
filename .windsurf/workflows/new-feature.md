---
description: 开发一个完整的新功能（从 spec 到测试）
---

## Steps

1. **Clarify requirements**
   Confirm scope: which modules, which pages, core interactions. Ask if ambiguous.

2. **Prepare context** (fill in what's missing)
   // turbo
   a. Check if types exist for this feature → create if missing
   // turbo
   b. Check if a page spec exists in `docs/pages/` → create if missing
   // turbo
   c. Check `docs/design/design-tokens.md` → remind if missing

3. **Generate backend/API code** (if applicable)
   - Create module/controller/service following project conventions
   - Use mock data initially, mark with `// TODO: replace with real implementation`
   - Import types from the shared types package

4. **Generate frontend page** (if applicable)
   - Follow project's UI framework conventions
   - Import shared types
   - Handle loading/error/empty states

5. **Generate tests**
   - Unit tests for utilities
   - Integration tests for API endpoints

// turbo
6. **Type check**
   Run the project's typecheck command

7. **Summary**
   List all files created/modified
