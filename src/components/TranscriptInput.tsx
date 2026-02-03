interface TranscriptInputProps {
  transcript: string;
  apiKey: string;
  onTranscriptChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const MOCK_TRANSCRIPT = `09:00 - Interviewer: 早上好！请先介绍一下你自己。
09:01 - Candidate: 早上好！我叫李明，有5年全栈开发经验。目前在ABC科技公司负责电商平台的开发，精通React、Node.js和云服务。
09:03 - Interviewer: 你参与过最具有挑战性的项目是什么？
09:04 - Candidate: 去年我主导了公司电商系统的微服务改造，需要在保持向后兼容的情况下重构系统架构，这是一个很有挑战的项目。
09:06 - Interviewer: 你们团队是如何处理技术分歧的？
09:07 - Candidate: 我们鼓励技术评审会议，大家用数据和原型来证明自己的方案，最终选择最优解。
09:09 - Interviewer: 你的期望薪资是多少？
09:10 - Candidate: 基于我的经验和市场调研，期望年薪50-60万，同时也关注技术成长空间。
09:11 - Interviewer: 如果被录用，多久可以到岗？
09:12 - Candidate: 我有一个月的交接期，大概可以在一个月后入职。`;

export function TranscriptInput({
  transcript,
  apiKey,
  onTranscriptChange,
  onApiKeyChange,
  onSubmit,
  loading,
}: TranscriptInputProps) {
  return (
    <div className="input-section">
      <h2>Interview Transcript Analyzer</h2>

      {/* API Key 已内置，隐藏输入框 */}
      <input
        type="hidden"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
      />

      <div className="form-group">
        <label htmlFor="transcript">Interview Transcript</label>
        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Paste interview transcript here...

Format: Time - Speaker: Message
Speakers: Interviewer / Candidate

Example:
09:00 - Interviewer: 早上好！请先介绍一下你自己。
09:01 - Candidate: 早上好！我叫李明..."
          disabled={loading}
          rows={15}
        />
        <button
          type="button"
          onClick={() => onTranscriptChange(MOCK_TRANSCRIPT)}
          disabled={loading}
          className="sample-btn"
        >
          Load Sample Transcript
        </button>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !transcript.trim()}
        className="submit-btn"
      >
        {loading ? 'Analyzing...' : 'Analyze Transcript'}
      </button>
    </div>
  );
}
