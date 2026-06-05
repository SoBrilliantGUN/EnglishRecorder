# 任务08：Toast 提示与全局工具函数

## 实现位置
`app/src/store.ts`（与数据层合并）

## 目标
实现底部居中的 Toast 提示组件，以及整个项目共用的工具函数。

## Toast 提示
```typescript
function showToast(msg: string): void
```
- 样式：黑色半透明圆角，白色文字，底部居中，z-index 最高
- 同一时间只显示一条（新的覆盖旧的）
- 使用 CSS animation `toastShow` 控制显隐，无 setTimeout

## 全局工具函数（基于 dayjs）

### 日期工具
```typescript
todayStr(): string                    // 返回今天 "YYYY-MM-DD"
formatDate(date: Date): string        // Date 对象转 "YYYY-MM-DD"（dayjs.format）
addDays(date: Date, n: number): Date  // 返回 date+n 天的 Date 对象（dayjs.add）
getWeekStart(date: Date): Date        // 返回该日期所在周的周一（周日特殊处理）
getWeekEnd(date: Date): Date          // 返回该日期所在周的周日
```

### 日期比较
```typescript
isSameDay(a: string | Date, b: string | Date): boolean  // 两个日期是否同一天
isFuture(dateStr: string): boolean                       // 是否未来日期
```

### 格式化显示
```typescript
friendlyDate(dateStr: string): string  // 今天→"今天"，明天→"明天"，后天→"后天"，其他→原字符串
```

## 注意事项
- 日期处理统一使用 dayjs，不再手写 Date 操作
- 所有日期计算统一使用本地时间（不使用 UTC）
- `getWeekStart` 必须正确处理周日（`getDay() === 0` 时 diff = -6）
