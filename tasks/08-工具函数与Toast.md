# 任务08：Toast 提示与全局工具函数

## 实现位置
`app/src/store.js`（与数据层合并）

## 目标
实现底部居中的 Toast 提示组件，以及整个项目共用的工具函数。

## Toast 提示
```javascript
function showToast(msg, duration = 2000) {
  // 显示底部居中提示，duration 毫秒后自动消失
}
```
- 样式：黑色半透明圆角，白色文字，底部居中，z-index 最高
- 同一时间只显示一条（新的覆盖旧的）

## 全局工具函数

### 日期工具
```javascript
todayStr()                        // 返回今天 "YYYY-MM-DD"
formatDate(date)                  // Date 对象转 "YYYY-MM-DD"
addDays(date, n)                  // 返回 date+n 天的 Date 对象
getWeekStart(date)                // 返回该日期所在周的周一（周日特殊处理）
getWeekEnd(date)                  // 返回该日期所在周的周日
dateRangeLabel(tab, current)      // 生成时间段标签，如"2026-06-01 ~ 2026-06-07"
```

### 日期比较
```javascript
isSameDay(a, b)     // 两个 Date 或字符串是否同一天
isToday(dateStr)    // 是否今天
isFuture(dateStr)   // 是否未来日期
```

### 格式化显示
```javascript
friendlyDate(dateStr)  // 今天→"今天"，明天→"明天"，后天→"后天"，其他→"YYYY-MM-DD"
```

## 注意事项
- 所有日期计算统一使用本地时间（不使用 UTC）
- `getWeekStart` 必须正确处理周日（`getDay() === 0` 时 diff = -6）
