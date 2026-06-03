import { useState } from 'react';

export default function Instructions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
        <h3 style={{ fontSize: 15 }}>使用说明</h3>
        <span style={{ color: 'var(--text-light)', fontSize: 13 }}>{open ? '收起' : '展开'}</span>
      </div>

      {open && (
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li>在日历中点击日期进行打卡记录</li>
            <li>点击"查看记录"查看学习统计</li>
            <li>支持按日/周/月查看数据</li>
            <li>右侧显示近3天需复习的课程</li>
            <li>可调整复习间隔系数（0.5~3.0）</li>
            <li>支持导出/导入数据备份</li>
            <li>可分享学习记录为图片</li>
          </ol>
        </div>
      )}
    </div>
  );
}
