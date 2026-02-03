import { AnalysisError } from '../types';

interface ErrorDisplayProps {
  error: AnalysisError;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="error-display">
      <span className="error-icon">X</span>
      <div className="error-content">
        <h4>Error: {error.code}</h4>
        <p>{error.message}</p>
        {error.details && <pre>{error.details}</pre>}
      </div>
    </div>
  );
}
