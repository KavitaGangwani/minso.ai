import { NextRequest, NextResponse } from 'next/server';
import {
  getClientDeployments,
  createClientDeployment,
  updateClientDeployment,
  deleteClientDeployment,
  getClientQueries,
} from '@/lib/clients';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-minso-client-id, x-minso-client-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET /api/clients - Fetch all client deployments or specific client queries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const type = searchParams.get('type');

    if (type === 'queries') {
      const queries = await getClientQueries(clientId || undefined);
      return NextResponse.json(queries, { headers: corsHeaders });
    }

    const clients = await getClientDeployments();
    return NextResponse.json(clients, { headers: corsHeaders });
  } catch (err: any) {
    console.error('[API/Clients GET Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch client accounts' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/clients - Provision new client deployment & API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, domain, agentId, contactEmail } = body;

    if (!name || !domain || !agentId) {
      return NextResponse.json(
        { error: 'Organization name, website domain, and assigned agent are required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const newClient = await createClientDeployment({
      name,
      domain,
      agentId,
      contactEmail: contactEmail || '',
    });

    return NextResponse.json(newClient, { status: 201, headers: corsHeaders });
  } catch (err: any) {
    console.error('[API/Clients POST Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to provision client deployment' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH /api/clients - Update client deployment (name, domain/URL, agent, status, contactEmail)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, domain, agentId, status, contactEmail } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Client deployment ID is required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedClient = await updateClientDeployment(id, {
      name,
      domain,
      agentId,
      status,
      contactEmail,
    });

    if (!updatedClient) {
      return NextResponse.json(
        { error: 'Client deployment not found.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(updatedClient, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    console.error('[API/Clients PATCH Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update client deployment' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/clients - Revoke and remove client deployment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Client deployment ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const success = await deleteClientDeployment(id);
    return NextResponse.json({ success, id }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('[API/Clients DELETE Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to delete client deployment' },
      { status: 500, headers: corsHeaders }
    );
  }
}
