const token = process.env.VERCEL_TOKEN;
const team = process.env.VERCEL_TEAM_ID;
const keepCount = Number(process.env.KEEP ?? 2);

if (!token || !team) throw new Error('VERCEL_TOKEN and VERCEL_TEAM_ID are required');

const api = async (path, method = 'GET') => {
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`https://api.vercel.com${path}${sep}teamId=${team}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`${method} ${path} failed with ${res.status}: ${await res.text()}`);
  return res.json();
};

const { projects } = await api('/v9/projects?limit=100');

for (const project of projects) {
  const { deployments } = await api(`/v6/deployments?projectId=${project.id}&limit=100`);
  const { targets } = await api(`/v9/projects/${project.id}`);
  const live = targets?.production?.id;
  if (!live) {
    console.log(`${project.name}: no live deployment, skipped`);
    continue;
  }

  const ready = deployments.filter((d) => d.state === 'READY').sort((a, b) => b.created - a.created);
  const keep = new Set([live, ...ready.slice(0, keepCount).map((d) => d.uid)]);
  const busy = new Set(['BUILDING', 'QUEUED', 'INITIALIZING']);
  const stale = deployments.filter((d) => !keep.has(d.uid) && !busy.has(d.state));

  for (const d of stale) await api(`/v13/deployments/${d.uid}`, 'DELETE');
  console.log(`${project.name}: kept ${keep.size}, deleted ${stale.length}`);
}
