import { useState } from 'react';
import styles from './index.module.scss';

export default function Instructions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <div className={styles.header} onClick={() => setOpen(o => !o)}>
        <h3 className={styles.title}>使用说明</h3>
        <span className={styles.toggle}>{open ? '收起' : '展开'}</span>
      </div>

      {open && (
        <div className={styles.content}>
          <ol className={styles.list}>
            <li>点击日历日期，右侧卡片显示该日学习内容</li>
            <li>点击右侧卡片的"打卡"按钮录入学习记录</li>
            <li>点击"查看记录"查看学习统计</li>
            <li>支持按日/周/月查看数据</li>
            <li>右侧显示近3天需复习的课程</li>
            <li>点击复习提醒右上角 ⚙ 可调整复习间隔系数（0.5~3.0）</li>
            <li>支持导出/导入数据备份</li>
            <li>可分享学习记录为图片</li>
          </ol>
        </div>
      )}
    </div>
  );
}
