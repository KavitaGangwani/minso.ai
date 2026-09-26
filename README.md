<div align="center">

# ⛏️ MINSO.AI
### *Enterprise Mining Intelligence & Statutory Grounding Engine*

[![Next.js](https://img.shields.io/badge/Next.js-14.2_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector_384d-336791?style=for-the-badge&logo=postgresql)](https://github.com/pgvector/pgvector)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![LLM](https://img.shields.io/badge/LLM-Gemini_2.5_Flash-orange?style=for-the-badge&logo=google)](https://openrouter.ai/)
[![Live Deployment](https://img.shields.io/badge/Live_App-minso.ai-success?style=for-the-badge&logo=vercel)](https://minso.ai)

<p align="center">
  <b>Eliminating Hallucinations in High-Stakes Mining Law, DGMS Safety SOPs & Regulatory Concessions.</b>
</p>

<p align="center">
  🌐 <b>Production App:</b> <a href="https://minso.ai">https://minso.ai</a> &nbsp;|&nbsp; 📡 <b>Live RAG API:</b> <code>https://minso.ai/api/chat</code>
</p>

[Live Deployment](#-live-deployment--production-endpoints) • [Explore User Portal](#-public-user-portal) • [Hidden Admin Gateway](#-the-discreet-lock-icon-hidden-admin-gateway) • [Admin Modules](#-complete-admin-control-center-modules) • [API & SDK](#-client-integration-sdk--embeds)

---

</div>

## 📑 Table of Contents

- [🌐 Live Deployment & Production Endpoints](#-live-deployment--production-endpoints)
- [🏛️ Executive Architecture Overview](#️-executive-architecture-overview)
- [🌐 Public User Portal](#-public-user-portal)
- [🔐 The Discreet Lock Icon (Hidden Admin Gateway)](#-the-discreet-lock-icon-hidden-admin-gateway)
- [🎛️ Complete Admin Control Center Modules](#️-complete-admin-control-center-modules)
  - [1. Executive System Dashboard (`/admin`)](#1-executive-system-dashboard-admin)
  - [2. Agents Registry & Vector Hyperparameters (`/admin/agents`)](#2-agents-registry--vector-hyperparameters-adminagents)
  - [3. Knowledge Ingestion & Document Pipeline (`/admin/documents`)](#3-knowledge-ingestion--document-pipeline-admindocuments)
  - [4. Client Deployments, SDK & Chunk Inspector (`/admin/clients`)](#4-client-deployments-sdk--chunk-inspector-adminclients)
  - [5. Real-Time Question Audit Logs (`/admin/questions`)](#5-real-time-question-audit-logs-adminquestions)
  - [6. Global Analytics & Size Distribution (`/admin/analytics`)](#6-global-analytics--size-distribution-adminanalytics)
- [🔬 RAG Pipeline & Vector Grounding Architecture](#-rag-pipeline--vector-grounding-architecture)
- [🔌 API Endpoints Reference](#-api-endpoints-reference)
- [📦 Client Integration SDK & Embeds](#-client-integration-sdk--embeds)
- [⚙️ Environment Configuration & Schema](#️-environment-configuration--schema)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)

---

## 🌐 Live Deployment & Production Endpoints

| Resource | URL | Purpose / Usage |
| :--- | :--- | :--- |
| **Production Website** | [https://minso.ai](https://minso.ai) | Public platform, Statutory Grounding Simulator & Chat Assistants |
| **Administrative Console** | [https://minso.ai/admin](https://minso.ai/admin) | Secret portal accessible via footer lock `[ 🔒 ]` with Passcode |
| **Inference Chat API** | `https://minso.ai/api/chat` | External REST endpoint for custom client integrations & webhooks |
| **Embeddable Web Widget** | `https://minso.ai/embed.js` | Drop-in JavaScript widget for enterprise client websites |
| **GitHub Repository** | [github.com/KavitaGangwani/minso.ai](https://github.com/KavitaGangwani/minso.ai) | Official open-source repository |

---

## 🏛️ Executive Architecture Overview

MINSO.AI solves the critical trust challenge in the extractive resources sector. Legal acts (such as the *Mines and Minerals (Development and Regulation) Act 1957*, *Rajasthan Minor Mineral Concession Rules 2017*, and *DGMS Metalliferous Mines Regulations*) require exact clause adherence. 

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              MINSO.AI PLATFORM                               │
├──────────────────────────────────────┬───────────────────────────────────────┤
│          PUBLIC USER PORTAL          │         ADMIN SYSTEM CONSOLE          │
│  • Regulatory Grounding Simulator    │  • Vector Hyperparameter Tuning       │
│  • Interactive Mining Agents         │  • Multi-Tenant Client Deployments    │
│  • Live Statutory Citation Chips     │  • Deep pgvector Chunk Inspector      │
│  • Low-Latency Grounded Chat Stream  │  • Strict Origin Query Telemetry      │
└──────────────────────────────────────┴───────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    HIGH-PRECISION HYBRID VECTOR RAG ENGINE                   │
│   [384-Dim E5 Embeddings] ──► [HNSW Cosine pgvector] ──► [Strict Citations]  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Public User Portal

| Route | View | Description | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `/` | **Landing Page** | High-impact industrial dark UI with pit-mine strata graphics | Interactive Statutory Grounding Simulator, Live Grounding Badge |
| `/agents` | **Agent Directory** | Public index of available specialized mining assistants | Category tags, Agent status, Capabilities overview |
| `/agents/[id]` | **Grounded Chat** | Real-time conversational interface | Streaming queries, Suggested legal prompts, Citation chips |

### Grounded Answer Verification Chips
Every synthesized answer generates verified source chips:
```
📄 Rajasthan Minor Mineral Concession Rules, 2017 · Rule 14(2) · p. 24
📄 MMDR Act, 1957 · Section 21(1) & 21(4) · p. 18
```

---

## 🔐 The Discreet Lock Icon (Hidden Admin Gateway)

To preserve a clean public-facing interface while allowing authorized operators instant system access, a discreet lock symbol (`🔒`) is positioned in the global footer:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ MINSO.AI · Built for a smarter, safer, more efficient mining industry.   [🔒]│
└──────────────────────────────────────────────────────────────────────────────┘
                                                                             │
                                              Clicking the lock triggers ────┘
                                                             │
                                                             ▼
                                                ┌─────────────────────────┐
                                                │  /admin Authentication  │
                                                │  & Full Control Center  │
                                                └─────────────────────────┘
```

- **File Implementation**: [`components/SiteFooter.tsx`](file:///e:/minso.ai/components/SiteFooter.tsx)
- **Target URL**: `/admin`
- **Security Interceptor**: When unauthenticated, the system loads the administrative sign-in portal. Once authenticated, operators access the complete suite of system controls.

---

## 🎛️ Complete Admin Control Center Modules

```
ADMIN ROOT (/admin)
 ├── 📊 System Dashboard Overview (/admin)
 ├── 🤖 Agents Management & Hyperparameter Studio (/admin/agents)
 │    ├── ➕ Provision New Agent (/admin/agents/new)
 │    └── ⚙️ Deep Agent Editor & Chunk Tuning (/admin/agents/[id])
 ├── 📄 Knowledge Base & Ingestion Pipeline (/admin/documents)
 ├── 🏢 Client Deployments, API Keys & Chunk Inspector (/admin/clients)
 ├── 📜 Question Audit Logs (/admin/questions)
 └── 📈 Global Analytics & Size Distribution (/admin/analytics)
```

---

### 1. Executive System Dashboard (`/admin`)

- **Top KPI Telemetry**: Total platform queries, published agents, active document sources, and verified statutory citation success rate.
- **Quick Action Station**: One-click actions to provision client API keys, upload regulatory PDFs, deploy new specialized agents, or inspect vector latencies.

---

### 2. Agents Registry & Vector Hyperparameters (`/admin/agents`)

Enables administrators to create, tune, and maintain domain-specific assistants (e.g. *Rajasthan Mining Law Assistant*, *Mine Safety SOP Assistant*).

#### RAG Hyperparameter Studio (`/admin/agents/[id]`)

| Hyperparameter | Default | Permitted Range | Architectural Impact |
| :--- | :---: | :---: | :--- |
| **`Chunk Size`** | `800 chars` | `300 – 1500 chars` | Balances granularity vs. contextual semantic breadth |
| **`Chunk Overlap`** | `100 chars` | `0 – 300 chars` | Prevents statutory clauses from being cut at chunk boundaries |
| **`Top-K Chunks`** | `6 chunks` | `1 – 12 chunks` | Maximum candidate vector chunks provided to LLM synthesis |
| **`Min Score Threshold`** | `0.50` | `0.10 – 0.95` | Strictness cutoff for pgvector cosine similarity |

---

### 3. Knowledge Ingestion & Document Pipeline (`/admin/documents`)

Automated document processing and pgvector indexing engine:

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Source Media   │ ──► │  Text Extractor  │ ──► │ Semantic Chunking│ ──► │ 384-Dim Vector DB│
│ (PDF / URL / Raw)│     │ & Clause Parser  │     │ (Custom Overlap) │     │ (Postgres HNSW)  │
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
```

- **PDF Ingestion**: Preserves statutory section titles, clause hierarchies, and exact original page numbering.
- **Web URL Scraping**: Live crawler and text extraction for government gazettes and ministry portals.
- **Raw Text Input**: Fast manual paste for immediate circular and executive memo indexing.

---

### 4. Client Deployments, SDK & Chunk Inspector (`/admin/clients`)

Multi-tenant management for licensing and distributing MINSO.AI agents to mining companies, consultancies, and field portals.

#### Tab 1: Client Deployments & API Key Management
- Provision client accounts with custom organization names, domain whitelists, assigned agents, and contact emails.
- Auto-generates cryptographically secure API keys (`minso_live_...`).
- Deployment lifecycle controls: `Live on Client Portal`, `Staged`, or `Paused`.

#### Tab 2: Query & Chunk Inspector (Deep Live Audit)
- **Strict Query Origin Separation**: Cleanly separates queries from **`🌐 Main Website`** vs **`🏢 Client Deployments`**.
- **Real-Time Feed & Live Polling**: Automatic background synchronization (every 5 seconds) with manual refresh triggers.
- **pgvector Retrieval Audit**:
  - Exact similarity match percentages (`94% Match`, `88% Match`, etc.).
  - Document name, statutory section, and page number.
  - **Show Full Raw Chunk Text** toggle to view the un-truncated vector block indexed in PostgreSQL.
  - Latency profiling: Vector Retrieval Latency vs LLM Synthesis Latency vs Total Round-Trip.

#### Tab 3: Client API Relay Simulator
- Test queries simulating an inbound request from any registered client website.
- Live inspection of return payload, verified citations, and execution latency.

#### Tab 4: Client Integration SDK & Embed Code
- Copy-paste JavaScript/React integration service and `<script>` embed widget tags.

---

### 5. Real-Time Question Audit Logs (`/admin/questions`)

A continuous chronological audit trail of inquiries asked across all agents:
- Status indicators: `✓ Grounded with Citations` vs `Ungrounded / Fallback Reply`.
- Detailed breakdown: Question text, generated response, citation count, and latency metrics.

---

### 6. Global Analytics & Size Distribution (`/admin/analytics`)

#### Chunk Size Distribution Breakdown
Tracks semantic chunking quality across the entire vector index:

| Category | Character Range | Target Status | System Role |
| :--- | :---: | :---: | :--- |
| **Small** | `< 300 chars` | Acceptable for titles & short definitions | Headings, sub-rules |
| **Medium** | `300 – 700 chars` | Good concise context | Single statutory clauses |
| **Optimal** | `700 – 1000 chars` | ⭐ Recommended Sweet Spot | Complete legal sections with sub-rules |
| **Large** | `> 1000 chars` | Monitored | Multi-paragraph legal schedules |

---

## 🔬 RAG Pipeline & Vector Grounding Architecture

```
                                [ User Question ]
                                        │
                                        ▼
                      [ Xenova Multilingual E5 Embeddings ]
                                        │
                                        ▼
                   [ PostgreSQL pgvector match_chunks RPC ]
                      (Cosine Similarity >= min_score)
                                        │
               ┌────────────────────────┴────────────────────────┐
               ▼                                                 ▼
      [ Relevant Chunks Found ]                       [ 0 Chunks Found ]
               │                                                 │
               ▼                                                 ▼
     [ Slice Top-K Chunks ]                          [ Query Expansion Rewrite ]
   [ Attach Clause & Page Metadata ]                             │
               │                                                 ▼
               ▼                                     [ Re-search pgvector ]
  [ Construct Grounding Prompt ]                                 │
  (Strict bracketed source rules)                                ▼
               │                                   ┌─────────────┴─────────────┐
               ▼                                   ▼                           ▼
  [ LLM Synthesis (Gemini 2.5) ]           [ Chunks Found ]            [ Still 0 Chunks ]
               │                                   │                           │
               ▼                                   ▼                           ▼
   [ Verified Response Stream ]          [ Normal LLM Flow ]       ["I could not find this
  [ Display Citation Chips & Log ]                                   in my documents."]
```

---

## 🔌 API Endpoints Reference

| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/chat` | `POST` | Optional Key / Header | Primary RAG inference endpoint for web and client embeds |
| `/api/clients` | `GET` | Admin Session | Fetch client deployments or query records (`?type=queries`) |
| `/api/clients` | `POST` | Admin Session | Provision a new client deployment and generate API key |
| `/api/clients` | `PATCH` | Admin Session | Update client settings, domain whitelist, or status |
| `/api/clients` | `DELETE` | Admin Session | Revoke API key and remove client deployment |
| `/api/admin/process` | `POST` | Admin Session | Trigger background document processing & vector embedding |

---

## 📦 Client Integration SDK & Embeds

### 1. JavaScript / React Service (`src/services/minsoAgent.js`)

```javascript
const MINSO_API_URL = 'https://minso.ai/api/chat';

export async function askMiningAgent(question) {
  const response = await fetch(MINSO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-minso-client-id': 'client-rajasthan-mine-corp',
      'x-minso-client-key': 'minso_live_sec_key_xyz123',
    },
    body: JSON.stringify({
      agentId: 'rajasthan-mining-law',
      question: question,
      clientId: 'client-rajasthan-mine-corp',
      clientDomain: 'https://client-portal.com',
    }),
  });

  if (!response.ok) throw new Error('Mining agent query failed');

  const data = await response.json();
  return {
    answer: data.answer,       // Grounded answer text
    sources: data.sources,     // Verified section & page numbers
    timings: data.timings,     // Latency telemetry
  };
}
```

### 2. Embeddable HTML Widget Tag

```html
<script 
  src="https://minso.ai/embed.js" 
  data-agent="rajasthan-mining-law"
  data-client-id="client-rajasthan-mine-corp"
  data-client-key="minso_live_sec_key_xyz123"
  defer>
</script>
```

---

## ⚙️ Environment Configuration & Schema

Create a `.env.local` file in your root workspace:

```env
# Supabase & PostgreSQL Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenRouter LLM Gateway
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key-here

# Administrative Security Passcode
ADMIN_SECRET_KEY=your-secure-admin-passcode
```

---

## 🚀 Quick Start & Local Setup

### 1. Clone & Install
```bash
git clone https://github.com/KavitaGangwani/minso.ai.git
cd minso.ai
npm install
```

### 2. Database Setup
Execute the complete migration script in your Supabase SQL Editor:
```bash
# Script location:
./supabase/migration.sql
```

### 3. Launch Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

- Click on the **`🔒`** lock icon in the footer to access `/admin`.
- Enter your `ADMIN_SECRET_KEY` to unlock the administrative console.

---

<div align="center">

**MINSO.AI** · Built for precision, statutory compliance, and safety across the mining sector.

</div>
