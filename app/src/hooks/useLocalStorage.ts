import { useState } from 'react';

/**
 * 与 localStorage 双向同步的 state hook。
 * 读取时自动 JSON.parse，写入时自动 JSON.stringify。
 * 字符串类型会直接存取，无需额外序列化。
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // 存的是裸字符串（非 JSON），直接返回
      return raw as unknown as T;
    }
  });

  const setValue = (value: T) => {
    setStored(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [stored, setValue];
}
