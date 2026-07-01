# 后端联调 TODO

> 后端接口就绪后，按以下清单逐一替换。每项包含当前代码和应改回的代码。

---

## 1. App.tsx — 删除默认用户常量

**位置**: `app/src/App.tsx` 第 28-33 行

**当前**（删除这 6 行）:
```ts
// TODO: 后端就绪后删除此默认用户，恢复登录流程
const DEFAULT_USER: UserProfile = {
  phone: '13800000000',
  nickname: '',
  avatar: '',
};
```

---

## 2. App.tsx — 恢复用户状态初始化

**位置**: `app/src/App.tsx` 第 52 行

**当前**:
```ts
const [user, setUser] = useState<UserProfile | null>(() => getUser() || DEFAULT_USER);
```

**改为**:
```ts
const [user, setUser] = useState<UserProfile | null>(() => getUser());
```

---

## 3. App.tsx — 恢复退出登录逻辑

**位置**: `app/src/App.tsx` 第 176-185 行

**当前**:
```ts
onUpdate={(updatedUser) => {
  if (!updatedUser) {
    // 退出登录时重置为默认用户（后端就绪后改回 setUser(null)）
    setUser(DEFAULT_USER);
    setSelectedLessonId(null);
    setPodcastPage(1);
  } else {
    setUser(updatedUser);
  }
}}
```

**改为**:
```ts
onUpdate={(updatedUser) => {
  setUser(updatedUser);
  if (!updatedUser) {
    // 退出登录时重置视图状态
    setSelectedLessonId(null);
    setPodcastPage(1);
  }
}}
```

---

## 4. LoginPage — 接入真实接口

**位置**: `app/src/components/LoginPage/index.tsx`

当前为模拟登录（接受任意 6 位验证码，600ms 模拟延迟）。后端就绪后：

- `handleSendCode`（第 50 行）: 调用后端发送验证码接口
- `handleLogin`（第 64 行）: 调用后端登录接口，使用真实 token/session
- 可能需要新增: token 持久化、自动登录检测（token 有效性校验）

---

## 5. store.ts — 可能需要新增

视后端接口设计，可能需要：
- `getToken()` / `saveToken()` / `clearToken()` — token 管理
- `getUser()` 改为从 token 解析或调用后端接口获取
- 登录状态判断从「是否存有 ep_user」改为「token 是否有效」

---

## 6. 其他可能需要调整的点

- **网络请求层**: 项目目前无 HTTP 客户端，需引入（如 axios / fetch 封装）
- **请求拦截**: token 自动附带、过期自动刷新
- **离线兜底**: 网络异常时 localStorage 作为降级方案
- **ProfilePage**: 头像上传可能需要改为 OSS 直传
