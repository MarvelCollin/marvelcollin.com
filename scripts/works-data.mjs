export const WORKS = [
  {
    slug: 'overleaf-claude-mcp',
    name: 'Overleaf Claude MCP',
    year: '2026',
    role: 'Developer',
    stack: 'TypeScript · Node · MCP · Playwright',
    client: 'Personal',
    tag: 'personal',
    description: 'an MCP server that lets Claude read, edit and compile Overleaf projects',
    brief: 'Claude edits your LaTeX paper on the Overleaf free tier.',
    body: [
      'Overleaf keeps the Git bridge and Dropbox sync behind Premium, so the free tier has no public API. This server speaks the same internal HTTP and socket endpoints the Overleaf web app uses, authenticated with a browser session cookie you paste once.',
      'Twenty eight tools cover the whole loop: list and select a project, read the LaTeX and the figures, grep across files, write and edit, upload, rename, move, compile server side, read the parsed error log with file and line, and pull the PDF back.',
      'It also runs prose through free AI content detectors and checks it for plagiarism, reporting which sentence, in which file, on which line was flagged.',
      'MIT licensed, Node 20 or newer, with CI on every push and a release workflow that publishes to npm on tag.',
    ],
    result: '28 tools',
    tone: 'navy',
    stills: ['Repository', 'Tool surface', 'CI runs'],
    cover: '/shots/overleaf-claude-mcp-1.webp',
    images: [
      '/shots/overleaf-claude-mcp-1.webp',
      '/shots/overleaf-claude-mcp-2.webp',
      '/shots/overleaf-claude-mcp-3.webp',
    ],
    repo: 'https://github.com/MarvelCollin/overleaf-claude-mcp',
  },
  {
    slug: 'kolinrelics',
    cover: '/shots/kolinrelics-1.webp',
    images: ['/shots/kolinrelics-1.webp'],
    repo: 'https://github.com/MarvelCollin/KolinRelics',
  },
  {
    slug: 'misvord',
    repo: 'https://github.com/MarvelCollin/MisVord',
  },
  {
    slug: 'pomolab',
    repo: 'https://github.com/MarvelCollin/Pomolab',
  },
  {
    slug: 'constellation',
    repo: 'https://github.com/MarvelCollin/Constellation',
  },
  {
    slug: 'quizlingo',
    repo: 'https://github.com/MarvelCollin/QuizLingo',
  },
  {
    slug: 'livora',
    repo: 'https://github.com/MarvelCollin/Livora',
  },
  {
    slug: 'devora',
    repo: 'https://github.com/MarvelCollin/Devora',
  },
  {
    slug: 'claudecron',
    cover: '/shots/claudecron-1.webp',
    images: ['/shots/claudecron-1.webp'],
    repo: 'https://github.com/MarvelCollin/ClaudeCron',
  },
  {
    slug: 'knowledge-distillation',
    cover: 'https://raw.githubusercontent.com/MarvelCollin/knowledge-distillation-quantization/main/figures/fig1_methods_ceiling.png',
    images: [
      'https://raw.githubusercontent.com/MarvelCollin/knowledge-distillation-quantization/main/figures/fig1_methods_ceiling.png',
      'https://raw.githubusercontent.com/MarvelCollin/knowledge-distillation-quantization/main/figures/fig2_gap_study.png',
      'https://raw.githubusercontent.com/MarvelCollin/knowledge-distillation-quantization/main/figures/fig3_quantization.png',
      'https://raw.githubusercontent.com/MarvelCollin/knowledge-distillation-quantization/main/figures/fig4_int4_failure_mode.png',
      'https://raw.githubusercontent.com/MarvelCollin/knowledge-distillation-quantization/main/figures/fig5_failure_mixture.png',
    ],
    repo: 'https://github.com/MarvelCollin/knowledge-distillation-quantization',
  },
];
