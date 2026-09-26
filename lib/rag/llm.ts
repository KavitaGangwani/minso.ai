import OpenAI from 'openai';

// Live, verified free models on OpenRouter (ranked by responsiveness & availability)
const OPENROUTER_FREE_MODELS = [
  'openrouter/free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'google/gemma-4-26b-a4b-it:free',
  'poolside/laguna-s-2.1:free',
  'google/gemma-4-31b-it:free',
  'z-ai/glm-5.2:free',
  'liquid/lfm-2.5-2.6b:free',
  'inclusionai/ling-3.0-flash-fin:free',
];

// Clean raw model output to remove thinking/reasoning tags or meta-dialogue
export function sanitizeModelReply(raw: string): string {
  if (!raw) return '';

  // 1. Remove <think>...</think> or <thought>...</thought> tags
  let cleaned = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<thought>[\s\S]*?<\/thought>/gi, '')
    .trim();

  // 2. If model output begins with internal meta-monologue (e.g., "The user is asking...", "Looking at the sources...")
  if (
    cleaned.startsWith('The user is asking') ||
    cleaned.startsWith('Looking at the sources') ||
    cleaned.startsWith('I need to answer based on')
  ) {
    // Look for where the actual response starts (often after double newline or a conclusion phrase)
    const paragraphs = cleaned.split(/\n\s*\n/);
    const answerParagraphs = paragraphs.filter(
      (p) =>
        !p.trim().startsWith('The user is asking') &&
        !p.trim().startsWith('Looking at the sources') &&
        !p.trim().startsWith('I need to answer') &&
        !p.trim().startsWith('Let me examine') &&
        !p.trim().startsWith('I think the appropriate response')
    );

    if (answerParagraphs.length > 0) {
      cleaned = answerParagraphs.join('\n\n').trim();
    }
  }

  return cleaned;
}

// Execute a single model request with an individual strict timeout
async function requestModel(
  client: OpenAI,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  timeoutMs: number = 8000
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const completion = await client.chat.completions.create(
      {
        model,
        temperature: 0.2,
        max_tokens: 800,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      },
      { signal: controller.signal }
    );

    const message = completion.choices?.[0]?.message;
    const rawContent = (message?.content || '').trim();
    const reply = sanitizeModelReply(rawContent);

    if (!reply || reply.length === 0) {
      throw new Error(`Empty response from model ${model}`);
    }
    return reply;
  } finally {
    clearTimeout(timer);
  }
}

// Call OpenRouter with parallel racing across fast free models
export async function callLLM(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('[LLM Error] OPENROUTER_API_KEY is not configured in Vercel / environment variables.');
    return 'The AI agent service is currently missing its OPENROUTER_API_KEY configuration in the deployment settings. Please configure OPENROUTER_API_KEY in your Vercel Project Settings.';
  }

  const primaryModel =
    process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';

  const pool = [
    primaryModel,
    ...OPENROUTER_FREE_MODELS.filter((m) => m !== primaryModel),
  ];

  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    timeout: 15000,
    maxRetries: 0,
    defaultHeaders: {
      'HTTP-Referer': 'https://minso.ai',
      'X-Title': 'MINSO Mining Agents',
    },
  });

  // Batch 1: Race top 3 models in parallel for fast response
  const batch1 = pool.slice(0, 3);
  console.log(`[LLM] Racing Batch 1 in parallel: ${batch1.join(', ')}...`);

  try {
    const result = await Promise.any(
      batch1.map(async (model) => {
        try {
          const res = await requestModel(client, model, systemPrompt, userPrompt, 8000);
          console.log(`[LLM] Winner from Batch 1: ${model}`);
          return res;
        } catch (err: any) {
          console.warn(`[LLM] ${model} failed or timed out (${err.message})`);
          throw err;
        }
      })
    );
    return result;
  } catch (batch1Error) {
    console.warn('[LLM] All Batch 1 models failed. Trying Batch 2 fallbacks in parallel...');
  }

  // Batch 2: Race next 3 models in parallel
  const batch2 = pool.slice(3, 6);
  console.log(`[LLM] Racing Batch 2 in parallel: ${batch2.join(', ')}...`);

  try {
    const result = await Promise.any(
      batch2.map(async (model) => {
        try {
          const res = await requestModel(client, model, systemPrompt, userPrompt, 8000);
          console.log(`[LLM] Winner from Batch 2: ${model}`);
          return res;
        } catch (err: any) {
          console.warn(`[LLM] ${model} failed or timed out (${err.message})`);
          throw err;
        }
      })
    );
    return result;
  } catch (batch2Error) {
    console.error('[LLM] All fallback batches exhausted.');
    return 'The free model is busy. Please try again in a minute.';
  }
}

// Rewrite short or vague question into a more specific domain search query (one line, plain text)
export async function rewriteQuery(
  question: string,
  agentContext?: string
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    timeout: 5000,
    maxRetries: 0,
    defaultHeaders: {
      'HTTP-Referer': 'https://minso.ai',
      'X-Title': 'MINSO Mining Agents',
    },
  });

  const systemPrompt = `You are a search query optimizer for a mining law, acts, and safety SOP assistant.
Rewrite the user's short or vague query into one specific, clear search query to find the relevant legal rule, regulation, or SOP.
Rules:
- Output ONLY the single-line plain text search query.
- Do NOT include quotes, explanations, prefixes, or punctuation at the end.`;

  const modelsToTry = [
    'openrouter/free',
    'google/gemma-4-26b-a4b-it:free',
    'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  ];

  try {
    const result = await Promise.any(
      modelsToTry.map(async (model) => {
        const res = await requestModel(client, model, systemPrompt, question, 4000);
        return res;
      })
    );

    if (
      result &&
      result.length > 0 &&
      result.toLowerCase() !== question.toLowerCase()
    ) {
      return result.replace(/^["']|["']$/g, '').trim();
    }
  } catch (err: any) {
    console.warn('[LLM] Query rewriting skipped:', err.message);
  }

  return null;
}
