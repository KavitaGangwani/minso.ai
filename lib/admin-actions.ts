'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import supabase from '@/lib/supabase';
import { createSession, deleteSession } from '@/lib/session';
import { updateAgent, createAgent, deleteAgent, getAgent } from '@/lib/agents';
import { createDocument, deleteDocument, getDocumentById } from '@/lib/documents';
import { slugifyAgentName } from '@/lib/utils';
import { clearAgentCache } from '@/lib/cache';

// Sign in server action
export async function signInAction(prevState: { error?: string } | null, formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

  if (!password || password !== adminPassword) {
    return { error: 'Wrong password. Enter it again.' };
  }

  await createSession();
  return { success: true };
}

// Sign out server action
export async function signOutAction() {
  await deleteSession();
  redirect('/');
}

// Toggle agent publication status
export async function togglePublishAction(agentId: string, published: boolean) {
  await updateAgent(agentId, { published });
  revalidatePath('/admin/agents');
  revalidatePath(`/admin/agents/${agentId}`);
  revalidatePath('/agents');
  revalidatePath(`/agents/${agentId}`);
  return { success: true };
}

// Update agent instructions
export async function saveInstructionsAction(agentId: string, instructions: string) {
  await updateAgent(agentId, { instructions });
  revalidatePath(`/admin/agents/${agentId}`);
  return { success: true };
}

// Update agent chunking and retrieval parameters
export async function saveChunkingSettingsAction(
  agentId: string,
  settings: {
    chunk_size: number;
    chunk_overlap: number;
    top_k: number;
    min_score: number;
  }
) {
  const chunkSize = Number(settings.chunk_size);
  const chunkOverlap = Number(settings.chunk_overlap);
  const topK = Number(settings.top_k);
  const minScore = Number(settings.min_score);

  if (isNaN(chunkSize) || chunkSize < 100 || chunkSize > 4000) {
    return { error: 'Chunk size must be between 100 and 4000 characters.' };
  }
  if (isNaN(chunkOverlap) || chunkOverlap < 0 || chunkOverlap >= chunkSize) {
    return { error: 'Chunk overlap must be between 0 and less than chunk size.' };
  }
  if (isNaN(topK) || topK < 1 || topK > 50) {
    return { error: 'Top K must be between 1 and 50.' };
  }
  if (isNaN(minScore) || minScore < 0 || minScore > 1) {
    return { error: 'Min score threshold must be between 0.0 and 1.0.' };
  }

  await updateAgent(agentId, {
    chunk_size: chunkSize,
    chunk_overlap: chunkOverlap,
    top_k: topK,
    min_score: minScore,
  });

  revalidatePath(`/admin/agents/${agentId}`);
  return { success: true };
}

// Upload a PDF document to Supabase Storage bucket 'documents'
export async function uploadDocumentAction(agentId: string, formData: FormData) {
  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { error: 'No file provided' };
  }

  const filename = file.name;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Supabase Storage: documents/<agentId>/<filename>
  const storagePath = `${agentId}/${filename}`;
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    console.error('[Storage] Upload failed:', uploadError);
    return { error: `Failed to upload file to storage: ${uploadError.message}` };
  }

  // Record in Supabase documents table
  await createDocument(agentId, filename, 'uploaded', 'pdf');
  clearAgentCache(agentId);

  revalidatePath(`/admin/agents/${agentId}`);
  revalidatePath('/admin/agents');
  revalidatePath('/admin/documents');
  revalidatePath('/admin/analytics');

  return { success: true };
}

// Add a website link / URL knowledge source
export async function addWebLinkAction(agentId: string, url: string, customTitle?: string) {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return { error: 'Please enter a valid website URL' };
  }

  try {
    let target = cleanUrl;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    const parsed = new URL(target);
    const filename = customTitle?.trim() || `${parsed.hostname}${parsed.pathname === '/' ? '' : parsed.pathname}`;

    await createDocument(agentId, filename, 'uploaded', 'url', target);
    clearAgentCache(agentId);

    revalidatePath(`/admin/agents/${agentId}`);
    revalidatePath('/admin/agents');
    revalidatePath('/admin/documents');
    revalidatePath('/admin/analytics');

    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Invalid website URL' };
  }
}

