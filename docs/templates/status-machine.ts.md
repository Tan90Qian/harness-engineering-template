# 状态机定义模板

> 用于定义业务实体的状态流转规则，AI 据此生成正确的状态操作 UI 逻辑。

## 模板

```typescript
// {module}-status.ts

/**
 * {实体名称}状态机
 *
 * 状态流转图：
 *   状态A → 状态B → 状态C → 状态D
 *                          ↘ 状态E
 *
 * 各状态允许的操作：
 *   状态A: [查看详情, 编辑, 提交]
 *   状态B: [查看详情, 审核通过, 审核驳回]
 *   状态C: [查看详情, 确认完成]
 *   状态D: [查看详情]
 *   状态E: [查看详情, 重新提交]
 */
export type EntityStatus =
  | 'draft'        // 草稿
  | 'pending'      // 待审核
  | 'approved'     // 已通过
  | 'completed'    // 已完成
  | 'rejected';    // 已驳回

/** 状态流转规则（当前状态 → 允许的下一状态列表） */
export const ENTITY_TRANSITIONS: Record<EntityStatus, EntityStatus[]> = {
  draft: ['pending'],
  pending: ['approved', 'rejected'],
  approved: ['completed'],
  completed: [],
  rejected: ['draft'],  // 可重新编辑后再提交
};

/** 各状态允许的操作 */
export const ENTITY_ACTIONS: Record<EntityStatus, string[]> = {
  draft: ['view', 'edit', 'submit'],
  pending: ['view', 'approve', 'reject'],
  approved: ['view', 'complete'],
  completed: ['view'],
  rejected: ['view', 'resubmit'],
};

/** 状态显示配置（用于 UI 渲染） */
export const ENTITY_STATUS_CONFIG: Record<EntityStatus, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'default' },
  pending: { label: '待审核', color: 'warning' },
  approved: { label: '已通过', color: 'success' },
  completed: { label: '已完成', color: 'success' },
  rejected: { label: '已驳回', color: 'error' },
};
```

## 使用说明

1. 复制模板到项目类型目录，重命名为 `{module}-status.ts`
2. 修改状态枚举和流转规则
3. 添加 JSDoc 注释描述状态流转图
4. AI 读到此文件后能正确生成：
   - 状态标签颜色
   - 按钮显隐逻辑
   - 状态流转操作
