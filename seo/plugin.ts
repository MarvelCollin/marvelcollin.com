import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { loadEnv, type Logger, type Plugin } from 'vite';
import { loadSiteData } from './data';
import { homePage, llms, llmsFull, paperPage, renderHtml, sitemap, workPage } from './render';

async function emit(file: string, content: string): Promise<void> {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}

export function seo(): Plugin {
  let outDir = 'dist';
  let logger: Logger | undefined;
  return {
    name: 'seo-prerender',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
      logger = config.logger;
      const env = loadEnv(config.mode, config.root, 'VITE_SUPABASE_');
      for (const [key, value] of Object.entries(env)) process.env[key] ??= value;
    },
    async writeBundle() {
      const data = await loadSiteData();
      const template = await readFile(join(outDir, 'index.html'), 'utf8');
      const pages = [homePage(data), ...data.works.map((w) => workPage(data, w)), ...data.papers.map((p) => paperPage(data, p))];
      await Promise.all([
        ...pages.map((p) => emit(join(outDir, p.path, 'index.html'), renderHtml(template, p))),
        emit(join(outDir, 'sitemap.xml'), sitemap(pages)),
        emit(join(outDir, 'llms.txt'), llms(data)),
        emit(join(outDir, 'llms-full.txt'), llmsFull(data)),
      ]);
      logger?.info(`seo: prerendered ${pages.length} pages, sitemap.xml, llms.txt, llms-full.txt`);
    },
  };
}
