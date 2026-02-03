import { useState, useCallback, useEffect } from 'react';
import { TranscriptInput } from './components/TranscriptInput';
import { AnalysisResult } from './components/AnalysisResult';
import { HistorySidebar } from './components/HistorySidebar';
import { ErrorDisplay } from './components/ErrorDisplay';
import { useInterviewAnalysis } from './hooks/useInterviewAnalysis';
import { useInterviewHistory } from './hooks/useInterviewHistory';
import { InterviewHistoryItem } from './types';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<InterviewHistoryItem | null>(null);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  const { analysis, loading, error, analyze, clear } = useInterviewAnalysis();
  const { history, addRecord, deleteRecord, clearAll } = useInterviewHistory();

  // 提交新的分析
  const handleSubmit = useCallback(() => {
    analyze(transcript, apiKey);
  }, [analyze, transcript, apiKey]);

  // 分析完成后自动保存到历史记录
  useEffect(() => {
    if (analysis && !loading && !isViewingHistory) {
      const newId = addRecord(transcript, analysis);
      setLastSavedId(newId);
    }
  }, [analysis, loading, isViewingHistory, transcript, addRecord]);

  // 从历史记录加载
  const handleLoadHistory = useCallback((item: InterviewHistoryItem) => {
    setSelectedHistoryItem(item);
    setTranscript(item.transcript);
    setIsViewingHistory(true);
  }, []);

  // 删除历史记录
  const handleDeleteHistory = useCallback((id: string) => {
    deleteRecord(id);
    if (selectedHistoryItem?.id === id) {
      setSelectedHistoryItem(null);
      setIsViewingHistory(false);
      setTranscript('');
    }
  }, [deleteRecord, selectedHistoryItem]);

  // 清空所有历史
  const handleClearAll = useCallback(() => {
    clearAll();
    setSelectedHistoryItem(null);
    setIsViewingHistory(false);
    setTranscript('');
  }, [clearAll]);

  // 开始新分析
  const handleNewAnalysis = useCallback(() => {
    setSelectedHistoryItem(null);
    setIsViewingHistory(false);
    setTranscript('');
    clear();
  }, [clear]);

  return (
    <div className="app">
      <header className="header">
        <h1>Interview Summary</h1>
        <p>Analyze interview transcripts with AI</p>
      </header>

      <main className="main three-column">
        {/* 历史记录侧边栏 */}
        <div className="column history-column">
          <HistorySidebar
            history={history}
            selectedId={selectedHistoryItem?.id}
            onSelect={handleLoadHistory}
            onDelete={handleDeleteHistory}
            onClearAll={handleClearAll}
          />
        </div>

        {/* 左侧 - 输入区域 */}
        <div className="column left-column">
          {isViewingHistory && (
            <div className="history-banner">
              <span>Viewing History</span>
              <button onClick={handleNewAnalysis}>New Analysis</button>
            </div>
          )}

          <TranscriptInput
            transcript={transcript}
            apiKey={apiKey}
            onTranscriptChange={setTranscript}
            onApiKeyChange={setApiKey}
            onSubmit={handleSubmit}
            loading={loading}
          />

          {error && (
            <>
              <ErrorDisplay error={error} />
              <button onClick={clear} className="clear-btn">Clear & Try Again</button>
            </>
          )}

          {!analysis && !error && !isViewingHistory && (
            <div className="placeholder-card">
              <p>Submit a transcript to see analysis results</p>
            </div>
          )}
        </div>

        {/* 右侧 - 结果展示 */}
        <div className="column right-column">
          {analysis && !error && (
            <>
              <AnalysisResult
                result={analysis}
                isSaved={lastSavedId !== null}
              />
              <button onClick={handleNewAnalysis} className="clear-btn">Analyze Another</button>
            </>
          )}

          {isViewingHistory && !analysis && selectedHistoryItem && (
            <>
              <AnalysisResult result={selectedHistoryItem.result} isSaved={true} />
              <button onClick={handleNewAnalysis} className="clear-btn">Back to New Analysis</button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
