import { useState } from 'react';
import {
  getRecords, addRecord, getFirstDates, setFirstDate,
  todayStr, showToast
} from '../store';

export default function DailyCard({ selected, onRefresh, tick }) {
  const [modal, setModal] = useState(false);
  const [lesson, setLesson] = useState('');
  const [count, setCount] = useState('1');

  // tick 变化触发重渲染，直接读最新数据
  void tick;
  const date = selected || todayStr();
  const records = getRecords().filter(r => r.date === date);

  // 按课程聚合
  const grouped = Object.entries(
    records.reduce((acc, r) => {
      acc[r.lesson] = (acc[r.lesson] || 0) + r.count;
      return acc;
    }, {})
  ).sort((a, b) => Number(a[0]) - Number(b[0]));

  const handleCheckin = () => {
    if (!lesson || parseInt(lesson) < 0) { showToast('请输入有效课程编号'); return; }
    if (!count || parseInt(count) < 1) { showToast('请输入有效学习次数'); return; }
    addRecord(parseInt(lesson), parseInt(count), date);
    const firstDates = getFirstDates();
    if (!firstDates[parseInt(lesson)]) setFirstDate(parseInt(lesson), date);
    setModal(false);
    setLesson('');
    setCount('1');
    showToast('打卡成功');
    onRefresh();
  };

  const openModal = () => {
    setLesson('');
    setCount('1');
    setModal(true);
  };

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        {/* 标题行 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 16 }}>学习内容</h3>
            <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>
              {date === todayStr() ? `今天 · ${date}` : date}
            </p>
          </div>
          <button
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: 13 }}
            onClick={openModal}
          >
            打卡
          </button>
        </div>

        {/* 课程列表 */}
        {grouped.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-light)' }}>暂无学习记录</p>
        ) : (
          grouped.map(([ls, total]) => (
            <div key={ls} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 10px', background: '#f9f9f9', borderRadius: 8, marginBottom: 6,
              fontSize: 13,
            }}>
              <span>第 <strong>{ls}</strong> 课</span>
              <span style={{
                background: 'var(--primary)', color: '#fff',
                borderRadius: 100, padding: '2px 10px', fontSize: 12, fontWeight: 600,
              }}>× {total} 次</span>
            </div>
          ))
        )}
      </div>

      {/* 打卡弹窗 */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-content">
            <h3 style={{ marginBottom: 16, fontSize: 16 }}>{date} 打卡</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>课程编号</label>
              <input
                type="number" min={0} max={999}
                value={lesson} onChange={e => setLesson(e.target.value)}
                placeholder="请输入课程编号"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>学习次数</label>
              <input
                type="number" min={1}
                value={count} onChange={e => setCount(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setModal(false)}>取消</button>
              <button className="btn-primary" onClick={handleCheckin}>确认打卡</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