// Add a plain text snippet / manual knowledge source
export async function addPlainTextAction(agentId: string, title: string, content: string) {
  const cleanTitle = title.trim();
  const cleanContent = content.trim();

  if (!cleanTitle) {
    return { error: 'Please enter a title for the document' };
  }
  if (!cleanContent || cleanContent.length < 20) {
    return { error: 'Please provide at least 20 characters of text content' };
  }

  try {
    await createDocument(agentId, cleanTitle, 'uploaded', 'text', null, cleanContent);
    clearAgentCache(agentId);

    revalidatePath(`/admin/agents/${agentId}`);
    revalidatePath('/admin/agents');
    revalidatePath('/admin/documents');
    revalidatePath('/admin/analytics');

    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to save plain text document' };
  }
}

// Delete document from table and Supabase storage
export async function deleteDocumentAction(documentId: number, agentId: string) {
  try {
    const doc = await getDocumentById(documentId);

    if (doc && (!doc.doc_type || doc.doc_type === 'pdf')) {
      const storagePath = `${agentId}/${doc.filename}`;
      await supabase.storage.from('documents').remove([storagePath]);
    }

    await deleteDocument(documentId);
    clearAgentCache(agentId);

    revalidatePath(`/admin/agents/${agentId}`);
    revalidatePath('/admin/agents');
    revalidatePath('/admin/documents');
    revalidatePath('/admin/analytics');

    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete document' };
  }
}

// Create a new agent server action
export async function createAgentAction(prevState: any, formData: FormData) {
  const name = (formData.get('name') as string || '').trim();
  const description = (formData.get('description') as string || '').trim();
  const rawTags = (formData.get('tags') as string || '').trim();
  const instructions = (formData.get('instructions') as string || '').trim();
  const published = formData.get('published') === 'on' || formData.get('published') === 'true';

  if (!name) {
    return { error: 'Agent name is required.' };
  }

  if (!instructions) {
    return { error: 'Agent prompt instructions are required.' };
  }

  const id = slugifyAgentName(name);
  if (!id) {
    return { error: 'Agent name must contain letters or numbers to generate a valid ID.' };
  }

  // Ensure unique ID
  const existing = await getAgent(id);
  if (existing) {
    return { error: `An agent with the ID "${id}" already exists. Please choose a different name.` };
  }

  const tags = rawTags
    ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    await createAgent({
      id,
      name,
      description,
      tags,
      instructions,
      published,
    });

    revalidatePath('/admin/agents');
    revalidatePath('/agents');

    return { success: true, agentId: id };
  } catch (err: any) {
    return { error: err.message || 'Failed to create agent.' };
  }
}

// Delete an agent and all related records, storage files, and cache
export async function deleteAgentAction(agentId: string) {
  try {
    const existing = await getAgent(agentId);
    if (!existing) {
      return { error: 'Agent not found.' };
    }

    // 1. Remove files in Supabase Storage for this agent
    try {
      const { data: list } = await supabase.storage.from('documents').list(agentId);
      if (list && list.length > 0) {
        const filePaths = list.map((item) => `${agentId}/${item.name}`);
        await supabase.storage.from('documents').remove(filePaths);
      }
    } catch (storageErr) {
      console.warn('[Storage] Warning clearing storage files for agent:', storageErr);
    }

    // 2. Remove database rows (CASCADE will delete chunks and documents)
    await deleteAgent(agentId);

    // 3. Clear cache
    clearAgentCache(agentId);

    // 4. Revalidate paths
    revalidatePath('/admin/agents');
    revalidatePath(`/admin/agents/${agentId}`);
    revalidatePath('/admin/documents');
    revalidatePath('/admin/analytics');
    revalidatePath('/admin/questions');
    revalidatePath('/agents');
    revalidatePath(`/agents/${agentId}`);

    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete agent.' };
  }
}
