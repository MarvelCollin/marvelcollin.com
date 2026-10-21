import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { WORKS } from './works-data.mjs';

function loadEnv() {
  let raw = '';
  try { raw = readFileSync('.env', 'utf8'); } catch { return; }
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.error('Missing VITE_SUPABASE_URL in .env');
  process.exit(1);
}
const dryRun = process.argv.includes('--dry-run');

if (!service) {
  console.error('Need SUPABASE_SERVICE_ROLE_KEY in .env. Row level security rejects the anon key.');
  process.exit(1);
}

const supabase = createClient(url, service, { auth: { persistSession: false } });

const TABLE = 'portofolio_kolin_works';

const { data: existing, error: readError } = await supabase.from(TABLE).select('*');
if (readError) {
  console.error('Read failed:', readError.message);
  process.exit(1);
}

const bySlug = new Map(existing.map((row) => [row.slug, row]));
let nextNum = existing.reduce((max, row) => Math.max(max, Number(row.num) || 0), 0);

for (const work of WORKS) {
  const row = bySlug.get(work.slug);

  if (!row) {
    nextNum += 1;
    const insert = { ...work, num: String(nextNum).padStart(2, '0') };
    console.log(`insert ${insert.num} ${insert.slug}`);
    if (dryRun) continue;
    const { error } = await supabase.from(TABLE).insert(insert);
    if (error) console.error(`  failed: ${error.message}`);
    continue;
  }

  const patch = {};
  for (const [key, value] of Object.entries(work)) {
    if (key === 'slug') continue;
    const current = row[key];
    const empty = current === null || current === undefined || current === '' ||
      (Array.isArray(current) && current.length === 0);
    if (empty && value !== undefined) patch[key] = value;
  }

  if (!Object.keys(patch).length) {
    console.log(`skip ${row.num} ${row.slug}`);
    continue;
  }

  console.log(`update ${row.num} ${row.slug} -> ${Object.keys(patch).join(', ')}`);
  if (dryRun) continue;
  const { error } = await supabase.from(TABLE).update(patch).eq('id', row.id);
  if (error) console.error(`  failed: ${error.message}`);
}

console.log(dryRun ? 'dry run done' : 'done');
