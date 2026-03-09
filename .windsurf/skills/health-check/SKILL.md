---
name: health-check
description: 运行 AI 工程化健壮性检查并给出改进建议
---

# Health Check Skill

## 步骤

1. 运行 `pnpm health-check`。
2. 如需机器可读输出，运行 `pnpm health-check:json`。
3. 按维度汇总问题（规则、skills、文档、测试、质量、CI、同步）。
4. 给出优先级排序（P0/P1/P2）与修复建议。
