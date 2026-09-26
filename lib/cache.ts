// Note: In-memory chunk caching is obsolete and no longer needed with
// database-side pgvector similarity search in Postgres (HNSW index).
// Vector search is executed directly inside Supabase without loading chunks into Node.js process memory.

export function clearAgentCache(_agentId: string) {
  // No-op kept for backwards compatibility
}

export function clearAllAgentCaches() {
  // No-op kept for backwards compatibility
}
