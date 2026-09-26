import supabase from '../supabase';
import { extractTextFromPdf, PageText } from './extract';
import { extractTextFromUrl } from './extract-web';
import { extractTextFromRaw } from './extract-text';
import { chunkDocumentPages } from './chunk';
import { embedPassage } from './embed';
import { clearAgentCache } from '../cache';

export interface IngestResult {
  success: boolean;
  error?: string;
  chunkCount?: number;
}

// Ingest a document (PDF, Website URL, or Raw Text): extract, chunk, embed, and store into Supabase
export async function ingestDocument(documentId: number): Promise<IngestResult> {
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (docError || !doc) {
    throw new Error(`Document #${documentId} not found: ${docError?.message || ''}`);
  }

  const docType = doc.doc_type || 'pdf';

  console.log(
    `[Ingest] Starting ingestion for Document #${doc.id} ("${doc.filename}", type: ${docType}) for Agent "${doc.agent_id}"`
  );

  // Set status to processing and remove any previous chunks
  await supabase
    .from('documents')
    .update({ status: 'processing', error: null })
    .eq('id', doc.id);

  await supabase
    .from('chunks')
    .delete()
    .eq('document_id', doc.id);

  clearAgentCache(doc.agent_id);

  try {
    let pages: PageText[] = [];

    // 1. Extract text according to document type
    if (docType === 'url') {
      const targetUrl = doc.source_url || doc.filename;
      console.log(`[Ingest] Step 1/3: Extracting text from URL: ${targetUrl}...`);
      const extracted = await extractTextFromUrl(targetUrl);
      pages = extracted.pages;
    } else if (docType === 'text') {
      console.log(`[Ingest] Step 1/3: Extracting text from raw content (${doc.filename})...`);
      const extracted = extractTextFromRaw(doc.filename, doc.content || '');
      pages = extracted.pages;
    } else {
      // PDF file extraction from Supabase Storage
      const storagePath = `${doc.agent_id}/${doc.filename}`;
      console.log(`[Ingest] Step 1/3: Downloading PDF from Supabase Storage (${storagePath})...`);

      const { data: fileBlob, error: downloadErr } = await supabase.storage
        .from('documents')
        .download(storagePath);

      if (downloadErr || !fileBlob) {
        throw new Error(
          `Failed to download PDF from storage: ${downloadErr?.message || 'File not found in bucket'}`
        );
      }

      const arrayBuffer = await fileBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      pages = await extractTextFromPdf(buffer);
    }

    // Calculate total character count to detect scanned/empty content
    const totalTextLength = pages.reduce((acc, p) => acc + p.text.length, 0);
    console.log(
      `[Ingest] Extracted ${pages.length} pages/sections, total ${totalTextLength} characters.`
    );

    if (totalTextLength < 30) {
      const reason = docType === 'pdf' ? 'Scanned PDF: needs OCR' : 'Insufficient readable content';
      console.warn(
        `[Ingest] Document #${doc.id} has insufficient text (${totalTextLength} chars). Flagging as failed.`
      );
      await supabase
        .from('documents')
        .update({ status: 'failed', error: reason })
        .eq('id', doc.id);

      return {
        success: false,
        error: reason,
      };
    }

    // 2. Chunk document text using agent's chunking configuration
    const { data: agent } = await supabase
      .from('agents')
      .select('chunk_size, chunk_overlap')
      .eq('id', doc.agent_id)
      .maybeSingle();

    const chunkSize = agent?.chunk_size ?? 800;
    const chunkOverlap = agent?.chunk_overlap ?? 100;

    console.log(
      `[Ingest] Step 2/3: Splitting text into structured chunks (chunkSize: ${chunkSize}, overlap: ${chunkOverlap})...`
    );
    const chunks = chunkDocumentPages(pages, {
      chunkSize,
      chunkOverlap,
    });
    console.log(`[Ingest] Created ${chunks.length} chunks.`);

    if (chunks.length === 0) {
      await supabase
        .from('documents')
        .update({ status: 'failed', error: 'No readable content chunks found' })
        .eq('id', doc.id);

      return {
        success: false,
        error: 'No readable content chunks found',
      };
    }

    // 3. Generate embeddings and store into Supabase database
    console.log(
      `[Ingest] Step 3/3: Embedding ${chunks.length} chunks with multilingual model...`
    );

    const chunkRows: Array<{
      agent_id: string;
      document_id: number;
      text: string;
      section: string;
      page: number;
      embedding: number[] | null;
    }> = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embeddingArray = await embedPassage(chunk.text);
      chunkRows.push({
        agent_id: doc.agent_id,
        document_id: Number(doc.id),
        text: chunk.text,
        section: chunk.section,
        page: chunk.page,
        embedding: embeddingArray,
      });

      if ((i + 1) % 5 === 0 || i === chunks.length - 1) {
        console.log(`[Ingest] Embedded ${i + 1}/${chunks.length} chunks.`);
      }
    }

    // Batch insert into chunks table
    for (let i = 0; i < chunkRows.length; i += 50) {
      const batch = chunkRows.slice(i, i + 50);
      const { error: insertErr } = await supabase.from('chunks').insert(batch);
      if (insertErr) {
        throw new Error(`Failed to insert chunks: ${insertErr.message}`);
      }
    }

    // Invalidate in-memory chunk embedding cache for this agent
    clearAgentCache(doc.agent_id);

    // Update document status to indexed
    await supabase
      .from('documents')
      .update({ status: 'indexed', error: null })
      .eq('id', doc.id);

    console.log(
      `[Ingest] Successfully indexed Document #${doc.id} with ${chunks.length} chunks in Supabase.`
    );

    return {
      success: true,
      chunkCount: chunks.length,
    };
  } catch (err: any) {
    console.error(`[Ingest] Failed processing Document #${doc.id}:`, err);
    await supabase
      .from('documents')
      .update({
        status: 'failed',
        error: err?.message || 'Processing failed',
      })
      .eq('id', doc.id);

    return {
      success: false,
      error: err?.message || 'Ingestion failed',
    };
  }
}
