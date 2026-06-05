import { useState, useEffect, useRef } from 'react';
import podcastsData from '../../data/podcasts.json';
import type { Podcast } from '../../types/podcast';
import { LEVEL_COLORS } from '../../types/podcast';
import {
  getCollections,
  addCollection,
  removeCollection,
  getNotes,
  addNote,
  removeNote,
  updateNote,
} from '../../podcastStore';
import type { PodcastCollection, PodcastNote } from '../../types/podcast';
import styles from './index.module.scss';

interface PodcastDetailProps {
  lessonId: number;
  onBack: () => void;
  tick: number;
}

export default function PodcastDetail({ lessonId, onBack, tick }: PodcastDetailProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    selectedText: string;
  } | null>(null);
  const [noteModal, setNoteModal] = useState<{ selectedText: string } | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [editingNote, setEditingNote] = useState<number | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const podcasts = podcastsData as Podcast[];
  const lesson = podcasts.find(p => p.id === lessonId);

  const [collections, setCollections] = useState<PodcastCollection[]>([]);
  const [notes, setNotes] = useState<PodcastNote[]>([]);

  useEffect(() => {
    if (lesson) {
      setCollections(getCollections(lesson.id));
      setNotes(getNotes(lesson.id));
    }
  }, [lesson, tick]);

  // 关闭右键菜单
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  if (!lesson) {
    return (
      <div className={`card ${styles.container}`}>
        <p>课程未找到</p>
        <button className="btn-secondary" onClick={onBack}>返回</button>
      </div>
    );
  }

  // 右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        selectedText: selection.toString().trim(),
      });
    }
  };

  // 收藏
  const handleCollect = () => {
    if (contextMenu) {
      const newCollection: PodcastCollection = {
        lessonId: lesson.id,
        text: contextMenu.selectedText,
        context: '',
        timestamp: Date.now(),
      };
      addCollection(newCollection);
      setCollections(getCollections(lesson.id));
      setContextMenu(null);
    }
  };

  // 打开笔记弹窗
  const handleOpenNote = () => {
    if (contextMenu) {
      setNoteModal({ selectedText: contextMenu.selectedText });
      setNoteInput('');
      setContextMenu(null);
    }
  };

  // 保存新笔记
  const handleSaveNewNote = () => {
    if (noteModal && noteInput.trim()) {
      const newNote: PodcastNote = {
        lessonId: lesson.id,
        selectedText: noteModal.selectedText,
        note: noteInput.trim(),
        timestamp: Date.now(),
      };
      addNote(newNote);
      setNotes(getNotes(lesson.id));
    }
    setNoteModal(null);
    setNoteInput('');
  };

  // 更新笔记
  const handleUpdateNote = (timestamp: number) => {
    if (noteInput.trim()) {
      updateNote(lesson.id, timestamp, noteInput.trim());
      setNotes(getNotes(lesson.id));
    }
    setEditingNote(null);
    setNoteInput('');
  };

  // 删除
  const handleDeleteCollection = (text: string) => {
    removeCollection(lesson.id, text);
    setCollections(getCollections(lesson.id));
  };

  const handleDeleteNote = (timestamp: number) => {
    removeNote(lesson.id, timestamp);
    setNotes(getNotes(lesson.id));
  };

  return (
    <div className={`card ${styles.container}`}>
      {/* 顶部导航 */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          返回列表
        </button>
        <div className={styles.lessonMeta}>
          <span className={styles.code}>{lesson.code}</span>
          <span className={styles.levelTag} style={{ background: LEVEL_COLORS[lesson.level] }}>
            {lesson.level}
          </span>
        </div>
      </div>

      {/* 标题 */}
      <h1 className={styles.title}>{lesson.title}</h1>

      {/* 对话内容 */}
      <div
        ref={contentRef}
        className={styles.content}
        onContextMenu={handleContextMenu}
      >
        {lesson.content}
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={handleCollect}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            收藏
          </button>
          <button onClick={handleOpenNote}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            记笔记
          </button>
        </div>
      )}

      {/* 底部：收藏 + 笔记 */}
      {(collections.length > 0 || notes.length > 0) && (
        <div className={styles.bottomArea}>
          {/* 收藏 */}
          {collections.length > 0 && (
            <div className={styles.section}>
              <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                收藏
              </h3>
              <div className={styles.tags}>
                {collections.map(c => (
                  <span key={c.timestamp} className={styles.tag}>
                    {c.text}
                    <button onClick={() => handleDeleteCollection(c.text)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 笔记 */}
          {notes.length > 0 && (
            <div className={styles.section}>
              <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                笔记
              </h3>
              <div className={styles.notesList}>
                {notes.map(n => (
                  <div key={n.timestamp} className={styles.noteItem}>
                    <div className={styles.noteQuote}>"{n.selectedText}"</div>
                    {editingNote === n.timestamp ? (
                      <div className={styles.noteEdit}>
                        <textarea
                          value={noteInput}
                          onChange={e => setNoteInput(e.target.value)}
                          autoFocus
                        />
                        <div className={styles.noteActions}>
                          <button className="btn-primary" onClick={() => handleUpdateNote(n.timestamp)}>保存</button>
                          <button className="btn-secondary" onClick={() => setEditingNote(null)}>取消</button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.noteBody}>
                        <p>{n.note}</p>
                        <div className={styles.noteActions}>
                          <button onClick={() => { setEditingNote(n.timestamp); setNoteInput(n.note); }}>编辑</button>
                          <button onClick={() => handleDeleteNote(n.timestamp)}>删除</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 笔记弹窗 */}
      {noteModal && (
        <div className="modal-overlay" onClick={() => setNoteModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>添加笔记</h3>
            <p className={styles.modalQuote}>"{noteModal.selectedText}"</p>
            <textarea
              className={styles.modalTextarea}
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="写下你的笔记..."
              autoFocus
            />
            <div className={styles.modalActions}>
              <button className="btn-primary" onClick={handleSaveNewNote}>保存</button>
              <button className="btn-secondary" onClick={() => setNoteModal(null)}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
