import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

// Automatically load .env.local and .env files
loadEnvConfig(process.cwd());

const supabaseUrl = (process.env.SUPABASE_URL || '').trim().replace(/^['"]|['"]$/g, '');
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim().replace(/^['"]|['"]$/g, '');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Seed initial agents
const seedAgents = [
  {
    id: 'rajasthan-mining-law',
    name: 'Rajasthan Mining Law Assistant',
    description: 'Ask about mining acts, rules and lease procedures.',
    tags: ['Law', 'Rajasthan'],
    instructions:
      "Answer only from the provided sources. Cite the section and page. If unsure, say you don't know.",
    published: true,
    created_at: new Date().toISOString(),
    chunk_size: 800,
    chunk_overlap: 100,
    top_k: 6,
    min_score: 0.50,
  },
  {
    id: 'mine-safety-sop',
    name: 'Mine Safety SOP Assistant',
    description: 'Step-by-step safety procedures for workers.',
    tags: ['Safety', 'SOP'],
    instructions:
      'Answer only from approved SOPs. Be brief and list steps in order.',
    published: false,
    created_at: new Date().toISOString(),
    chunk_size: 800,
    chunk_overlap: 100,
    top_k: 6,
    min_score: 0.50,
  },
];

async function seed() {
  console.log('Seeding Supabase agents table...');

  for (const agent of seedAgents) {
    const { data: existing } = await supabase
      .from('agents')
      .select('id')
      .eq('id', agent.id)
      .maybeSingle();

    if (existing) {
      console.log(`- Agent "${agent.id}" already exists, skipping.`);
    } else {
      const { error } = await supabase.from('agents').insert(agent);
      if (error) {
        console.error(`Failed to insert agent ${agent.id}:`, error);
      } else {
        console.log(`+ Seeded agent "${agent.id}".`);
      }
    }
  }

  console.log('Supabase seeding complete!');
}

seed().catch(console.error);
