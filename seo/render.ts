import { PROFILE } from '../src/content/profile';
import type { Paper, Project } from '../src/types/content';
import type { SiteData } from './data';

const SITE = PROFILE.site;
const PERSON_ID = `${SITE}/#person`;
const WEBSITE_ID = `${SITE}/#website`;
const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export interface Page {
  path: string;
  title: string;
  description: string;
  image: string;
  type: 'profile' | 'article';
  graph: object[];
  body: string;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ENTITIES[c]);
const abs = (path: string) => (/^https?:\/\//.test(path) ? path : SITE + path);
const workPath = (w: Project) => `/work/${w.slug}`;
const paperPath = (p: Paper) => `/paper/${p.slug}`;
const link = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;
const para = (text: string) => (text ? `<p>${esc(text)}</p>` : '');
const unique = (items: string[]) => [...new Set(items)];

function clip(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  return flat.slice(0, flat.lastIndexOf(' ', max - 1)).replace(/[,.;:\s]+$/, '') + '…';
}

export function summary(d: SiteData): string {
  const study = d.education.find((e) => /present/i.test(e.yr));
  const studying = study ? `, and is studying for a ${study.degree} at ${study.school}` : '';
  return (
    `${PROFILE.name} is a ${PROFILE.jobTitle.toLowerCase()} based in ${PROFILE.city}, ${PROFILE.country}. ` +
    `${PROFILE.name} works at the ${PROFILE.employer}${studying}. ` +
    `Focus areas are ${PROFILE.focus}, mostly with ${PROFILE.stack}. ` +
    `Open to ${PROFILE.openTo}.`
  );
}

function person(d: SiteData): object {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PROFILE.name,
    url: `${SITE}/`,
    image: abs(PROFILE.portrait),
    email: `mailto:${PROFILE.email}`,
    jobTitle: PROFILE.jobTitle,
    description: summary(d),
    worksFor: { '@type': 'Organization', name: PROFILE.employer },
    alumniOf: unique(d.education.map((e) => e.school)).map((name) => ({ '@type': 'CollegeOrUniversity', name })),
    address: { '@type': 'PostalAddress', addressLocality: PROFILE.city, addressCountry: PROFILE.countryCode },
    knowsLanguage: PROFILE.languages.map((l) => l.code),
    knowsAbout: unique(d.skills.map((s) => s.name)),
    award: d.recognition.map((a) => `${a.name}, ${a.where} (${a.yr})`),
    sameAs: PROFILE.links.map((l) => l.href),
  };
}

function breadcrumb(name: string, path: string): object {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: PROFILE.name, item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name, item: SITE + path },
    ],
  };
}

function contact(): string {
  const links = [
    `<a href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a>`,
    link(PROFILE.cv, 'CV (PDF)'),
    ...PROFILE.links.map((l) => link(l.href, l.label)),
  ];
  return `<p>${links.join(' · ')}</p>`;
}

function section(title: string, items: string[]): string {
  return items.length ? `<section><h2>${esc(title)}</h2><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></section>` : '';
}

export function homePage(d: SiteData): Page {
  const title = `${PROFILE.name} · Software Engineer`;
  const body = [
    `<main data-seed>`,
    `<header><h1>${esc(PROFILE.name)}</h1>`,
    para(`${PROFILE.jobTitle} · ${PROFILE.city}, ${PROFILE.country}`),
    para(summary(d)),
    contact(),
    `</header>`,
    section('Experience', d.experience.map((e) => `<h3>${esc(e.role)}</h3>${para(`${e.where} · ${e.yr}`)}${para(e.note)}`)),
    section('Projects', d.works.map((w) => `<h3>${link(workPath(w), w.name)}</h3>${para(w.brief)}${para(`${w.year} · ${w.role} · ${w.stack}`)}`)),
    section('Research', d.papers.map((p) => `<h3>${link(paperPath(p), p.title)}</h3>${para(`${p.authors.join(', ')} · ${p.year}`)}${para(p.summary)}`)),
    section('Education', d.education.map((e) => `<h3>${esc(e.degree)}</h3>${para(`${e.school} · ${e.yr}`)}${para(e.note)}`)),
    section('Recognition', d.recognition.map((a) => `<h3>${esc(a.name)}</h3>${para(`${a.where} · ${a.yr}`)}`)),
    section('Skills', d.skills.map((s) => `<strong>${esc(s.name)}</strong>: ${esc(s.opinion)}`)),
    `</main>`,
  ].join('');
  return {
    path: '/',
    title,
    description: clip(summary(d)),
    image: abs(PROFILE.portrait),
    type: 'profile',
    body,
    graph: [
      { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE}/`, name: PROFILE.name, inLanguage: 'en', publisher: { '@id': PERSON_ID } },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE}/#profile`,
        url: `${SITE}/`,
        name: title,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
        hasPart: [...d.works.map((w) => ({ '@id': `${SITE}${workPath(w)}#work` })), ...d.papers.map((p) => ({ '@id': `${SITE}${paperPath(p)}#paper` }))],
      },
      person(d),
    ],
  };
}

