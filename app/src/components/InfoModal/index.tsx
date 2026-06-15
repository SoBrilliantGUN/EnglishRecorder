import { useState } from 'react';
import { MAX_LESSON } from '../../types/podcast';
import Modal from '../Modal';
import { CloseIcon } from '../icons';
import { useScaleToFit } from '../../hooks/useScaleToFit';
import styles from './index.module.scss';

interface InfoModalProps {
  onClose: () => void;
}

interface Section {
  id: string;
  color: string;
  title: string;
  items: string[];
}

const sections: Section[] = [
  {
    id: 'checkin',
    color: '#07C160',
    title: '打卡与记录',
    items: [
      `点击日历日期，右侧卡片显示该日学习内容`,
      `点击"打卡"按钮录入学习记录（课程编号 1-${MAX_LESSON}）`,
      `在课程详情页点击"单课打卡"，可单独记录该课的学习次数`,
      `打卡成功后会弹出分享卡片；若已关闭，点击"分享"按钮可再次打开`,
      `点击"查看记录"查看学习统计，支持按日/周/月查看`,
      `支持导出/导入数据备份`,
    ],
  },
  {
    id: 'course',
    color: '#3498db',
    title: '课程学习',
    items: [
      `日历下方为课程库，点击可查看对话文本`,
      `在课程详情页点击"译"按钮，可切换翻译显示方式：完全显示 / 悬浮显示（鼠标悬停英文行时显示中文）`,
    ],
  },
  {
    id: 'review',
    color: '#F59E0B',
    title: '复习提醒',
    items: [
      `右侧显示近3天需复习的课程`,
      `点击复习提醒右上角 ⚙ 可调整复习间隔系数（0.5~3.0）`,
    ],
  },
  {
    id: 'share',
    color: '#27ae60',
    title: '分享功能',
    items: [
      `可分享学习记录为图片，提供三种主题风格：暗黑科技、清新活泼、奶油纸本`,
      `学了1门课显示单课卡片，2-5门课显示完整列表，超5门课自动切换为 Top 4 重点展示`,
    ],
  },
];

export default function InfoModal({ onClose }: InfoModalProps) {
  const { targetRef, contentStyle } = useScaleToFit(80);
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(['checkin', 'course', 'review']),
  );

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Modal onClose={onClose} maxWidth={480} label="使用说明">
      <div className={styles.infoHeader}>
        <span className={styles.infoTitle}>使用说明</span>
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon size={16} />
        </button>
      </div>

      <div ref={targetRef} style={contentStyle}>
        {sections.map((section) => (
          <div key={section.id} className={styles.section}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggle(section.id)}
              type="button"
            >
              <span className={styles.sectionDot} style={{ background: section.color }} />
              <span className={styles.sectionTitle}>{section.title}</span>
              <span
                className={`${styles.chevron}${expanded.has(section.id) ? ` ${styles.chevronDown}` : ''}`}
              >
                ▸
              </span>
            </button>
            {expanded.has(section.id) && (
              <ul className={styles.sectionList}>
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className={styles.divider} />

        <div className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggle('saladict')}
            type="button"
          >
            <span className={styles.sectionDot} style={{ background: '#5c6a6b' }} />
            <span className={styles.sectionTitle}>推荐搭配：沙拉查词</span>
            <span
              className={`${styles.chevron}${expanded.has('saladict') ? ` ${styles.chevronDown}` : ''}`}
            >
              ▸
            </span>
          </button>
          {expanded.has('saladict') && (
            <div className={styles.tipSection}>
              <p className={styles.tipDesc}>
                阅读课程对话时，配合{' '}
                <a
                  href="https://saladict.crimx.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.tipLink}
                >
                  Saladict 沙拉查词
                </a>
                {' '}浏览器插件效果更佳：
              </p>
              <ul className={styles.tipList}>
                <li>划词即弹出多词典聚合释义（牛津、朗文、柯林斯等）</li>
                <li>自动发音，支持英美音切换</li>
                <li>生词本保存单词及上下文，辅助艾宾浩斯复习</li>
                <li>支持整页翻译，快速理解对话背景</li>
                <li>支持 Chrome / Edge / Firefox</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
