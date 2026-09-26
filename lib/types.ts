// Common TypeScript interfaces and types across client and server

export interface Agent {
  id: string;
  name: string;
  description: string;
  tags: string[];
  instructions: string;
  published: boolean;
  created_at: string;
  chunk_size: number;
  chunk_overlap: number;
  top_k: number;
  min_score: number;
}

export interface Document {
  id: number;
  agent_id: string;
  filename: string;
  status: string;
  error?: string | null;
  created_at: string;
  doc_type?: 'pdf' | 'url' | 'text';
  source_url?: string | null;
  content?: string | null;
  chunk_count?: number;
}

export interface DocumentChunk {
  text: string;
  section: string;
  page: number;
}

export interface SourceCitation {
  document: string;
  section: string;
  page: number;
}

export interface ChunkUsedDetail {
  id?: number;
  document: string;
  section: string;
  page: number;
  score: number;
  snippet: string;
  fullText?: string;
}

export interface AskResult {
  answer: string;
  sources: SourceCitation[];
  chunksUsed?: ChunkUsedDetail[];
  timings?: {
    retrievalMs: number;
    llmMs: number;
    totalMs: number;
  };
}

export interface QueryLog {
  id: number;
  agent_id: string;
  agent_name?: string;
  question: string;
  answer: string;
  sources_count: number;
  chunks_retrieved: number;
  retrieval_ms: number;
  llm_ms: number;
  total_ms: number;
  created_at: string;
}

export interface ChunkAnalytics {
  totalChunks: number;
  totalCharacters: number;
  avgChunkChars: number;
  avgChunkTokens: number;
  minChunkChars: number;
  maxChunkChars: number;
  sizeDistribution: {
    small: number; // < 300 chars
    medium: number; // 300-700 chars
    optimal: number; // 700-1000 chars
    large: number; // > 1000 chars
  };
}

export interface AgentAnalytics {
  agentId: string;
  agentName: string;
  published: boolean;
  docCounts: {
    total: number;
    pdf: number;
    url: number;
    text: number;
  };
  chunkAnalytics: ChunkAnalytics;
  queryCount: number;
  avgRetrievalMs: number;
  avgLlmMs: number;
  avgTotalMs: number;
  recentQueries: QueryLog[];
}

export interface GlobalAnalytics {
  totalQueries: number;
  avgResponseMs: number;
  avgRetrievalMs: number;
  avgLlmMs: number;
  groundedQueryRate: number; // % of queries that returned sources
  totalDocuments: number;
  docTypeBreakdown: {
    pdf: number;
    url: number;
    text: number;
  };
  chunkAnalytics: ChunkAnalytics;
  agentAnalytics: AgentAnalytics[];
  recentLogs: QueryLog[];
}
