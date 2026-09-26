import supabase from './supabase';
import { Agent } from './types';

export type { Agent };

// Convert a database row to a typed Agent object
function formatAgentRow(row: any): Agent {
  let parsedTags: string[] = [];
  if (Array.isArray(row.tags)) {
    parsedTags = row.tags;
  } else if (typeof row.tags === 'string') {
    try {
      parsedTags = JSON.parse(row.tags);
    } catch {
      parsedTags = [];
    }
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    tags: parsedTags,
    instructions: row.instructions || '',
    published: Boolean(row.published),
    created_at: row.created_at,
    chunk_size: row.chunk_size ?? 800,
    chunk_overlap: row.chunk_overlap ?? 100,
    top_k: row.top_k ?? 6,
    min_score: Number(row.min_score ?? 0.50),
  };
}

// Get all agents that are published (for public pages)
export async function getPublishedAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[Agents] Failed to fetch published agents:', error);
    return [];
  }

  return (data || []).map(formatAgentRow);
}

// Get all agents (for admin pages)
export async function getAllAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[Agents] Failed to fetch all agents:', error);
    return [];
  }

  return (data || []).map(formatAgentRow);
}

// Get a single agent by ID
export async function getAgent(id: string): Promise<Agent | undefined> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error(`[Agents] Failed to fetch agent ${id}:`, error);
    return undefined;
  }

  return formatAgentRow(data);
}

// Update an agent's fields in the database
export async function updateAgent(
  id: string,
  fields: Partial<Omit<Agent, 'id' | 'created_at'>>
): Promise<Agent | undefined> {
  const updatePayload: Record<string, any> = {};

  if (fields.name !== undefined) updatePayload.name = fields.name;
  if (fields.description !== undefined) updatePayload.description = fields.description;
  if (fields.tags !== undefined) updatePayload.tags = fields.tags;
  if (fields.instructions !== undefined) updatePayload.instructions = fields.instructions;
  if (fields.published !== undefined) updatePayload.published = fields.published;
  if (fields.chunk_size !== undefined) updatePayload.chunk_size = fields.chunk_size;
  if (fields.chunk_overlap !== undefined) updatePayload.chunk_overlap = fields.chunk_overlap;
  if (fields.top_k !== undefined) updatePayload.top_k = fields.top_k;
  if (fields.min_score !== undefined) updatePayload.min_score = fields.min_score;

  const { data, error } = await supabase
    .from('agents')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`[Agents] Failed to update agent ${id}:`, error);
    return undefined;
  }

  return formatAgentRow(data);
}

// Create a new agent in the Supabase database
export async function createAgent(data: {
  id: string;
  name: string;
  description: string;
  tags: string[];
  instructions: string;
  published: boolean;
  chunk_size?: number;
  chunk_overlap?: number;
  top_k?: number;
  min_score?: number;
}): Promise<Agent> {
  const payload = {
    id: data.id,
    name: data.name,
    description: data.description,
    tags: data.tags,
    instructions: data.instructions,
    published: data.published,
    chunk_size: data.chunk_size ?? 800,
    chunk_overlap: data.chunk_overlap ?? 100,
    top_k: data.top_k ?? 6,
    min_score: data.min_score ?? 0.50,
  };

  const { data: inserted, error } = await supabase
    .from('agents')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create agent: ${error.message}`);
  }

  return formatAgentRow(inserted);
}

// Delete an agent and all related records from the database
export async function deleteAgent(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`[Agents] Failed to delete agent ${id}:`, error);
    return false;
  }

  return true;
}
