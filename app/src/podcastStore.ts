/**
 * EnglishPod 课程数据存储层
 * 用 localStorage 存储用户的收藏和笔记数据
 */

import type { PodcastCollection, PodcastNote } from './types/podcast';

const COLLECTIONS_KEY = 'ep_podcast_collections';
const NOTES_KEY = 'ep_podcast_notes';

// ==================== 收藏 ====================

export function getCollections(lessonId?: number): PodcastCollection[] {
  const data = localStorage.getItem(COLLECTIONS_KEY);
  if (!data) return [];

  const all: PodcastCollection[] = JSON.parse(data);
  return lessonId !== undefined
    ? all.filter(c => c.lessonId === lessonId)
    : all;
}

export function addCollection(collection: PodcastCollection): void {
  const all = getCollections();
  // 去重：同一课的同样文本不重复收藏
  const exists = all.some(c =>
    c.lessonId === collection.lessonId && c.text === collection.text
  );
  if (!exists) {
    all.push(collection);
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(all));
  }
}

export function removeCollection(lessonId: number, text: string): void {
  const all = getCollections();
  const filtered = all.filter(c =>
    !(c.lessonId === lessonId && c.text === text)
  );
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(filtered));
}

// ==================== 笔记 ====================

export function getNotes(lessonId?: number): PodcastNote[] {
  const data = localStorage.getItem(NOTES_KEY);
  if (!data) return [];

  const all: PodcastNote[] = JSON.parse(data);
  return lessonId !== undefined
    ? all.filter(n => n.lessonId === lessonId)
    : all;
}

export function addNote(note: PodcastNote): void {
  const all = getNotes();
  all.push(note);
  localStorage.setItem(NOTES_KEY, JSON.stringify(all));
}

export function updateNote(lessonId: number, timestamp: number, newNote: string): void {
  const all = getNotes();
  const target = all.find(n => n.lessonId === lessonId && n.timestamp === timestamp);
  if (target) {
    target.note = newNote;
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  }
}

export function removeNote(lessonId: number, timestamp: number): void {
  const all = getNotes();
  const filtered = all.filter(n =>
    !(n.lessonId === lessonId && n.timestamp === timestamp)
  );
  localStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
}
