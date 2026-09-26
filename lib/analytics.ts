import supabase from './supabase';
import { ChunkAnalytics, AgentAnalytics, GlobalAnalytics, QueryLog } from './types';
import { getAllAgents } from './agents';

// In-memory ring buffer for immediate query log availability
let IN_MEMORY_LOGS: QueryLog[] = [];

// Log an agent query with timing and citation stats
export async function logQueryPerformance(data: {
  agentId: string;
  question: string;
  answer: string;
  sourcesCount: number;
  chunksRetrieved: number;
  retrievalMs: number;
  llmMs: number;
  totalMs: number;
}): Promise<void> {
  const newLog: QueryLog = {
    id: Date.now(),
    agent_id: data.agentId,
    question: data.question,
    answer: data.answer,
    sources_count: data.sourcesCount,
    chunks_retrieved: data.chunksRetrieved,
    retrieval_ms: data.retrievalMs,
    llm_ms: data.llmMs,
    total_ms: data.totalMs,
    created_at: new Date().toISOString(),
  };

  IN_MEMORY_LOGS = [newLog, ...IN_MEMORY_LOGS.filter((l) => l.id !== newLog.id)].slice(0, 150);

  try {
    const { error } = await supabase.from('query_logs').insert({
      agent_id: data.agentId,
      question: data.question,
      answer: data.answer,
      sources_count: data.sourcesCount,
      chunks_retrieved: data.chunksRetrieved,
      retrieval_ms: data.retrievalMs,
      llm_ms: data.llmMs,
      total_ms: data.totalMs,
    });

    if (error) {
      console.error('[Analytics] Failed to insert query log:', error);
    }
  } catch (err) {
    console.error('[Analytics] Failed to log query performance:', err);
  }
}

// Compute chunk statistics for a specific agent or across the whole system
export async function getChunkAnalytics(agentId?: string): Promise<ChunkAnalytics> {
  let query = supabase.from('chunks').select('text');
  if (agentId) {
    query = query.eq('agent_id', agentId);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    if (error) console.error('[Analytics] Failed to fetch chunks for stats:', error);
    return {
      totalChunks: 0,
      totalCharacters: 0,
      avgChunkChars: 0,
      avgChunkTokens: 0,
      minChunkChars: 0,
      maxChunkChars: 0,
      sizeDistribution: {
        small: 0,
        medium: 0,
        optimal: 0,
        large: 0,
      },
    };
  }

  let totalChars = 0;
  let minChars = Infinity;
  let maxChars = 0;
  const distribution = {
    small: 0, // < 300
    medium: 0, // 300 - 700
    optimal: 0, // 700 - 1000
    large: 0, // > 1000
  };

  for (const chunk of data) {
    const len = chunk.text ? chunk.text.length : 0;
    totalChars += len;
    if (len < minChars) minChars = len;
    if (len > maxChars) maxChars = len;

    if (len < 300) distribution.small++;
    else if (len <= 700) distribution.medium++;
    else if (len <= 1000) distribution.optimal++;
    else distribution.large++;
  }

  const avgChars = Math.round(totalChars / data.length);
  const avgTokens = Math.round(avgChars / 4);

  return {
    totalChunks: data.length,
    totalCharacters: totalChars,
    avgChunkChars: avgChars,
    avgChunkTokens: avgTokens,
    minChunkChars: minChars === Infinity ? 0 : minChars,
    maxChunkChars: maxChars,
    sizeDistribution: distribution,
  };
}

