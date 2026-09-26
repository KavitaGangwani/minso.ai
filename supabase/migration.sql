-- ==============================================================================
-- MINSO.AI - Supabase Postgres & pgvector Migration
-- ==============================================================================

-- 1. Enable the pgvector extension for embedding similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Agents Table
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  chunk_size INT NOT NULL DEFAULT 800,
  chunk_overlap INT NOT NULL DEFAULT 100,
  top_k INT NOT NULL DEFAULT 6,
  min_score REAL NOT NULL DEFAULT 0.50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Documents Table (PDFs, Web URLs, Raw Text)
CREATE TABLE IF NOT EXISTS documents (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded',
  error TEXT,
  doc_type TEXT NOT NULL DEFAULT 'pdf',
  source_url TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Chunks Table with Vector Embeddings
-- Note: Dimensions are 384 for Xenova/multilingual-e5-small.
-- If switching to OpenAI text-embedding-3-small/ada-002, change to vector(1536).
CREATE TABLE IF NOT EXISTS chunks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  document_id BIGINT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  section TEXT,
  page INT,
  embedding VECTOR(384)
);

-- 5. Query Logs & Latency Auditing Table
CREATE TABLE IF NOT EXISTS query_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sources_count INT NOT NULL DEFAULT 0,
  chunks_retrieved INT NOT NULL DEFAULT 0,
  retrieval_ms REAL NOT NULL DEFAULT 0,
  llm_ms REAL NOT NULL DEFAULT 0,
  total_ms REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Indexes for Performance & Vector Search
CREATE INDEX IF NOT EXISTS idx_chunks_agent_id ON chunks(agent_id);
CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_documents_agent_id ON documents(agent_id);
CREATE INDEX IF NOT EXISTS idx_query_logs_agent_id ON query_logs(agent_id);

-- HNSW Cosine Index on Chunk Embeddings
CREATE INDEX IF NOT EXISTS idx_chunks_embedding_hnsw 
ON chunks USING hnsw (embedding vector_cosine_ops);

-- 7. Supabase Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 8. Stored Procedure for Vector Cosine Similarity Search
CREATE OR REPLACE FUNCTION match_chunks(
  p_agent_id TEXT,
  p_query_embedding VECTOR(384),
  p_match_threshold FLOAT DEFAULT 0.50,
  p_match_count INT DEFAULT 6
)
RETURNS TABLE (
  id BIGINT,
  document_id BIGINT,
  document TEXT,
  text TEXT,
  section TEXT,
  page INT,
  score FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.document_id,
    d.filename AS document,
    c.text,
    c.section,
    c.page,
    (1 - (c.embedding <=> p_query_embedding))::FLOAT AS score
  FROM chunks c
  JOIN documents d ON c.document_id = d.id
  WHERE c.agent_id = p_agent_id
    AND c.embedding IS NOT NULL
    AND (1 - (c.embedding <=> p_query_embedding)) >= p_match_threshold
  ORDER BY c.embedding <=> p_query_embedding ASC
  LIMIT p_match_count;
END;
$$;

-- 9. Seed Initial Default Agents
INSERT INTO agents (id, name, description, tags, instructions, published, created_at, chunk_size, chunk_overlap, top_k, min_score)
VALUES 
(
  'rajasthan-mining-law',
  'Rajasthan Mining Law Assistant',
  'Ask about mining acts, rules and lease procedures.',
  '["Law", "Rajasthan"]'::jsonb,
  'Answer only from the provided sources. Cite the section and page. If unsure, say you don''t know.',
  true,
  NOW(),
  800,
  100,
  6,
  0.50
),
(
  'mine-safety-sop',
  'Mine Safety SOP Assistant',
  'Step-by-step safety procedures for workers.',
  '["Safety", "SOP"]'::jsonb,
  'Answer only from approved SOPs. Be brief and list steps in order.',
  false,
  NOW(),
  800,
  100,
  6,
  0.50
)
ON CONFLICT (id) DO NOTHING;

-- 10. Client Deployments & Embed Accounts Table
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  contact_email TEXT,
  total_queries INT NOT NULL DEFAULT 0,
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on api_key and domain
CREATE INDEX IF NOT EXISTS idx_clients_api_key ON clients(api_key);
CREATE INDEX IF NOT EXISTS idx_clients_agent_id ON clients(agent_id);

