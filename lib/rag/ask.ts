import { Agent } from '../agents';
import { searchChunks, SearchResult } from './search';
import { callLLM, rewriteQuery } from './llm';
import { logQueryPerformance } from '../analytics';
import type { SourceCitation, ChunkUsedDetail, AskResult } from '../types';

export type { SourceCitation, ChunkUsedDetail, AskResult };

// Ask a question to an agent using retrieval augmented generation (RAG)
export async function askQuestion(
  agent: Agent,
  question: string
): Promise<AskResult> {
  const startTotal = performance.now();
  const cleanQuestion = question.trim();

  // 1. Perform direct vector similarity search
  const startRetrieval = performance.now();
  let relevantChunks: SearchResult[] = await searchChunks(
    agent.id,
    cleanQuestion,
    null,
    agent.min_score,
    agent.top_k
  );

  // 2. If no chunks found and query is short, attempt query expansion rewrite
  let rewrittenQuery: string | null = null;
  const wordCount = cleanQuestion.split(/\s+/).length;
  if (relevantChunks.length === 0 && (wordCount <= 6 || cleanQuestion.length < 35)) {
    rewrittenQuery = await rewriteQuery(cleanQuestion, agent.instructions);
    if (rewrittenQuery) {
      relevantChunks = await searchChunks(
        agent.id,
        cleanQuestion,
        rewrittenQuery,
        agent.min_score,
        agent.top_k
      );
    }
  }
  const retrievalMs = Number((performance.now() - startRetrieval).toFixed(1));

  // If search still returns no relevant chunks, reply immediately without calling LLM
  if (relevantChunks.length === 0) {
    const totalMs = Number((performance.now() - startTotal).toFixed(1));
    const emptyAnswer = 'I could not find this in my documents.';

    await logQueryPerformance({
      agentId: agent.id,
      question: cleanQuestion,
      answer: emptyAnswer,
      sourcesCount: 0,
      chunksRetrieved: 0,
      retrievalMs,
      llmMs: 0,
      totalMs,
    });

    return {
      answer: emptyAnswer,
      sources: [],
      chunksUsed: [],
      timings: {
        retrievalMs,
        llmMs: 0,
        totalMs,
      },
    };
  }

  // 3. Construct rich evaluated chunks details
  const evaluatedChunks: ChunkUsedDetail[] = relevantChunks.map((c) => ({
    id: c.id,
    document: c.document,
    section: c.section || 'Statutory Clause',
    page: c.page || 1,
    score: Number(c.score.toFixed(2)),
    snippet: c.text.length > 260 ? c.text.slice(0, 260).trim() + '...' : c.text.trim(),
    fullText: c.text,
  }));

  // Select best 6 chunks and cut each to at most 1200 characters for LLM context
  const chunksToUse = relevantChunks.slice(0, 6);

  const sourceContext = chunksToUse
    .map((chunk, index) => {
      const text =
        chunk.text.length > 1200
          ? chunk.text.slice(0, 1200).trim()
          : chunk.text.trim();
      return `[${index + 1}] Document: ${chunk.document} | Section: ${
        chunk.section
      } | Page: ${chunk.page}\n${text}`;
    })
    .join('\n\n');

  // 4. Construct system prompt strictly enforcing citation and grounding
  const systemPrompt = `${agent.instructions}

Rules for answering:
- Answer ONLY from the numbered sources provided below.
- Cite your sources in the text using bracketed numbers like [1], [2].
- Provide a direct, concise, and well-structured answer with bullet points or numbered lists where helpful.
- If the sources provide details, procedures, or conditions related to the query, explain them clearly citing the source numbers.
- If the sources do not mention or cover the topic at all, state: "I could not find this in my documents."
- Do NOT include internal planning, meta-commentary, or chain-of-thought monologue. Output only the final response for the user.
- Reply in the language of the question.

SOURCES:
${sourceContext}`;

  // Log the exact prompt sent to the LLM for full visibility and debugging
  console.log('\n==================== [LLM PROMPT DUMP START] ====================');
  console.log(`[Agent]: ${agent.name} (id: ${agent.id})`);
  console.log(`[User Question]: ${cleanQuestion}`);
  console.log(`[Retrieved Chunks Attached]: ${chunksToUse.length} chunk(s)`);
  console.log('\n--- [SYSTEM PROMPT WITH SOURCES] ---');
  console.log(systemPrompt);
  console.log('\n--- [USER PROMPT] ---');
  console.log(cleanQuestion);
  console.log('==================== [LLM PROMPT DUMP END] ====================\n');

  // 5. Call OpenRouter LLM with parallel fallback
  const startLLM = performance.now();
  const answer = await callLLM(systemPrompt, cleanQuestion);
  const llmMs = Number((performance.now() - startLLM).toFixed(1));
  const totalMs = Number((performance.now() - startTotal).toFixed(1));

  console.log(`[Timing] 5. LLM call finished (${llmMs}ms, Total: ${totalMs}ms)`);
  console.log(`[LLM Response]: "${answer.slice(0, 100)}${answer.length > 100 ? '...' : ''}"`);

  // Check if answer is a "not found" response
  const isNotFound =
    answer.trim().toLowerCase().includes('could not find this in my documents') ||
    answer.trim().toLowerCase().startsWith('i could not find') ||
    answer.trim().toLowerCase() === 'the free model is busy. please try again in a minute.';

  // If answer could not be found, do NOT attach citations (prevents misleading citation chips)
  let sources: SourceCitation[] = [];
  if (!isNotFound) {
    const seen = new Set<string>();
    for (const c of chunksToUse) {
      const key = `${c.document}::${c.section || ''}::${c.page}`;
      if (!seen.has(key)) {
        seen.add(key);
        sources.push({
          document: c.document,
          section: c.section,
          page: c.page,
        });
      }
    }
  }

  // Log query performance record into database
  await logQueryPerformance({
    agentId: agent.id,
    question: cleanQuestion,
    answer,
    sourcesCount: sources.length,
    chunksRetrieved: relevantChunks.length,
    retrievalMs,
    llmMs,
    totalMs,
  });

  return {
    answer,
    sources,
    chunksUsed: evaluatedChunks,
    timings: {
      retrievalMs,
      llmMs,
      totalMs,
    },
  };
}