export function workPage(d: SiteData, w: Project): Page {
  const path = workPath(w);
  const facts: [string, string][] = [
    ['Year', w.year],
    ['Role', w.role],
    ['Stack', w.stack],
    ['Client', w.client],
    ['Result', w.result],
  ];
  const links = [w.live && link(w.live, 'Live site'), w.repo && link(w.repo, 'Source code')].filter(Boolean);
  const body = [
    `<main data-seed><article>`,
    `<p>${link('/', PROFILE.name)} / Projects</p>`,
    `<h1>${esc(w.name)}</h1>`,
    para(w.brief),
    `<dl>${facts.filter(([, v]) => v).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`,
    ...w.body.map(para),
    links.length ? `<p>${links.join(' · ')}</p>` : '',
    `</article>`,
    `<footer>${para(`Built by ${PROFILE.name}, ${PROFILE.jobTitle.toLowerCase()} in ${PROFILE.city}.`)}${contact()}</footer>`,
    `</main>`,
  ].join('');
  return {
    path,
    title: `${w.name} · ${PROFILE.name}`,
    description: clip(`${w.name}: ${w.brief} ${w.role}. Built with ${w.stack}.`),
    image: abs(w.cover ?? PROFILE.portrait),
    type: 'article',
    body,
    graph: [
      {
        '@type': w.repo ? 'SoftwareSourceCode' : 'CreativeWork',
        '@id': `${SITE}${path}#work`,
        name: w.name,
        headline: w.brief,
        description: w.desc,
        text: w.body.join('\n\n'),
        url: SITE + path,
        image: w.cover ? abs(w.cover) : undefined,
        keywords: w.stack.split('·').map((s) => s.trim()).filter(Boolean),
        codeRepository: w.repo,
        sameAs: w.live ? [w.live] : undefined,
        author: { '@id': PERSON_ID },
        isPartOf: { '@id': WEBSITE_ID },
      },
      breadcrumb(w.name, path),
      person(d),
    ],
  };
}

export function paperPage(d: SiteData, p: Paper): Page {
  const path = paperPath(p);
  const links = [p.url && link(p.url, 'Read the paper'), link(p.repo, 'Code')].filter(Boolean);
  const body = [
    `<main data-seed><article>`,
    `<p>${link('/', PROFILE.name)} / Research</p>`,
    `<h1>${esc(p.title)}</h1>`,
    para(`${p.authors.join(', ')} · ${p.year}`),
    para(p.summary),
    para(`Topics: ${p.tags.join(', ')}`),
    `<p>${links.join(' · ')}</p>`,
    `</article>`,
    `<footer>${contact()}</footer>`,
    `</main>`,
  ].join('');
  return {
    path,
    title: `${p.title} · ${PROFILE.name}`,
    description: clip(p.summary),
    image: abs(p.photos?.[0]?.src ?? PROFILE.portrait),
    type: 'article',
    body,
    graph: [
      {
        '@type': 'ScholarlyArticle',
        '@id': `${SITE}${path}#paper`,
        headline: p.title,
        name: p.title,
        abstract: p.summary,
        datePublished: p.year,
        keywords: p.tags,
        url: SITE + path,
        sameAs: p.url ? [p.url] : undefined,
        author: p.authors.map((name) => (name === PROFILE.name ? { '@id': PERSON_ID } : { '@type': 'Person', name })),
        isPartOf: { '@id': WEBSITE_ID },
      },
      breadcrumb(p.title, path),
      person(d),
    ],
  };
}

