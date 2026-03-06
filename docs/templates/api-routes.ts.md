# API 路由索引模板

> 在项目类型目录中创建 `api-routes.ts`，以注释形式列出所有 API 接口。
> AI 可快速索引所有可用接口，无需外部文档。

## 模板

```typescript
// api-routes.ts
// 该文件让 AI 快速了解所有可用接口，无需外部文档

/**
 * API 路由索引 — 所有接口一览
 *
 * ── 认证 ──
 * POST   /auth/login          → LoginRequest → LoginResponse
 * POST   /auth/refresh         → { refreshToken } → TokenPair
 * POST   /auth/logout          → void
 * GET    /auth/profile         → → UserProfile
 *
 * ── 模块A ──
 * GET    /module-a             → QueryParams → PaginatedResponse<Entity>
 * GET    /module-a/:id         → → Entity
 * POST   /module-a             → CreateRequest → Entity
 * PUT    /module-a/:id         → UpdateRequest → Entity
 * DELETE /module-a/:id         → → void
 *
 * ── 模块B ──
 * ...（按项目实际接口补充）
 *
 * ── 公共 ──
 * POST   /upload/oss-token     → → OSSSTSToken
 * GET    /config/system        → → SystemConfig
 */
```

## 使用说明

1. 在项目类型目录（如 `shared/types/`）中创建 `api-routes.ts`
2. 按上述格式列出所有 API 接口
3. 每行格式：`METHOD  /path  → RequestType → ResponseType`
4. 按业务模块分组，用 `── 模块名 ──` 分隔
5. 保持与实际 API 同步更新
