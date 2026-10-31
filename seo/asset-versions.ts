import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

const ID = 'virtual:asset-versions';
const RESOLVED = '\0' + ID;
const DIRS = ['shots', 'certs', 'logos', 'me', 'cv'];

type Sizes = Record<string, { base: string; widths: number[] }>;

function hash(files: string[]): string {
  const h = createHash('sha1');
  for (const file of files) if (existsSync(file)) h.update(readFileSync(file));
  return h.digest('hex').slice(0, 8);
}

// One short content hash per public file. A resized image shares one hash
// built from its source and every variant, so any change gives a new URL.
function versions(root: string): Record<string, string> {
  const pub = join(root, 'public');
  const sizes = JSON.parse(readFileSync(join(root, 'src/assets/image-sizes.json'), 'utf8')) as Sizes;
  const out: Record<string, string> = {};
  for (const dir of DIRS) {
    if (!existsSync(join(pub, dir))) continue;
    for (const file of readdirSync(join(pub, dir))) {
      const url = `/${dir}/${file}`;
      const size = sizes[url];
      const variants = size ? size.widths.map((w) => join(pub, `${size.base}-${w}.webp`)) : [];
      out[url] = hash([join(pub, url), ...variants]);
    }
  }
  return out;
}

export function assetVersions(): Plugin {
  let root = process.cwd();
  return {
    name: 'asset-versions',
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      return id === ID ? RESOLVED : undefined;
    },
    load(id) {
      return id === RESOLVED ? `export default ${JSON.stringify(versions(root))};` : undefined;
    },
  };
}
