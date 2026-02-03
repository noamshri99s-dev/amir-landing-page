/**
 * Builds public/data/catalog.json by scanning public/images/{category}
 * and grouping images by product name.
 *
 * Convention: filename = productName.variant (with or without .png/.jpg)
 * - "אובל עם 2 אבני טיפות בצדדים.זהב" or "אובל עם 2 אבני טיפות בצדדים.זהב.png" → product + variant "זהב"
 * - "אובל עם 2 אבני טיפות בצדדים" → product only, variant "default"
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const DATA_DIR = path.join(ROOT, 'public', 'data');
const CATALOG_PATH = path.join(DATA_DIR, 'catalog.json');

const CATEGORIES = ['rings', 'bracelets', 'earrings', 'necklaces'];
const IMAGE_EXT = /\.(png|jpg|jpeg|webp)$/i;

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => {
    if (f === '.gitkeep' || f === '.DS_Store') return false;
    const stat = fs.statSync(path.join(dir, f));
    if (!stat.isFile()) return false;
    return IMAGE_EXT.test(f) || f.includes('.');
  });
}

function buildCategoryCatalog(category) {
  const dir = path.join(IMAGES_DIR, category);
  const files = listImages(dir);
  const byProduct = new Map(); // productKey -> { id, name, variants: [{ name, image }] }

  for (const file of files) {
    const ext = path.extname(file);
    const hasImageExt = IMAGE_EXT.test(ext);
    const base = hasImageExt ? path.basename(file, ext) : path.basename(file);
    const imageUrl = `/images/${category}/${file}`;
    // Last dot in base = separator between product name and variant (e.g. "אובל עם 2 אבני טיפות בצדדים.זהב")
    const lastDot = base.lastIndexOf('.');
    const productKey = lastDot >= 0 ? base.slice(0, lastDot) : base;
    const variantName = lastDot >= 0 ? base.slice(lastDot + 1) : 'default';

    if (!byProduct.has(productKey)) {
      byProduct.set(productKey, {
        id: productKey,
        name: productKey,
        variants: [],
      });
    }
    byProduct.get(productKey).variants.push({ name: variantName, image: imageUrl });
  }

  return Array.from(byProduct.values());
}

function main() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const catalog = {};
  for (const cat of CATEGORIES) {
    catalog[cat] = buildCategoryCatalog(cat);
  }
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
  console.log('Catalog written to public/data/catalog.json');
}

main();
