import { NextRequest, NextResponse } from 'next/server';
import { getAgent } from '@/lib/agents';
import { processClientQuery } from '@/lib/clients';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-minso-client-id, x-minso-client-key',
};

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Chat API endpoint supporting both direct site users and external client website embeds
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, question, clientId, clientDomain, source } = body;

    if (!agentId || !question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: agentId and question are required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const agent = await getAgent(agentId);

    // Only allow chat with published agents
    if (!agent || !agent.published) {
      return NextResponse.json(
        { error: 'Agent not found or is currently not published.' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Extract client header identifier and API key if provided in headers or body
    const bodyClientId = body.clientId || body.client_id;
    const bodyClientKey = body.apiKey || body.api_key || body.clientKey || body.client_key;

    const headerClientId = request.headers.get('x-minso-client-id') || bodyClientId;
    const headerClientKey =
      request.headers.get('x-minso-client-key') ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
      bodyClientKey;

    // Process RAG query with chunk telemetry and client audit
    const result = await processClientQuery({
      agentId: agent.id,
      question: question.trim(),
      clientId: headerClientId,
      apiKey: headerClientKey || undefined,
      clientDomain: clientDomain || request.headers.get('origin') || undefined,
      source: source || (headerClientKey || (headerClientId && headerClientId !== 'client-direct') ? 'client-portal' : 'main-website'),
    });

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (err: any) {
    console.error('[API/Chat Error]:', err);
    return NextResponse.json(
      {
        error:
          err.message || 'An error occurred while communicating with the agent.',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
