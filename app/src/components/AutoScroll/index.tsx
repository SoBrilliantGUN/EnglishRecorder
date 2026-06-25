import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUpIcon } from '../icons';
import styles from './index.module.scss';

// 8 级速度：10 ~ 120 px/s
const SPEED_LEVELS = [10, 25, 40, 55, 70, 85, 100, 120];
const DEFAULT_LEVEL = 3; // 84 px/s
const STORAGE_KEY = 'ep_auto_scroll_speed';
const HINTS_SEEN_KEY = 'ep_auto_scroll_hints_seen';
const SCROLL_THRESHOLD = 200;

function loadLevel(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const n = parseInt(raw, 10);
      if (n >= 0 && n < SPEED_LEVELS.length) return n;
    }
  } catch { /* quota / disabled */ }
  return DEFAULT_LEVEL;
}

function saveLevel(level: number) {
  try { localStorage.setItem(STORAGE_KEY, String(level)); } catch { /* ignore */ }
}

interface AutoScrollProps {
  onPrev?: () => void;
  onNext?: () => void;
}

export default function AutoScroll({ onPrev, onNext }: AutoScrollProps) {
  const [level, setLevelState] = useState(loadLevel);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showKeyHints, setShowKeyHints] = useState(false);

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  // 理想滚动位置累加器（避免每帧从 scrollY 取值导致浏览器取整误差累积）
  const idealYRef = useRef(0);

  // 记录最近一次启动时间，用于防止点击触发的 wheel/touch 事件立即暂停
  const startTimeRef = useRef(0);

  const levelRef = useRef(level);
  levelRef.current = level;
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  // ── 回顶按钮显隐 ──
  useEffect(() => {
    const handler = () => setShowBackToTop(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── 自动滚动引擎 ──
  const stopLoop = useCallback(() => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    lastTimeRef.current = null;
  }, []);

  const loop = useCallback((timestamp: number) => {
    if (!isActiveRef.current || isPausedRef.current) {
      animRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
    const elapsed = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = timestamp;

    const speed = SPEED_LEVELS[levelRef.current];
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // 用理想位置累加器计算目标位置，不依赖 scrollY 避免取整误差累积
    idealYRef.current += speed * elapsed;
    if (idealYRef.current > maxScroll) idealYRef.current = maxScroll;
    const newY = idealYRef.current;

    document.documentElement.scrollTop = newY;

    if (newY >= maxScroll - 1) {
      isActiveRef.current = false;
      isPausedRef.current = false;
      setIsActive(false);
      setIsPaused(false);
      stopLoop();
      return;
    }

    animRef.current = requestAnimationFrame(loop);
  }, [stopLoop]);

  const startLoop = useCallback(() => {
    if (animRef.current !== null) return;
    lastTimeRef.current = null;
    idealYRef.current = window.scrollY;
    animRef.current = requestAnimationFrame(loop);
  }, [loop]);

  // ── 动作 ──
  const start = useCallback(() => {
    startTimeRef.current = performance.now();
    isActiveRef.current = true;
    isPausedRef.current = false;
    setIsActive(true);
    setIsPaused(false);
    startLoop();
    // 首次使用自动滚动时短暂显示键盘快捷键提示（仅一次）
    if (!localStorage.getItem(HINTS_SEEN_KEY)) {
      setShowKeyHints(true);
      setTimeout(() => setShowKeyHints(false), 6000);
      try { localStorage.setItem(HINTS_SEEN_KEY, '1'); } catch {}
    }
  }, [startLoop]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
    stopLoop();
  }, [stopLoop]);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
    startLoop();
  }, [startLoop]);

  const stop = useCallback(() => {
    isActiveRef.current = false;
    isPausedRef.current = false;
    setIsActive(false);
    setIsPaused(false);
    stopLoop();
    setShowSpeed(false);
  }, [stopLoop]);

  const togglePlay = useCallback(() => {
    if (!isActive) { start(); return; }
    if (isPaused) { resume(); } else { pause(); }
  }, [isActive, isPaused, start, pause, resume]);

  // ── 速度调节 ──
  const adjustSpeed = useCallback((delta: number) => {
    const next = Math.max(0, Math.min(SPEED_LEVELS.length - 1, levelRef.current + delta));
    levelRef.current = next;
    setLevelState(next);
    saveLevel(next);
  }, []);

  // ── 键盘快捷键 ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isFormElement = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      // ← → 切换课程（始终可用，不拦截表单元素）
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        if (isFormElement) return;
        e.preventDefault();
        e.stopPropagation();
        // 若正在自动滚动则先停止
        if (isActiveRef.current) {
          isActiveRef.current = false;
          isPausedRef.current = false;
          setIsActive(false);
          setIsPaused(false);
          stopLoop();
          setShowSpeed(false);
        }
        if (e.code === 'ArrowLeft' && onPrev) onPrev();
        if (e.code === 'ArrowRight' && onNext) onNext();
        return;
      }

      // + / - 调速（仅自动滚动时，支持主键盘和小键盘）
      if (e.code === 'Equal' || e.code === 'Minus' || e.code === 'NumpadAdd' || e.code === 'NumpadSubtract') {
        if (!isActiveRef.current) return;
        if (isFormElement) return;
        e.preventDefault();
        e.stopPropagation();
        adjustSpeed(e.code === 'Equal' || e.code === 'NumpadAdd' ? 1 : -1);
        return;
      }

      // ↑↓ 上下滚动 100px（不影响自动滚动状态）
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        if (isFormElement) return;
        e.preventDefault();
        e.stopPropagation();
        const delta = e.code === 'ArrowUp' ? -100 : 100;
        const newY = Math.max(0, Math.min(
          document.documentElement.scrollHeight - window.innerHeight,
          window.scrollY + delta,
        ));
        window.scrollTo({ top: newY, behavior: 'smooth' });
        // 同步理想位置累加器，避免自动滚动被 smooth scroll 打乱
        if (isActiveRef.current) {
          idealYRef.current = newY;
        }
        return;
      }

      // Space：未播放时启动，播放中则暂停/继续
      if (e.code === 'Space') {
        if (!isActiveRef.current) {
          e.preventDefault();
          e.stopPropagation();
          start();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (isPausedRef.current) {
          isPausedRef.current = false;
          setIsPaused(false);
          startLoop();
        } else {
          isPausedRef.current = true;
          setIsPaused(true);
          stopLoop();
        }
        return;
      }

      // Esc 退出
      if (e.code === 'Escape' && isActiveRef.current) {
        if (isFormElement) return;
        e.preventDefault();
        e.stopPropagation();
        isActiveRef.current = false;
        isPausedRef.current = false;
        setIsActive(false);
        setIsPaused(false);
        stopLoop();
        setShowSpeed(false);
        return;
      }
    };

    window.addEventListener('keydown', handler, { capture: true });
    return () => window.removeEventListener('keydown', handler, { capture: true });
  }, [start, startLoop, stopLoop, adjustSpeed, onPrev, onNext]);

  // ── 手动滚动暂停（启动后 200ms 内忽略，防止点击触发的滚轮事件立即暂停）──
  useEffect(() => {
    if (!isActive || isPaused) return;
    const handler = () => {
      if (performance.now() - startTimeRef.current < 200) return;
      pause();
    };
    window.addEventListener('wheel', handler, { passive: true });
    window.addEventListener('touchmove', handler, { passive: true });
    return () => {
      window.removeEventListener('wheel', handler);
      window.removeEventListener('touchmove', handler);
    };
  }, [isActive, isPaused, pause]);

  // ── 清理 ──
  useEffect(() => () => stopLoop(), [stopLoop]);

  // ── 回顶（若正在自动滚动则先停止） ──
  const scrollToTop = useCallback(() => {
    if (isActiveRef.current) {
      isActiveRef.current = false;
      isPausedRef.current = false;
      setIsActive(false);
      setIsPaused(false);
      stopLoop();
      setShowSpeed(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stopLoop]);

  const isExpanded = isActive;

  // ============================================================
  // 共享：速度控制按钮组
  // ============================================================
  const speedControl = (
    <>
      <span className={styles.speedLabel}>慢</span>
      <button
        className={styles.speedBtn}
        onClick={() => adjustSpeed(-1)}
        disabled={level === 0}
        aria-label="减速"
      >
        −
      </button>
      <span className={styles.speedLevel}>{level + 1}/8</span>
      <button
        className={styles.speedBtn}
        onClick={() => adjustSpeed(1)}
        disabled={level === SPEED_LEVELS.length - 1}
        aria-label="加速"
      >
        +
      </button>
      <span className={styles.speedLabel}>快</span>
    </>
  );

  // ============================================================
  // 桌面端：独立的回顶部按钮（非自动播放时显示，scrollY > 200）
  // ============================================================
  const standaloneBackToTop = !isExpanded && showBackToTop && (
    <div className={styles.standaloneBackToTop}>
      <button
        className={styles.standaloneBackToTopBtn}
        onClick={scrollToTop}
        title="回到顶部"
        aria-label="回到顶部"
      >
        <ChevronUpIcon size={18} />
      </button>
    </div>
  );

  // ============================================================
  // 桌面端：悬浮胶囊
  // ============================================================
  const desktopPill = (
    <div className={styles.desktopPill}>
      {standaloneBackToTop}
      <div className={`${styles.pill} ${isExpanded ? styles.pillExpanded : styles.pillCompact}`}>
        <button
          className={styles.playBtn}
          onClick={togglePlay}
          title={isActive && !isPaused ? '暂停' : '开始自动阅读'}
          aria-label={isActive && !isPaused ? '暂停' : '开始自动阅读'}
        >
          {isActive && !isPaused ? '⏸' : '▶'}
        </button>

        {isExpanded && (
          <>
            <button
              className={`${styles.iconBtn} ${showSpeed ? styles.settingsActive : ''}`}
              onClick={() => { setShowSpeed(v => !v); setShowKeyHints(false); }}
              title="阅读速度"
              aria-label="阅读速度"
            >
              ⚙
            </button>

            <button
              className={`${styles.iconBtn} ${styles.backToTopBtn} ${!showBackToTop ? styles.backToTopHidden : ''}`}
              onClick={scrollToTop}
              title="回到顶部"
              aria-label="回到顶部"
            >
              <ChevronUpIcon size={16} />
            </button>

            <button
              className={styles.iconBtn}
              onClick={() => { setShowKeyHints(v => !v); setShowSpeed(false); }}
              title="键盘快捷键"
              aria-label="键盘快捷键"
            >
              ⌨
            </button>

            <button
              className={`${styles.iconBtn} ${styles.closeBtn}`}
              onClick={stop}
              title="退出自动阅读（Esc）"
              aria-label="退出自动阅读"
            >
              ✕
            </button>
          </>
        )}

        {showSpeed && (
          <div className={styles.speedPopup}>
            {speedControl}
          </div>
        )}

        {showKeyHints && (
          <div className={styles.keyHintsPopup}>
            <div className={styles.keyHint}><kbd>← →</kbd> 切换课程</div>
            <div className={styles.keyHint}><kbd>↑ ↓</kbd> 上下滚动</div>
            <div className={styles.keyHint}><kbd>Space</kbd> 暂停 / 继续</div>
            <div className={styles.keyHint}><kbd>+ −</kbd> 调速</div>
            <div className={styles.keyHint}><kbd>Esc</kbd> 退出</div>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================
  // 移动端：底部控制条（始终可见，不会"关闭后无法打开"）
  // ============================================================
  const mobileBar = (
    <>
      <div className={`${styles.mobileSpeedPopup} ${showSpeed ? styles.mobileSpeedPopupVisible : ''}`}>
        {speedControl}
      </div>

      <div className={styles.mobileBar}>
        <div className={styles.mobileLeft}>
          <button
            className={`${styles.mobileIconBtn} ${styles.mobileBackToTop} ${!showBackToTop ? styles.mobileBackToTopHidden : ''}`}
            onClick={scrollToTop}
            title="回到顶部"
            aria-label="回到顶部"
          >
            <ChevronUpIcon size={18} />
          </button>
        </div>

        <div className={styles.mobileCenter}>
          <button
            className={styles.mobilePlayBtn}
            onClick={togglePlay}
            title={isActive && !isPaused ? '暂停' : '开始自动阅读'}
            aria-label={isActive && !isPaused ? '暂停' : '开始自动阅读'}
          >
            {isActive && !isPaused ? '⏸' : '▶'}
          </button>
        </div>

        <div className={styles.mobileRight}>
          <button
            className={`${styles.mobileIconBtn} ${showSpeed ? styles.settingsActive : ''}`}
            onClick={() => setShowSpeed(v => !v)}
            title="阅读速度"
            aria-label="阅读速度"
          >
            ⚙
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {desktopPill}
      {mobileBar}
    </>
  );
}
