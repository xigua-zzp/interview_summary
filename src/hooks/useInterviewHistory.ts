import { useState, useCallback, useEffect } from 'react';
import { InterviewHistoryItem } from '../types';
import { AnalysisResultData } from '../services/deepseek';

const STORAGE_KEY = 'interview_history';

export function useInterviewHistory() {
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 从 localStorage 加载历史记录
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // 保存历史记录到 localStorage
  const saveToStorage = useCallback((items: InterviewHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, []);

  // 添加新的分析记录
  const addRecord = useCallback((transcript: string, result: AnalysisResultData) => {
    const newRecord: InterviewHistoryItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      transcript,
      result,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setHistory(prev => {
      const newItems = [newRecord, ...prev];
      saveToStorage(newItems);
      return newItems;
    });

    return newRecord.id;
  }, [saveToStorage]);

  // 更新现有记录
  const updateRecord = useCallback((id: string, transcript: string, result: AnalysisResultData) => {
    setHistory(prev => {
      const newItems = prev.map(item =>
        item.id === id
          ? { ...item, transcript, result, updatedAt: Date.now() }
          : item
      );
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  // 删除记录
  const deleteRecord = useCallback((id: string) => {
    setHistory(prev => {
      const newItems = prev.filter(item => item.id !== id);
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  // 清空所有记录
  const clearAll = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // 获取单条记录
  const getRecord = useCallback((id: string) => {
    return history.find(item => item.id === id);
  }, [history]);

  return {
    history,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
    clearAll,
    getRecord,
  };
}
