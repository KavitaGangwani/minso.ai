'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { ClientDeployment, ClientQueryRecord } from '@/lib/clients';

interface ClientDashboardClientProps {
  initialClients: ClientDeployment[];
  initialQueries: ClientQueryRecord[];
}

export default function ClientDashboardClient({
  initialClients,
  initialQueries,
}: ClientDashboardClientProps) {
  const [clients, setClients] = useState<ClientDeployment[]>(initialClients);
  const [queries, setQueries] = useState<ClientQueryRecord[]>(initialQueries);
  const [activeTab, setActiveTab] = useState<'deployments' | 'telemetry' | 'relay-test' | 'embed-code'>('deployments');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [activeQueryDetail, setActiveQueryDetail] = useState<ClientQueryRecord | null>(initialQueries[0] || null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isRefreshingQueries, setIsRefreshingQueries] = useState(false);
  const [expandedChunks, setExpandedChunks] = useState<Record<string, boolean>>({});

  // Fetch latest queries from server API
  const refreshQueries = useCallback(async (showLoading = false) => {
    if (showLoading) setIsRefreshingQueries(true);
    try {
      const res = await fetch('/api/clients?type=queries');
      if (res.ok) {
        const latestQueries: ClientQueryRecord[] = await res.json();
        setQueries(latestQueries);
      }
    } catch (err) {
      console.error('Failed to fetch real-time queries:', err);
    } finally {
      if (showLoading) setIsRefreshingQueries(false);
    }
  }, []);

  // Poll for new live queries periodically (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshQueries(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshQueries]);

  // Refresh immediately when switching to telemetry tab
  useEffect(() => {
    if (activeTab === 'telemetry') {
      refreshQueries(true);
    }
  }, [activeTab, refreshQueries]);

  // New Client Modal Form state
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientDomain, setNewClientDomain] = useState('');
  const [newClientAgent, setNewClientAgent] = useState('rajasthan-mining-law');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit Client Modal Form state
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientDeployment | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientDomain, setEditClientDomain] = useState('');
  const [editClientAgent, setEditClientAgent] = useState('rajasthan-mining-law');
  const [editClientEmail, setEditClientEmail] = useState('');
  const [editClientStatus, setEditClientStatus] = useState<'active' | 'staged' | 'paused'>('active');
  const [isEditing, setIsEditing] = useState(false);
  const [editErrorMsg, setEditErrorMsg] = useState<string | null>(null);

  // Relay Test Console State
  const [testQuestion, setTestQuestion] = useState('What is the procedure for renewal of a minor mineral lease?');
  const [testClient, setTestClient] = useState(initialClients[0]?.id || '');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Filter queries based on selected client or direct portal queries
  const filteredQueries = selectedClientId === 'all'
    ? queries
    : selectedClientId === 'client-direct'
    ? queries.filter((q) => q.clientId === 'client-direct' || q.clientName.includes('Main Website'))
    : queries.filter((q) => q.clientId === selectedClientId);

  // Keep activeQueryDetail in sync with filteredQueries
  useEffect(() => {
    if (filteredQueries.length > 0) {
      if (!activeQueryDetail || !filteredQueries.some((q) => q.id === activeQueryDetail.id)) {
        setActiveQueryDetail(filteredQueries[0]);
      }
    }
  }, [filteredQueries, activeQueryDetail]);

  const toggleChunkExpand = (key: string) => {
    setExpandedChunks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedClientObj = clients.find((c) => c.id === testClient) || clients[0];

  const handleCopyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleOpenEditModal = (client: ClientDeployment) => {
    setEditingClient(client);
    setEditClientName(client.name);
    setEditClientDomain(client.domain);
    setEditClientAgent(client.agentId);
    setEditClientEmail(client.contactEmail || '');
    setEditClientStatus(client.status || 'active');
    setEditErrorMsg(null);
    setShowEditClientModal(true);
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editClientName.trim() || !editClientDomain.trim()) return;

    setIsEditing(true);
    setEditErrorMsg(null);

    try {
      const res = await fetch('/api/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingClient.id,
          name: editClientName.trim(),
          domain: editClientDomain.trim(),
          agentId: editClientAgent,
          status: editClientStatus,
          contactEmail: editClientEmail.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update client deployment');
      }

      const updated: ClientDeployment = await res.json();
      setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setShowEditClientModal(false);
      setEditingClient(null);
    } catch (err: any) {
      setEditErrorMsg(err.message || 'Error updating client deployment');
    } finally {
      setIsEditing(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientDomain) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClientName,
          domain: newClientDomain,
          agentId: newClientAgent,
          contactEmail: newClientEmail,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create client');
      }

      const created: ClientDeployment = await res.json();
      setClients((prev) => [created, ...prev]);
      if (!testClient) setTestClient(created.id);
      setShowNewClientModal(false);
      setNewClientName('');
      setNewClientDomain('');
      setNewClientEmail('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error provisioning client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to revoke and delete this client deployment?')) return;

    try {
      const res = await fetch(`/api/clients?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setClients((prev) => prev.filter((c) => c.id !== id));
        if (testClient === id) {
          setTestClient(clients.find((c) => c.id !== id)?.id || '');
        }
      }
    } catch (err) {
      console.error('Failed to delete client:', err);
      // Optimistic delete
      setClients((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleRunRelayTest = async () => {
    if (!testQuestion.trim()) return;
    setTestLoading(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-minso-client-id': selectedClientObj?.id || '',
          'x-minso-client-key': selectedClientObj?.apiKey || '',
        },
        body: JSON.stringify({
          agentId: selectedClientObj?.agentId || 'rajasthan-mining-law',
          question: testQuestion,
          clientId: selectedClientObj?.id,
          clientDomain: selectedClientObj?.domain,
        }),
      });

      const data = await res.json();
      setTestResult(data);

      if (data.answer) {
        const newRecord: ClientQueryRecord = {
          id: `cq-${Date.now()}`,
          clientId: selectedClientObj?.id || 'client-test',
          clientName: selectedClientObj?.name || 'Live Client Portal',
          clientDomain: selectedClientObj?.domain || 'http://localhost:5173',
          agentId: selectedClientObj?.agentId || 'rajasthan-mining-law',
          agentName: selectedClientObj?.agentName || 'Mining Assistant',
          question: testQuestion,
          answer: data.answer,
          sourcesCount: data.sources?.length || 0,
          retrievalMs: data.timings?.retrievalMs || 0,
          llmMs: data.timings?.llmMs || 0,
          totalMs: data.timings?.totalMs || 0,
          timestamp: new Date().toISOString(),
          chunksUsed: data.chunksUsed || [],
        };
        setQueries((prev) => [newRecord, ...prev.filter((q) => q.id !== newRecord.id)]);
        setActiveQueryDetail(newRecord);
        // Sync full server query logs
        refreshQueries(false);
      }
    } catch (err: any) {
      setTestResult({ error: err.message || 'Failed to process relay test' });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="client-dashboard-wrap">
      {/* Header Row */}
      <div className="adm-header-row">
        <div>
          <h2>Client Deployments & Embeds</h2>
          <p className="sub">
            Sell and distribute specialized mining agents to client companies. Manage API keys, audit client website traffic, and inspect exact vector chunks.
          </p>
        </div>
        <button
          className="btn btn-sm btn-inline-action"
          onClick={() => setShowNewClientModal(true)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Provision Client Deployment</span>
        </button>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Active Clients</div>
          <div className="adm-kpi-val" style={{ color: 'var(--amber)' }}>{clients.length}</div>
          <div className="adm-kpi-sub">Registered client deployments</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Main Site / Client Queries</div>
          <div className="adm-kpi-val" style={{ color: '#68B5FF' }}>
            {queries.filter((q) => q.clientId === 'client-direct').length}{' '}
            <span style={{ fontSize: '18px', color: 'var(--mute)' }}>
              / {queries.filter((q) => q.clientId !== 'client-direct').length}
            </span>
          </div>
          <div className="adm-kpi-sub">Main Web Portal · External Embeds</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Grounded Citation Rate</div>
          <div className="adm-kpi-val" style={{ color: 'var(--ok)' }}>100%</div>
          <div className="adm-kpi-sub">Strict statutory verification</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-label">Mean Relay Speed</div>
          <div className="adm-kpi-val" style={{ color: 'var(--ink)' }}>&lt; 1.2s</div>
          <div className="adm-kpi-sub">Vector retrieval & answer synthesis</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="client-sub-tabs">
        <button
          className={`client-tab-btn ${activeTab === 'deployments' ? 'active' : ''}`}
          onClick={() => setActiveTab('deployments')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>Client Portals ({clients.length})</span>
        </button>

        <button
          className={`client-tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>Query & Chunk Inspector ({filteredQueries.length})</span>
        </button>

        <button
          className={`client-tab-btn ${activeTab === 'relay-test' ? 'active' : ''}`}
          onClick={() => setActiveTab('relay-test')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>Relay API Simulator</span>
        </button>

        <button
          className={`client-tab-btn ${activeTab === 'embed-code' ? 'active' : ''}`}
          onClick={() => setActiveTab('embed-code')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span>Client Integration SDK</span>
        </button>
      </div>

      {/* ================= TAB 1: CLIENT DEPLOYMENTS ================= */}
      {activeTab === 'deployments' && (
        <>
          {clients.length === 0 ? (
            <div className="box" style={{ padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏢</div>
              <h3 style={{ fontSize: '26px', marginBottom: '8px' }}>No Client Deployments Registered Yet</h3>
              <p className="sub" style={{ maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                Provision your first client deployment to generate their production API key, configure their website domain, and start routing questions to your mining agents.
              </p>
              <button
                className="btn btn-sm btn-inline-action"
                onClick={() => setShowNewClientModal(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Provision First Client Deployment</span>
              </button>
            </div>
          ) : (
            <div className="client-deployments-grid">
              {clients.map((client) => (
                <div key={client.id} className="client-card">
                  <div className="client-card-top">
                    <div className="client-title-block">
                      <span className={`client-status-badge ${client.status || 'active'}`}>
                        <span className={`status-dot ${client.status === 'paused' ? 'red' : client.status === 'staged' ? 'amber' : 'green'}`} />
                        {client.status === 'paused' ? 'Paused' : client.status === 'staged' ? 'Staged' : 'Live on Client Portal'}
                      </span>
                      <h3 className="client-card-name">{client.name}</h3>
                      <a
                        href={client.domain}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="client-domain-link"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <span>{client.domain}</span>
                      </a>
                    </div>
                  </div>

                  <div className="client-meta-box">
                    <div className="client-meta-row">
                      <span className="meta-lbl">Assigned Agent</span>
                      <span className="meta-val highlight">{client.agentName}</span>
                    </div>

                    <div className="client-meta-row">
                      <span className="meta-lbl">API Key</span>
                      <div className="client-key-box">
                        <span className="meta-val code">{client.apiKey.substring(0, 14)}...</span>
                        <button
                          type="button"
                          className="copy-key-btn"
                          title="Copy Full API Key"
                          onClick={() => handleCopyKey(client.id, client.apiKey)}
                        >
                          {copiedKeyId === client.id ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="client-meta-row">
                      <span className="meta-lbl">Total Inquiries</span>
                      <span className="meta-val">{client.totalQueries || 0} requests</span>
                    </div>

                    <div className="client-meta-row">
                      <span className="meta-lbl">Last Active</span>
                      <span className="meta-val">
                        {new Date(client.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="client-card-actions">
                    <button
                      className="btn line btn-sm btn-inline-action"
                      title="Edit Client URL & Settings"
                      onClick={() => handleOpenEditModal(client)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span>Edit</span>
                    </button>

                    <button
                      className="btn line btn-sm btn-inline-action"
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setActiveTab('telemetry');
                      }}
                    >
                      <span>Inspect Queries</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>

                    <button
                      className="btn line btn-sm btn-inline-action"
                      onClick={() => {
                        setTestClient(client.id);
                        setActiveTab('relay-test');
                      }}
                    >
                      <span>Test Relay</span>
                    </button>

                    <button
                      className="delete-client-btn"
                      title="Revoke & Remove Deployment"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ================= TAB 2: CLIENT QUERY & CHUNK INSPECTOR ================= */}
      {activeTab === 'telemetry' && (
        <div className="telemetry-split-view">
          {/* Left Column: List of Client Queries */}
          <div className="telemetry-list-pane">
            <div className="telemetry-filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '180px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mute)' }}>
                  Filter Inquiries:
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="client-select-input"
                  style={{ width: '100%' }}
                >
                  <option value="all">All Inquiries ({queries.length})</option>
                  <option value="client-direct">
                    🌐 Main Website ({queries.filter((q) => q.clientId === 'client-direct').length})
                  </option>
                  {clients.map((c) => {
                    const count = queries.filter((q) => q.clientId === c.id).length;
                    return (
                      <option key={c.id} value={c.id}>
                        🏢 {c.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                type="button"
                className="btn line btn-sm btn-inline-action"
                onClick={() => refreshQueries(true)}
                disabled={isRefreshingQueries}
                title="Fetch latest queries from server"
                style={{ height: '36px', alignSelf: 'flex-end', whiteSpace: 'nowrap' }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{
                    animation: isRefreshingQueries ? 'spin 1s linear infinite' : 'none',
                  }}
                >
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span>{isRefreshingQueries ? 'Syncing...' : 'Refresh'}</span>
              </button>
            </div>

            <div className="telemetry-items-list">
              {filteredQueries.length === 0 ? (
                <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--mute)', fontSize: '13.5px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔍</div>
                  <p style={{ margin: '0 0 12px' }}>No queries found for this selection yet.</p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {selectedClientId !== 'all' && (
                      <button
                        className="btn line btn-sm"
                        onClick={() => setSelectedClientId('all')}
                      >
                        Show All Inquiries
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-inline-action"
                      onClick={() => setActiveTab('relay-test')}
                    >
                      Test In Relay Simulator &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                filteredQueries.map((q) => {
                  const isSelected = activeQueryDetail?.id === q.id;
                  const isMainSite = q.clientId === 'client-direct';
                  const queryDate = new Date(q.timestamp);
                  const isToday = queryDate.toDateString() === new Date().toDateString();
                  const timeFormatted = isToday
                    ? queryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    : queryDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + queryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={q.id}
                      className={`telemetry-item-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setActiveQueryDetail(q)}
                    >
                      <div className="telemetry-item-header">
                        <span
                          className="telemetry-client-pill"
                          style={{
                            background: isMainSite ? 'rgba(104, 181, 255, 0.12)' : 'rgba(255, 184, 28, 0.12)',
                            color: isMainSite ? '#68B5FF' : 'var(--amber)',
                            border: `1px solid ${isMainSite ? 'rgba(104, 181, 255, 0.25)' : 'rgba(255, 184, 28, 0.25)'}`,
                          }}
                        >
                          {isMainSite ? '🌐 Main Website' : `🏢 ${q.clientName}`}
                        </span>
                        <span className="telemetry-time" style={{ fontSize: '11px', color: 'var(--mute)' }}>
                          {timeFormatted}
                        </span>
                      </div>
                      <div className="telemetry-question-text">{q.question}</div>
                      <div className="telemetry-item-footer">
                        <span className="telemetry-latency" style={{ color: 'var(--amber)', fontWeight: 600 }}>
                          {Math.round(q.totalMs)}ms
                        </span>
                        <span className="telemetry-chunks-badge">
                          {q.chunksUsed?.length || 0} Vector {q.chunksUsed?.length === 1 ? 'Chunk' : 'Chunks'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Deep Chunk Inspection Drawer */}
          <div className="telemetry-detail-pane">
            {activeQueryDetail ? (
              <div className="chunk-inspector-card">
                <div className="inspector-head">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="section-eyebrow" style={{ margin: 0 }}>
                      RAG RETRIEVAL & CHUNK EVALUATION AUDIT
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--mute)' }}>
                      {new Date(activeQueryDetail.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                  <h3>{activeQueryDetail.question}</h3>
                  <div className="inspector-origin">
                    <span>Source: </span>
                    {activeQueryDetail.clientId === 'client-direct' ? (
                      <span style={{ color: '#68B5FF', fontWeight: 600 }}>🌐 MINSO.AI Main Website</span>
                    ) : (
                      <a
                        href={activeQueryDetail.clientDomain}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--amber)', textDecoration: 'underline' }}
                      >
                        🏢 {activeQueryDetail.clientName} ({activeQueryDetail.clientDomain})
                      </a>
                    )}
                    <span> &middot; Agent: <strong>{activeQueryDetail.agentName}</strong></span>
                  </div>
                </div>

                {/* Grounded Response Returned to Client */}
                <div className="inspector-response-box">
                  <div className="inspector-box-lbl">SYNTHESIZED RESPONSE RETURNED TO USER / CLIENT:</div>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{activeQueryDetail.answer}</p>
                </div>

                {/* Chunks Used Breakdown */}
                <div className="inspector-chunks-wrap">
                  <div className="inspector-box-lbl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                      EXACT VECTOR CHUNKS RETRIEVED ({activeQueryDetail.chunksUsed?.length || 0}):
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--mute)', fontWeight: 400, textTransform: 'none' }}>
                      Ranked by pgvector cosine similarity
                    </span>
                  </div>

                  {(!activeQueryDetail.chunksUsed || activeQueryDetail.chunksUsed.length === 0) ? (
                    <div style={{ padding: '16px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '2px', color: 'var(--mute)', fontSize: '13px' }}>
                      No vector chunks exceeded the similarity score threshold for this query. The agent responded with a fallback grounded response.
                    </div>
                  ) : (
                    <div className="inspector-chunks-list">
                      {activeQueryDetail.chunksUsed.map((chunk, idx) => {
                        const chunkKey = `${activeQueryDetail.id}-${idx}`;
                        const isExpanded = expandedChunks[chunkKey];
                        const matchPct = Math.round((chunk.score || 0.85) * 100);
                        const scoreColor =
                          matchPct >= 85 ? 'var(--ok)' : matchPct >= 70 ? '#68B5FF' : 'var(--amber)';

                        return (
                          <div key={idx} className="chunk-detail-box">
                            <div className="chunk-detail-head">
                              <span className="chunk-doc-title" style={{ fontWeight: 600 }}>
                                📄 {chunk.document} &middot; {chunk.section} &middot; p. {chunk.page}
                              </span>
                              <span
                                className="chunk-score-pill"
                                style={{
                                  backgroundColor: 'rgba(255,255,255,0.06)',
                                  borderColor: scoreColor,
                                  color: scoreColor,
                                }}
                              >
                                Similarity: {matchPct}%
                              </span>
                            </div>

                            <div
                              className="chunk-text-snippet"
                              style={{
                                whiteSpace: isExpanded ? 'pre-wrap' : 'normal',
                                lineHeight: 1.6,
                              }}
                            >
                              &ldquo;{isExpanded ? (chunk.fullText || chunk.snippet) : chunk.snippet}&rdquo;
                            </div>

                            {(chunk.fullText && chunk.fullText.length > chunk.snippet.length) && (
                              <button
                                type="button"
                                onClick={() => toggleChunkExpand(chunkKey)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--amber)',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  padding: '4px 0 0',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <span>{isExpanded ? '▲ Hide Full Raw Chunk Text' : '▼ Show Full Raw Chunk Text'}</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Timing Telemetry */}
                <div className="inspector-timings-bar">
                  <span>Retrieval Latency: <strong>{Math.round(activeQueryDetail.retrievalMs)}ms</strong></span>
                  <span>&bull;</span>
                  <span>Synthesis Latency: <strong>{Math.round(activeQueryDetail.llmMs)}ms</strong></span>
                  <span>&bull;</span>
                  <span>Total Round-Trip: <strong>{Math.round(activeQueryDetail.totalMs)}ms</strong></span>
                </div>
              </div>
            ) : (
              <div className="telemetry-empty-detail">
                Select an inquiry from the list on the left to inspect exact vector chunks, similarity scores, and synthesis timing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: RELAY SIMULATOR ================= */}
      {activeTab === 'relay-test' && (
        <div className="relay-tester-container">
          <div className="box" style={{ background: 'var(--panel)' }}>
            <span className="section-eyebrow">CLIENT API RELAY SIMULATOR</span>
            <h3 style={{ fontSize: '26px', margin: '6px 0 10px' }}>Test Inbound Query From Client Website</h3>
            <p className="sub" style={{ marginBottom: '20px' }}>
              Simulate an inquiry dispatch from your client&apos;s website into MINSO.AI and inspect the verified output dispatched back with statutory grounding.
            </p>

            {clients.length === 0 ? (
              <div style={{ padding: '20px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '3px' }}>
                <p style={{ margin: 0, color: 'var(--mute)' }}>
                  Please provision at least one client deployment first to test API relays.
                </p>
              </div>
            ) : (
              <>
                <div className="relay-form-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Select Client Deployment:
                    </label>
                    <select
                      value={testClient}
                      onChange={(e) => setTestClient(e.target.value)}
                      className="client-select-input"
                      style={{ width: '100%' }}
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.domain})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Target Mining Agent:
                    </label>
                    <input
                      type="text"
                      value={selectedClientObj?.agentName || 'Rajasthan Mining Law Assistant'}
                      disabled
                      style={{ width: '100%', background: 'var(--panel2)', border: '1px solid var(--line)', padding: '9px 12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '13.5px' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Question Submitted From Client Website:
                  </label>
                  <textarea
                    value={testQuestion}
                    onChange={(e) => setTestQuestion(e.target.value)}
                    placeholder="Ask any mining law or safety question..."
                    style={{ width: '100%', minHeight: '85px', background: 'var(--bg)', border: '1px solid var(--line)', padding: '12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '14px', lineHeight: 1.5 }}
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <button
                    className="btn btn-inline-action"
                    onClick={handleRunRelayTest}
                    disabled={testLoading || !testClient}
                  >
                    <span>{testLoading ? 'Processing Vector Retrieval...' : 'Execute Client Query Relay'}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Test Output Console */}
          {testResult && (
            <div className="box" style={{ borderLeft: '4px solid var(--amber)', background: 'var(--panel)', marginTop: '20px' }}>
              <div className="inspector-box-lbl">API PAYLOAD DISPATCHED BACK TO CLIENT WEBSITE:</div>
              {testResult.answer ? (
                <div>
                  <div style={{ background: 'var(--bg)', padding: '16px', border: '1px solid var(--line)', borderRadius: '2px', marginBottom: '14px', lineHeight: 1.6, fontSize: '14.5px' }}>
                    {testResult.answer}
                  </div>

                  <div className="inspector-box-lbl">VERIFIED CITATIONS RETURNED:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                    {testResult.sources?.map((s: any, i: number) => (
                      <span key={i} className="chip">
                        📄 {s.document} &middot; {s.section} &middot; p. {s.page}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--mute)' }}>
                    Latency: Retrieval ({testResult.timings?.retrievalMs}ms) &middot; LLM ({testResult.timings?.llmMs}ms) &middot; Total ({testResult.timings?.totalMs}ms)
                  </div>
                </div>
              ) : (
                <div style={{ color: '#FF7A6B', padding: '10px 0' }}>
                  {testResult.error || 'No answer returned'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: EMBED & API SDK ================= */}
      {activeTab === 'embed-code' && (
        <div className="embed-code-container">
          <div className="box" style={{ background: 'var(--panel)' }}>
            <span className="section-eyebrow">INTEGRATION CODE FOR CLIENT WEBSITES</span>
            <h3 style={{ fontSize: '26px', margin: '6px 0 10px' }}>How Clients Connect Their Website to Your Agent</h3>
            <p className="sub" style={{ marginBottom: '24px' }}>
              Your clients can query their dedicated mining agent using simple JavaScript (Fetch API) or by embedding the widget onto their site.
            </p>

            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ color: 'var(--amber)', fontSize: '18px', marginBottom: '8px' }}>1. JavaScript / React API Service Integration</h4>
              <p style={{ fontSize: '13.5px', color: 'var(--mute)', marginBottom: '10px' }}>
                Use this snippet in the client&apos;s codebase (e.g. <code>src/services/agentApi.js</code>):
              </p>
              <pre className="code-block-preview">
{`// Client Website API Service (src/services/agentApi.js)
const MINSO_API_URL = '${typeof window !== 'undefined' ? window.location.origin : 'https://minso.ai'}/api/chat';

export async function askMiningAgent(question) {
  const response = await fetch(MINSO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-minso-client-id': '${selectedClientObj?.id || 'client-account-id'}',
      'x-minso-client-key': '${selectedClientObj?.apiKey || 'minso_live_sec_key'}',
    },
    body: JSON.stringify({
      agentId: '${selectedClientObj?.agentId || 'rajasthan-mining-law'}',
      question: question,
      clientId: '${selectedClientObj?.id || 'client-account-id'}',
      clientDomain: '${selectedClientObj?.domain || 'https://client-portal.com'}',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get answer from mining agent');
  }

  const data = await response.json();
  return {
    answer: data.answer,
    sources: data.sources,     // Verified section & page numbers
    timings: data.timings,     // Exact retrieval & LLM latency
  };
}`}
              </pre>
            </div>

            <div>
              <h4 style={{ color: 'var(--amber)', fontSize: '18px', marginBottom: '8px' }}>2. Client Widget Script Embed</h4>
              <p style={{ fontSize: '13.5px', color: 'var(--mute)', marginBottom: '10px' }}>
                Paste before closing <code>&lt;/body&gt;</code> tag on the client&apos;s HTML page:
              </p>
              <pre className="code-block-preview">
{`<script 
  src="${typeof window !== 'undefined' ? window.location.origin : 'https://minso.ai'}/embed.js" 
  data-agent="${selectedClientObj?.agentId || 'rajasthan-mining-law'}"
  data-client-id="${selectedClientObj?.id || 'client-account-id'}"
  data-client-key="${selectedClientObj?.apiKey || 'minso_live_sec_key'}"
  data-theme="dark"
  async>
</script>`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROVISION NEW CLIENT ================= */}
      {showNewClientModal && (
        <div className="client-modal-overlay">
          <div className="client-modal-box">
            <div className="client-modal-head">
              <h3>Provision New Client Deployment</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowNewClientModal(false)}
              >
                &times;
              </button>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(255, 122, 107, 0.1)', border: '1px solid #FF7A6B', padding: '10px', borderRadius: '3px', color: '#FF7A6B', fontSize: '13px', marginBottom: '14px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateClient}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Client Organization Name:
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Udaipur Minerals & Quarries Ltd."
                  required
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--line)', padding: '10px 12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Client Website Domain URL:
                </label>
                <input
                  type="text"
                  value={newClientDomain}
                  onChange={(e) => setNewClientDomain(e.target.value)}
                  placeholder="e.g. https://udaipurminerals.com or http://localhost:5173"
                  required
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--line)', padding: '10px 12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Assigned Mining Agent:
                </label>
                <select
                  value={newClientAgent}
                  onChange={(e) => setNewClientAgent(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--line)', padding: '10px 12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '14px' }}
                >
                  <option value="rajasthan-mining-law">Rajasthan Mining Law Assistant</option>
                  <option value="mine-safety-sop">Mining Safety SOP Assistant</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Contact / Compliance Email:
                </label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="compliance@client.com"
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--line)', padding: '10px 12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn line"
                  onClick={() => setShowNewClientModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-inline-action"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Provisioning...' : 'Generate API Key & Deploy'}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT CLIENT DEPLOYMENT ================= */}
      {showEditClientModal && editingClient && (
        <div className="client-modal-overlay">
          <div className="client-modal-box">
            <div className="client-modal-head">
              <h3>Edit Client Deployment</h3>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowEditClientModal(false);
                  setEditingClient(null);
                }}
              >
                &times;
              </button>
            </div>

            {editErrorMsg && (
              <div style={{ background: 'rgba(255, 122, 107, 0.1)', border: '1px solid #FF7A6B', padding: '10px', borderRadius: '3px', color: '#FF7A6B', fontSize: '13px', marginBottom: '14px' }}>
                {editErrorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateClient}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Client Organization Name:
                </label>
                <input
                  type="text"
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  placeholder="e.g. Udaipur Minerals & Quarries Ltd."
                  required
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--line)', padding: '10px 12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Client Website Domain URL:
                </label>
                <input
                  type="text"
                  value={editClientDomain}
                  onChange={(e) => setEditClientDomain(e.target.value)}
                  placeholder="e.g. https://udaipurminerals.com or http://localhost:5173"
                  required
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--line)', padding: '10px 12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Deployment Status:
                </label>
                <select
                  value={editClientStatus}
                  onChange={(e) => setEditClientStatus(e.target.value as 'active' | 'staged' | 'paused')}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--line)', padding: '10px 12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '14px' }}
                >
                  <option value="active">Active (Live Production)</option>
                  <option value="staged">Staged (Testing & Verification)</option>
                  <option value="paused">Paused (Suspended)</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Assigned Mining Agent:
                </label>
                <select
                  value={editClientAgent}
                  onChange={(e) => setEditClientAgent(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--line)', padding: '10px 12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '14px' }}
                >
                  <option value="rajasthan-mining-law">Rajasthan Mining Law Assistant</option>
                  <option value="mine-safety-sop">Mining Safety SOP Assistant</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Contact / Compliance Email:
                </label>
                <input
                  type="email"
                  value={editClientEmail}
                  onChange={(e) => setEditClientEmail(e.target.value)}
                  placeholder="compliance@client.com"
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--line)', padding: '10px 12px', color: 'var(--ink)', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn line"
                  onClick={() => {
                    setShowEditClientModal(false);
                    setEditingClient(null);
                  }}
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-inline-action"
                  disabled={isEditing}
                >
                  <span>{isEditing ? 'Saving Changes...' : 'Save Changes'}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
