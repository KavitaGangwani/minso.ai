import supabase from './supabase';
import { Document } from './types';

export type { Document };

// Get all documents across all agents with chunk count and agent name
export async function getAllDocuments(): Promise<Array<Document & { agent_name: string }>> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      agents (
        name
      ),
      chunks (
        count
      )
    `)
    .order('id', { ascending: false });

  if (error) {
    console.error('[Documents] Failed to fetch all documents:', error);
    return [];
  }

  return (data || []).map((doc: any) => ({
    id: Number(doc.id),
    agent_id: doc.agent_id,
    filename: doc.filename,
    status: doc.status,
    error: doc.error,
    created_at: doc.created_at,
    doc_type: doc.doc_type || 'pdf',
    source_url: doc.source_url,
    content: doc.content,
    agent_name: doc.agents?.name || doc.agent_id,
    chunk_count: doc.chunks?.[0]?.count ?? (Array.isArray(doc.chunks) ? doc.chunks.length : 0),
  }));
}

// Get all documents for a specific agent with chunk count
export async function getDocumentsByAgentId(agentId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      chunks (
        count
      )
    `)
    .eq('agent_id', agentId)
    .order('id', { ascending: false });

  if (error) {
    console.error(`[Documents] Failed to fetch documents for agent ${agentId}:`, error);
    return [];
  }

  return (data || []).map((doc: any) => ({
    id: Number(doc.id),
    agent_id: doc.agent_id,
    filename: doc.filename,
    status: doc.status,
    error: doc.error,
    created_at: doc.created_at,
    doc_type: doc.doc_type || 'pdf',
    source_url: doc.source_url,
    content: doc.content,
    chunk_count: doc.chunks?.[0]?.count ?? (Array.isArray(doc.chunks) ? doc.chunks.length : 0),
  }));
}

// Get a single document by ID
export async function getDocumentById(documentId: number): Promise<Document | undefined> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      chunks (
        count
      )
    `)
    .eq('id', documentId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error(`[Documents] Failed to fetch document #${documentId}:`, error);
    return undefined;
  }

  return {
    id: Number(data.id),
    agent_id: data.agent_id,
    filename: data.filename,
    status: data.status,
    error: data.error,
    created_at: data.created_at,
    doc_type: data.doc_type || 'pdf',
    source_url: data.source_url,
    content: data.content,
    chunk_count: data.chunks?.[0]?.count ?? (Array.isArray(data.chunks) ? data.chunks.length : 0),
  };
}

// Get document count for all agents grouped by type
export async function getDocumentCountsByAgent(): Promise<
  Record<string, { total: number; pdf: number; url: number; text: number }>
> {
  const { data, error } = await supabase
    .from('documents')
    .select('agent_id, doc_type');

  if (error) {
    console.error('[Documents] Failed to fetch document counts:', error);
    return {};
  }

  const counts: Record<string, { total: number; pdf: number; url: number; text: number }> = {};

  for (const doc of data || []) {
    if (!counts[doc.agent_id]) {
      counts[doc.agent_id] = { total: 0, pdf: 0, url: 0, text: 0 };
    }
    counts[doc.agent_id].total += 1;
    const type = doc.doc_type || 'pdf';
    if (type === 'url') counts[doc.agent_id].url += 1;
    else if (type === 'text') counts[doc.agent_id].text += 1;
    else counts[doc.agent_id].pdf += 1;
  }

  return counts;
}

// Insert a new document record (PDF, Web Link, or Plain Text)
export async function createDocument(
  agentId: string,
  filename: string,
  status: string = 'uploaded',
  docType: 'pdf' | 'url' | 'text' = 'pdf',
  sourceUrl?: string | null,
  content?: string | null
): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      agent_id: agentId,
      filename,
      status,
      doc_type: docType,
      source_url: sourceUrl || null,
      content: content || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create document record: ${error.message}`);
  }

  return {
    id: Number(data.id),
    agent_id: data.agent_id,
    filename: data.filename,
    status: data.status,
    created_at: data.created_at,
    doc_type: data.doc_type || 'pdf',
    source_url: data.source_url,
    content: data.content,
    chunk_count: 0,
  };
}

// Delete a document and its associated chunks
export async function deleteDocument(documentId: number): Promise<boolean> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (error) {
    console.error(`[Documents] Failed to delete document #${documentId}:`, error);
    return false;
  }

  return true;
}
