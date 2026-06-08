import { MAX_LESSON } from '../../types/podcast';
import Modal from '../Modal';
import { CloseIcon } from '../icons';
import styles from './index.module.scss';

interface InfoModalProps {
  onClose: () => void;
}

export default function InfoModal({ onClose }: InfoModalProps) {
  return (
    <Modal onClose={onClose} maxWidth={480}>
      <div className={styles.infoHeader}>
        <span className={styles.infoTitle}>使用说明</span>
        <button className="modal-close-btn" onClick={onClose}><CloseIcon size={16} /></button>
      </div>

        <ol className={styles.list}>
          <li>点击日历日期，右侧卡片显示该日学习内容</li>
          <li>点击右侧卡片的"打卡"按钮录入学习记录（课程编号 1-{MAX_LESSON}）</li>
          <li>日历下方为课程库，点击可查看对话文本</li>
          <li>点击"查看记录"查看学习统计</li>
          <li>支持按日/周/月查看数据</li>
          <li>右侧显示近3天需复习的课程</li>
          <li>点击复习提醒右上角 ⚙ 可调整复习间隔系数（0.5~3.0）</li>
          <li>支持导出/导入数据备份</li>
          <li>可分享学习记录为图片</li>
          <li>点击顶部 ☾ 切换暗黑/亮色模式</li>
          <li>点击顶部 ⚙ 可设置是否显示复习提醒</li>
        </ol>

        <div className={styles.divider} />

        <div className={styles.tipSection}>
          <div className={styles.tipTitle}>💡 推荐搭配：沙拉查词</div>
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
    </Modal>
  );
}
