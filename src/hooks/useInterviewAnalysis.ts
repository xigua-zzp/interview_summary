import { useState, useCallback, useRef } from 'react';
import { AnalysisError } from '../types';
import { analyzeInterview, StreamCallback, AnalysisResultData } from '../services/deepseek';

interface UseInterviewAnalysisReturn {
  analysis: AnalysisResultData | null;
  loading: boolean;
  error: AnalysisError | null;
  analyze: (transcript: string, apiKey: string) => Promise<void>;
  clear: () => void;
}

export function useInterviewAnalysis(): UseInterviewAnalysisReturn {
  const [analysis, setAnalysis] = useState<AnalysisResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AnalysisError | null>(null);
  const analysisRef = useRef('');

  const analyze = useCallback(async (transcript: string, apiKey: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    analysisRef.current = '';

    const streamCallback: StreamCallback = (chunk) => {
      analysisRef.current += chunk;
    };

    try {
      const result = await analyzeInterview(transcript, apiKey, streamCallback);
      setAnalysis(result);
    } catch (e) {
      setError(e as AnalysisError);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setAnalysis(null);
    setError(null);
    analysisRef.current = '';
  }, []);

  return { analysis, loading, error, analyze, clear };
}
