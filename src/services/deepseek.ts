import OpenAI from 'openai';

// OpenRouter API Configuration
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL = 'deepseek/deepseek-chat';

// 内置 API key（Base64 编码混淆）
const ENCODED_API_KEY = 'c2stb3ItdjEtYWQ0NmI1ODcyOTUwN2FlNDE4Mzk5N2IwZDQ3MTlkYzIzNWE3ZjE5NDVmZTMxNmI5NmJlNGI5ZjEwMWQ4MGM0MA==';

function decodeApiKey(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return '';
  }
}

export function getBuiltInApiKey(): string {
  return decodeApiKey(ENCODED_API_KEY);
}

// 创建 OpenAI 客户端（兼容 OpenRouter）
const openai = new OpenAI({
  apiKey: getBuiltInApiKey(),
  baseURL: OPENROUTER_BASE_URL,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'Interview Summary',
  },
});

// 创建客户端的辅助函数
function createClient(apiKey?: string): OpenAI {
  return apiKey
    ? new OpenAI({
        apiKey: apiKey,
        baseURL: OPENROUTER_BASE_URL,
        dangerouslyAllowBrowser: true,
        defaultHeaders: {
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Interview Summary',
        },
      })
    : openai;
}

const SYSTEM_PROMPT = `You are an expert HR analyst and interview processor. Your task is to analyze
interview transcripts and extract structured information. Always respond in valid
JSON format. Be accurate and thorough in extracting details.`;

const USER_PROMPT_TEMPLATE = `Analyze the following interview transcript and provide a comprehensive summary in JSON format.

TRANSCRIPT FORMAT: "Time - Speaker: Message"
Speakers are either "Interviewer" or "Candidate"

TRANSCRIPT:
{{transcript}}

Please analyze and provide the following JSON structure (output ONLY valid JSON, no markdown):

{
  "candidate": {
    "name": "Candidate name (extract from transcript or 'Unknown')",
    "role": "Position applied for",
    "experience": "Years of experience",
    "skills": ["skill1", "skill2"],
    "education": "Education background (optional)",
    "location": "Location (optional)"
  },
  "highlights": [
    "Key strength or highlight from the interview"
  ],
  "improvements": [
    "Area for improvement or weakness"
  ],
  "keyInfo": {
    "projects": "Notable projects mentioned",
    "salary": "Salary expectations or discussion",
    "noticePeriod": "Notice period or earliest start date"
  },
  "topics": [
    {
      "timeRange": "Time range (e.g., '09:00-09:10')",
      "topic": "Main topic or question discussed",
      "summary": "Brief summary of the discussion"
    }
  ]
}`;

export interface TopicInfo {
  timeRange: string;
  topic: string;
  summary: string;
}

export interface AnalysisResultData {
  candidate: {
    name: string;
    role: string;
    experience: string;
    skills: string[];
    education?: string;
    location?: string;
  };
  highlights: string[];
  improvements: string[];
  keyInfo: {
    projects: string;
    salary: string;
    noticePeriod: string;
  };
  topics: TopicInfo[];
}

export type StreamCallback = (chunk: string) => void;

export async function analyzeInterview(
  transcript: string,
  apiKey?: string,
  onStream?: StreamCallback
): Promise<AnalysisResultData> {
  if (!transcript.trim()) {
    throw { code: 'EMPTY_TRANSCRIPT', message: 'Transcript is empty' };
  }

  const effectiveApiKey = apiKey || getBuiltInApiKey();
  if (!effectiveApiKey) {
    throw { code: 'NO_API_KEY', message: 'API key is required' };
  }

  const client = createClient(apiKey);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: USER_PROMPT_TEMPLATE.replace('{{transcript}}', transcript) },
      ],
      temperature: 0.3,
      max_tokens: 4000,
      stream: true,
    });

    let fullContent = '';

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullContent += content;
        if (onStream) {
          onStream(content);
        }
      }
    }

    // Clean up markdown code blocks
    const cleanContent = fullContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').replace(/```[a-z]*\n?/g, '').trim();

    // Parse JSON
    try {
      const parsed = JSON.parse(cleanContent);
      return parsed as AnalysisResultData;
    } catch (parseError) {
      throw {
        code: 'PARSE_ERROR',
        message: 'Failed to parse AI response',
        details: cleanContent.substring(0, 500),
      };
    }
  } catch (error: any) {
    throw {
      code: 'API_ERROR',
      message: error.message || 'API request failed',
      details: error.response?.data?.error?.message || error.message,
    };
  }
}
