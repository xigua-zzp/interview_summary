import { useEffect, useRef, useState } from 'react';
import { AnalysisResultData } from '../services/deepseek';

interface AnalysisResultProps {
  result: AnalysisResultData;
  isSaved?: boolean;
}

type TabType = 'profile' | 'interview';

export function AnalysisResult({ result, isSaved = true }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const contentRef = useRef<HTMLDivElement>(null);
  const hasUserScrolled = useRef(false);

  // 检测用户是否手动滚动
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      hasUserScrolled.current = scrollTop > 50;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (result && contentRef.current && !hasUserScrolled.current) {
      const element = contentRef.current;
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [result]);

  const { candidate, highlights, improvements, keyInfo, topics } = result;

  // 用户画像 Tab 内容
  const renderProfileTab = () => (
    <>
      {/* 候选人信息卡片 */}
      <div className="card candidate-card">
        <div className="card-header">
          <div className="avatar">{candidate.name?.charAt(0) || 'U'}</div>
          <div className="candidate-info">
            <h3>{candidate.name || 'Unknown'}</h3>
            <p className="role">{candidate.role}</p>
          </div>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Experience</span>
            <span className="value">{candidate.experience || 'Not specified'}</span>
          </div>
          {candidate.location && (
            <div className="info-item">
              <span className="label">Location</span>
              <span className="value">{candidate.location}</span>
            </div>
          )}
          {candidate.education && (
            <div className="info-item">
              <span className="label">Education</span>
              <span className="value">{candidate.education}</span>
            </div>
          )}
        </div>
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="skills-section">
            <span className="label">Skills</span>
            <div className="tags">
              {candidate.skills.map((skill, i) => (
                <span key={i} className="tag">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 亮点卡片 */}
      <div className="card highlights-card">
        <h3>Highlights & Strengths</h3>
        {highlights && highlights.length > 0 ? (
          <ul className="assessment-section positive">
            {highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">No highlights recorded</p>
        )}
      </div>

      {/* 待改进卡片 */}
      <div className="card improvements-card">
        <h3>Areas for Improvement</h3>
        {improvements && improvements.length > 0 ? (
          <ul className="assessment-section negative">
            {improvements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">No improvements recorded</p>
        )}
      </div>

      {/* 关键信息卡片 */}
      <div className="card keyinfo-card">
        <h3>Key Information</h3>
        <ul className="important-list">
          {keyInfo.projects && (
            <li>
              <span className="category-tag">Projects</span>
              <span>{keyInfo.projects}</span>
            </li>
          )}
          {keyInfo.salary && (
            <li>
              <span className="category-tag">Salary</span>
              <span>{keyInfo.salary}</span>
            </li>
          )}
          {keyInfo.noticePeriod && (
            <li>
              <span className="category-tag">Notice Period</span>
              <span>{keyInfo.noticePeriod}</span>
            </li>
          )}
        </ul>
      </div>
    </>
  );

  // 面试记录 Tab 内容
  const renderInterviewTab = () => (
    <>
      {/* Topic 时间线卡片 */}
      {topics && topics.length > 0 ? (
        <div className="card topics-card">
          <h3>Interview Timeline</h3>
          <div className="topics-timeline">
            {topics.map((topic, i) => (
              <div key={i} className="topic-item">
                <div className="topic-time">{topic.timeRange}</div>
                <div className="topic-content">
                  <div className="topic-title">{topic.topic}</div>
                  <div className="topic-summary">{topic.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <p className="empty-text">No interview topics recorded</p>
        </div>
      )}
    </>
  );

  return (
    <div className="result-section" ref={contentRef}>
      {/* Tab 切换 */}
      <div className="tab-header">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          User Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          Interview Record
        </button>
        {isSaved && (
          <span className="saved-indicator">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Saved
          </span>
        )}
      </div>

      {/* Tab 内容 */}
      <div className="tab-content">
        {activeTab === 'profile' ? renderProfileTab() : renderInterviewTab()}
      </div>
    </div>
  );
}
