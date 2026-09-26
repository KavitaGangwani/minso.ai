import supabase from '../supabase';
import { embedQuery } from './embed';

export interface SearchResult {
  id: number;
  text: string;
  section: string;
  page: number;
  document: string;
  score: number;
}

// Search for the top most relevant chunks using pgvector's cosine distance operator in Postgres
export async function searchChunks(
  agentId: string,
  question: string,
  rewrittenQuery?: string | null,
  minScore?: number,
  topK?: number
): Promise<SearchResult[]> {
  const startTotal = performance.now();

  // If minScore or topK not provided, fetch from agent configuration in Supabase
  let targetMinScore = minScore;
  let targetTopK = topK;

  if (targetMinScore === undefined || targetTopK === undefined) {
    const { data: agentRow } = await supabase
      .from('agents')
      .select('top_k, min_score')
      .eq('id', agentId)
      .maybeSingle();

    if (targetMinScore === undefined) {
      targetMinScore = agentRow?.min_score !== undefined ? Number(agentRow.min_score) : 0.50;
    }
    if (targetTopK === undefined) {
      targetTopK = agentRow?.top_k ?? 6;
    }
  }

  const effectiveMinScore = targetMinScore ?? 0.50;
  const effectiveTopK = targetTopK ?? 6;

  // 1. Generate normalized query embeddings if available
  const queryEmbedding = await embedQuery(question);

  let rewrittenEmbedding: number[] | null = null;
  if (rewrittenQuery && rewrittenQuery.trim().length > 0) {
    console.log(`[Search] Embedding rewritten query: "${rewrittenQuery}"`);
    rewrittenEmbedding = await embedQuery(rewrittenQuery);
  }

  // 2. Query Postgres via pgvector match_chunks RPC function if embeddings succeeded
  const startRpc = performance.now();
  const resultsMap = new Map<number, SearchResult>();

  if (queryEmbedding && queryEmbedding.length > 0) {
    const { data: matches, error: rpcError } = await supabase.rpc('match_chunks', {
      p_agent_id: agentId,
      p_query_embedding: queryEmbedding,
      p_match_threshold: effectiveMinScore,
      p_match_count: effectiveTopK,
    });

    if (rpcError) {
      console.warn('[Search] match_chunks RPC warning:', rpcError.message);
    } else if (matches) {
      for (const m of matches) {
        resultsMap.set(Number(m.id), {
          id: Number(m.id),
          text: m.text,
          section: m.section,
          page: m.page,
          document: m.document,
          score: Number(m.score),
        });
      }
    }
  }

  // If rewritten query embedding is present, query and merge highest scores
  if (rewrittenEmbedding && rewrittenEmbedding.length > 0) {
    const { data: rewrittenMatches, error: rewrittenRpcErr } = await supabase.rpc(
      'match_chunks',
      {
        p_agent_id: agentId,
        p_query_embedding: rewrittenEmbedding,
        p_match_threshold: effectiveMinScore,
        p_match_count: effectiveTopK,
      }
    );

    if (rewrittenRpcErr) {
      console.warn('[Search] Rewritten match_chunks RPC warning:', rewrittenRpcErr.message);
    } else if (rewrittenMatches) {
      for (const m of rewrittenMatches) {
        const id = Number(m.id);
        const existing = resultsMap.get(id);
        const score = Number(m.score);
        if (!existing || score > existing.score) {
          resultsMap.set(id, {
            id,
            text: m.text,
            section: m.section,
            page: m.page,
            document: m.document,
            score,
          });
        }
      }
    }
  }

  // 3. Robust Hybrid / Keyword Fallback Search
  // If vector search returned 0 results (or embedding network is unavailable), search directly in Postgres
  if (resultsMap.size === 0) {
    console.log('[Search] Using resilient keyword search in database...');
    const searchTerms = `${question} ${rewrittenQuery || ''}`
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(
        (w) =>
          w.length > 2 &&
          !['what', 'how', 'when', 'where', 'which', 'who', 'the', 'and', 'for', 'are', 'can', 'with', 'about', 'tell'].includes(w)
      )
      .slice(0, 6);

    if (searchTerms.length > 0) {
      try {
        let query = supabase
          .from('chunks')
          .select('id, text, section, page, documents!inner(filename)')
          .eq('agent_id', agentId);

        const orCondition = searchTerms.map((t) => `text.ilike.%${t}%`).join(',');
        query = query.or(orCondition);

        const { data: keywordMatches, error: kwErr } = await query.limit(effectiveTopK * 2);

        if (!kwErr && keywordMatches && keywordMatches.length > 0) {
          keywordMatches.forEach((km: any, index: number) => {
            const id = Number(km.id);
            // Score by how many search terms are contained in the text
            const lowerText = (km.text || '').toLowerCase();
            const termMatches = searchTerms.filter((term) => lowerText.includes(term)).length;
            const score = Number((0.60 + Math.min(0.35, termMatches * 0.08) - index * 0.01).toFixed(2));

            resultsMap.set(id, {
              id,
              text: km.text,
              section: km.section || 'Statutory Section',
              page: km.page || 1,
              document: km.documents?.filename || 'Mining Regulations',
              score,
            });
          });
        }
      } catch (err: any) {
        console.warn('[Search] Keyword fallback error:', err.message);
      }
    }
  }

  const rpcDuration = (performance.now() - startRpc).toFixed(2);
  const totalDuration = (performance.now() - startTotal).toFixed(2);

  const finalResults = Array.from(resultsMap.values());
  finalResults.sort((a, b) => b.score - a.score);
  const topResults = finalResults.slice(0, effectiveTopK);

  console.log(
    `[Timing] Similarity search done (${rpcDuration}ms retrieval, Total: ${totalDuration}ms, returned ${topResults.length} chunks, topK: ${effectiveTopK})`
  );

  return topResults;
}

// In-memory cache is no longer required with database-side vector indexing
export function clearAgentCache(agentId: string) {
  // No-op kept for backwards compatibility
}

export function clearAllAgentCaches() {
  // No-op kept for backwards compatibility
}