const META: [RegExp, (p: Page) => string][] = [
  [/<title>[^<]*<\/title>/, (p) => `<title>${esc(p.title)}</title>`],
  [/<meta name="description" content="[^"]*" \/>/, (p) => `<meta name="description" content="${esc(p.description)}" />`],
  [/<meta property="og:type" content="[^"]*" \/>/, (p) => `<meta property="og:type" content="${p.type}" />`],
  [/<meta property="og:title" content="[^"]*" \/>/, (p) => `<meta property="og:title" content="${esc(p.title)}" />`],
  [/<meta property="og:description" content="[^"]*" \/>/, (p) => `<meta property="og:description" content="${esc(p.description)}" />`],
  [/<meta name="twitter:title" content="[^"]*" \/>/, (p) => `<meta name="twitter:title" content="${esc(p.title)}" />`],
  [/<meta name="twitter:description" content="[^"]*" \/>/, (p) => `<meta name="twitter:description" content="${esc(p.description)}" />`],
  [/<div id="app"><\/div>/, (p) => `<div id="app">${p.body}</div>`],
];

export function renderHtml(template: string, page: Page): string {
  let html = template;
  for (const [pattern, make] of META) {
    if (!pattern.test(html)) throw new Error(`SEO prerender could not find ${pattern} in index.html`);
    html = html.replace(pattern, () => make(page));
  }
  const url = SITE + page.path;
  const graph = JSON.stringify({ '@context': 'https://schema.org', '@graph': page.graph }).replace(/</g, '\\u003c');
  const head = [
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(page.image)}" />`,
    `<meta name="twitter:image" content="${esc(page.image)}" />`,
    `<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />`,
    `<script type="application/ld+json">${graph}</script>`,
  ].join('\n');
  return html.replace('</head>', () => `${head}\n</head>`);
}

export function sitemap(pages: Page[]): string {
  const urls = pages.map((p) => `  <url><loc>${esc(SITE + p.path)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function llms(d: SiteData): string {
  return [
    `# ${PROFILE.name}`,
    '',
    `> ${summary(d)}`,
    '',
    `Contact: ${PROFILE.email}. Languages: ${PROFILE.languages.map((l) => l.label).join(', ')}. Time zone: ${PROFILE.timezone}.`,
    '',
    '## Projects',
    '',
    ...d.works.map((w) => `- [${w.name}](${SITE}${workPath(w)}): ${w.brief} Stack: ${w.stack}. ${w.year}.`),
    '',
    '## Research',
    '',
    ...d.papers.map((p) => `- [${p.title}](${SITE}${paperPath(p)}): ${p.authors.join(', ')}, ${p.year}.`),
    '',
    '## Experience',
    '',
    ...d.experience.map((e) => `- ${e.role}, ${e.where} (${e.yr})`),
    '',
    '## Links',
    '',
    `- [CV (PDF)](${SITE}${PROFILE.cv})`,
    ...PROFILE.links.map((l) => `- [${l.label}](${l.href})`),
    '',
    '## Optional',
    '',
    `- [Full profile as plain text](${SITE}/llms-full.txt): every project, role, paper and skill in one file`,
    '',
  ].join('\n');
}

export function llmsFull(d: SiteData): string {
  const out = [`# ${PROFILE.name}`, '', summary(d), '', `Contact: ${PROFILE.email}`, `CV: ${SITE}${PROFILE.cv}`, ...PROFILE.links.map((l) => `${l.label}: ${l.href}`), ''];
  out.push('## Experience', '');
  for (const e of d.experience) out.push(`### ${e.role}`, '', `${e.where}, ${e.yr}`, '', e.note, '');
  out.push('## Projects', '');
  for (const w of d.works) {
    out.push(`### ${w.name}`, '', `URL: ${SITE}${workPath(w)}`, `Year: ${w.year}`, `Role: ${w.role}`, `Stack: ${w.stack}`, `Client: ${w.client}`);
    if (w.result) out.push(`Result: ${w.result}`);
    if (w.live) out.push(`Live: ${w.live}`);
    if (w.repo) out.push(`Source: ${w.repo}`);
    out.push('', w.brief, '', ...w.body.flatMap((b) => [b, '']));
  }
  out.push('## Research', '');
  for (const p of d.papers) {
    out.push(`### ${p.title}`, '', `URL: ${SITE}${paperPath(p)}`, `Authors: ${p.authors.join(', ')}`, `Year: ${p.year}`);
    if (p.url) out.push(`Paper: ${p.url}`);
    out.push(`Code: ${p.repo}`, '', p.summary, '');
  }
  out.push('## Education', '');
  for (const e of d.education) out.push(`### ${e.degree}`, '', `${e.school}, ${e.yr}`, '', e.note, '');
  out.push('## Recognition', '');
  for (const a of d.recognition) out.push(`- ${a.name}, ${a.where} (${a.yr})`);
  out.push('', '## Skills', '');
  for (const s of d.skills) out.push(`- ${s.name}: ${s.opinion}`);
  out.push('');
  return out.join('\n');
}
