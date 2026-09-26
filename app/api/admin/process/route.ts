import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { ingestDocument } from '@/lib/rag/ingest';

export const dynamic = 'force-dynamic';

// Process and index an uploaded document
export async function POST(request: NextRequest) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId is required' },
        { status: 400 }
      );
    }

    const result = await ingestDocument(Number(documentId));
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API/Admin/Process Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Processing failed' },
      { status: 500 }
    );
  }
}