// Get recent query logs with agent name - strictly sorted newest first (created_at DESC)
export async function getAllQueryLogs(limit: number = 50): Promise<QueryLog[]> {
  let agentMap = new Map<string, string>();
  try {
    const agents = await getAllAgents();
    agentMap = new Map(agents.map((a) => [a.id, a.name]));
  } catch (e) {
    // Non-fatal, will fallback to agent_id
  }

  let dbLogs: QueryLog[] = [];
  try {
    const { data, error } = await supabase
      .from('query_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && data) {
      dbLogs = data.map((row: any) => ({
        id: Number(row.id),
        agent_id: row.agent_id,
        agent_name: agentMap.get(row.agent_id) || row.agent_id,
        question: row.question,
        answer: row.answer,
        sources_count: Number(row.sources_count || 0),
        chunks_retrieved: Number(row.chunks_retrieved || 0),
        retrieval_ms: Number(row.retrieval_ms || 0),
        llm_ms: Number(row.llm_ms || 0),
        total_ms: Number(row.total_ms || 0),
        created_at: row.created_at,
      }));
    }
  } catch (err) {
    console.error('[Analytics] Failed to fetch query logs from DB:', err);
  }

  // Merge in-memory logs with DB logs
  const inMemWithNames = IN_MEMORY_LOGS.map((l) => ({
    ...l,
    agent_name: agentMap.get(l.agent_id) || l.agent_id,
  }));

  const allLogs = [...inMemWithNames, ...dbLogs];
  // Deduplicate by question + created_at
  const seen = new Set<string>();
  const merged: QueryLog[] = [];
  for (const log of allLogs) {
    const key = `${log.agent_id}::${log.question}::${log.answer.slice(0, 40)}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(log);
    }
  }

  merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return merged.slice(0, limit);
}

// Get query logs for a specific agent - sorted newest first
export async function getAgentQueryLogs(agentId: string, limit: number = 10): Promise<QueryLog[]> {
  const allLogs = await getAllQueryLogs(limit * 2);
  return allLogs.filter((l) => l.agent_id === agentId).slice(0, limit);
}

// Get analytics breakdown for a single agent
export async function getAgentAnalytics(agentId: string): Promise<AgentAnalytics | null> {
  const { data: agent, error: agentErr } = await supabase
    .from('agents')
    .select('id, name, published')
    .eq('id', agentId)
    .maybeSingle();

  if (agentErr || !agent) {
    return null;
  }

  // Fetch document breakdown
  const { data: docs } = await supabase
    .from('documents')
    .select('doc_type')
    .eq('agent_id', agentId);

  const docCounts = {
    total: docs?.length || 0,
    pdf: 0,
    url: 0,
    text: 0,
  };

  for (const d of docs || []) {
    const type = d.doc_type || 'pdf';
    if (type === 'url') docCounts.url++;
    else if (type === 'text') docCounts.text++;
    else docCounts.pdf++;
  }

  // Fetch queries stats
  const { data: logs } = await supabase
    .from('query_logs')
    .select('*')
    .eq('agent_id', agentId);

  let totalRetrieval = 0;
  let totalLlm = 0;
  let totalDuration = 0;
  const count = logs?.length || 0;

  for (const l of logs || []) {
    totalRetrieval += Number(l.retrieval_ms || 0);
    totalLlm += Number(l.llm_ms || 0);
    totalDuration += Number(l.total_ms || 0);
  }

  const chunkAnalytics = await getChunkAnalytics(agentId);
  const recentQueries = await getAgentQueryLogs(agentId, 10);

  return {
    agentId: agent.id,
    agentName: agent.name,
    published: Boolean(agent.published),
    docCounts,
    chunkAnalytics,
    queryCount: count,
    avgRetrievalMs: count > 0 ? Math.round(totalRetrieval / count) : 0,
    avgLlmMs: count > 0 ? Math.round(totalLlm / count) : 0,
    avgTotalMs: count > 0 ? Math.round(totalDuration / count) : 0,
    recentQueries,
  };
}

// Get overall platform analytics
export async function getGlobalAnalytics(): Promise<GlobalAnalytics> {
  const agents = await getAllAgents();

  const { data: docs } = await supabase.from('documents').select('doc_type');
  const docSummary = {
    total: docs?.length || 0,
    pdf: 0,
    url: 0,
    text: 0,
  };

  for (const d of docs || []) {
    const type = d.doc_type || 'pdf';
    if (type === 'url') docSummary.url++;
    else if (type === 'text') docSummary.text++;
    else docSummary.pdf++;
  }

  const { data: logs } = await supabase
    .from('query_logs')
    .select('*')
    .order('created_at', { ascending: false });

  let totalRetrieval = 0;
  let totalLlm = 0;
  let totalDuration = 0;
  let groundedCount = 0;
  const totalQueries = logs?.length || 0;

  for (const l of logs || []) {
    totalRetrieval += Number(l.retrieval_ms || 0);
    totalLlm += Number(l.llm_ms || 0);
    totalDuration += Number(l.total_ms || 0);
    if (Number(l.sources_count || 0) > 0) {
      groundedCount++;
    }
  }

  const chunkAnalytics = await getChunkAnalytics();
  const agentAnalyticsList: AgentAnalytics[] = [];

  for (const agent of agents) {
    const aStats = await getAgentAnalytics(agent.id);
    if (aStats) {
      agentAnalyticsList.push(aStats);
    }
  }

  const groundedRate =
    totalQueries > 0 ? Math.round((groundedCount / totalQueries) * 100) : 100;

  const recentLogs = await getAllQueryLogs(15);

  return {
    totalQueries,
    avgResponseMs: totalQueries > 0 ? Math.round(totalDuration / totalQueries) : 0,
    avgRetrievalMs: totalQueries > 0 ? Math.round(totalRetrieval / totalQueries) : 0,
    avgLlmMs: totalQueries > 0 ? Math.round(totalLlm / totalQueries) : 0,
    groundedQueryRate: groundedRate,
    totalDocuments: docSummary.total,
    docTypeBreakdown: {
      pdf: docSummary.pdf,
      url: docSummary.url,
      text: docSummary.text,
    },
    chunkAnalytics,
    agentAnalytics: agentAnalyticsList,
    recentLogs,
  };
}
