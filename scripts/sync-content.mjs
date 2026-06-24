import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const source = join(root, 'mandarinka-content');
const publicDir = join(root, 'public');
const deckOut = join(root, 'src', 'data', 'deck.json');

function copyDir(name) {
  const from = join(source, name);
  const to = join(publicDir, name);
  if (!existsSync(from)) return;
  rmSync(to, { recursive: true, force: true });
  mkdirSync(publicDir, { recursive: true });
  cpSync(from, to, { recursive: true });
}

const raw = JSON.parse(readFileSync(join(source, 'deck.json'), 'utf8'));
const cards = raw.cards.map((card) => ({
  id: card.id,
  slug: card.slug,
  category: card.category,
  rarity: card.rarity,
  points: card.points,
  mode: card.mode,
  oneTake: card.oneTake ?? false,
  title: card.title,
  task: card.task,
  art: basename(card.artSvg ?? card.art),
}));

writeFileSync(
  deckOut,
  JSON.stringify(
    {
      name: raw.name,
      edition: raw.edition,
      version: raw.version,
      cards,
    },
    null,
    2,
  ) + '\n',
);

copyDir('art');
copyDir('icons');
copyDir('brand');

writeFileSync(
  join(publicDir, 'art', 'camera-frame.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <rect x="0" y="0" width="300" height="48" fill="rgba(35,49,75,0.82)"/>
  <rect x="0" y="352" width="300" height="48" fill="rgba(35,49,75,0.82)"/>
  <rect x="0" y="48" width="20" height="304" fill="rgba(35,49,75,0.55)"/>
  <rect x="280" y="48" width="20" height="304" fill="rgba(35,49,75,0.55)"/>
</svg>\n`,
);

console.log(`Synced ${cards.length} cards and assets from mandarinka-content`);
