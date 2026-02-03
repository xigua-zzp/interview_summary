import { useState } from 'react';
import { InterviewHistoryItem } from '../types';

interface HistorySidebarProps {
  history: InterviewHistoryItem[];
  selectedId?: string;
  onSelect: (item: InterviewHistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function HistorySidebar({
  history,
  selectedId,
  onSelect,
  onDelete,
  onClearAll,
}: HistorySidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="history-sidebar">
      <div className="history-header">
        <h3>History</h3>
        {history.length > 0 && (
          <button
            className="clear-all-btn"
            onClick={() => setShowConfirmClear(true)}
          >
            Clear
          </button>
        )}
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-empty">
            No records yet
          </div>
        ) : (
          history.map(item => (
            <div
              key={item.id}
              className={`history-item ${selectedId === item.id ? 'selected' : ''}`}
            >
              <div
                className="history-item-header"
                onClick={() => onSelect(item)}
              >
                <div className="history-item-main">
                  <span className="history-name">{item.result.candidate.name || 'Unknown'}</span>
                  <span className="history-role">{item.result.candidate.role}</span>
                </div>
                <div className="history-item-meta">
                  <span className="history-date">{formatDate(item.createdAt)}</span>
                </div>
              </div>

              <div className="history-item-actions">
                <button
                  className="action-btn expand-btn"
                  onClick={() => toggleExpand(item.id)}
                  title={expandedItems.has(item.id) ? 'Collapse' : 'Expand'}
                >
                  {expandedItems.has(item.id) ? '收起' : '展开'}
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDelete(item.id)}
                  title="Delete"
                >
                  删除
                </button>
              </div>

              {expandedItems.has(item.id) && (
                <div className="history-item-details">
                  <div className="detail-section">
                    <span className="detail-label">Skills:</span>
                    <div className="detail-tags">
                      {item.result.candidate.skills.slice(0, 5).map((skill, i) => (
                        <span key={i} className="detail-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="detail-section">
                    <span className="detail-label">Highlights:</span>
                    <ul className="detail-list">
                      {item.result.highlights.slice(0, 2).map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-section">
                    <span className="detail-label">Topics:</span>
                    <span className="detail-count">{item.result.topics.length} topics</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Clear All Confirmation Modal */}
      {showConfirmClear && (
        <div className="modal-overlay" onClick={() => setShowConfirmClear(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h4>Clear All History?</h4>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn confirm"
                onClick={() => {
                  onClearAll();
                  setShowConfirmClear(false);
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
