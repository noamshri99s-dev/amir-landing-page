/**
 * Cloudinary Admin API – export jewelry catalog only (necklaces, rings).
 * Fetches all assets from jewelry folders, groups by product + variant, writes public/jewelry-catalog.json.
 * Run server-side or locally; never expose API_SECRET in the browser.
 *
 * Usage (from project root amir-landing-ju):
 *   node scripts/cloudinary-export-jewelry.mjs
 * Put CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env.local (do not commit).
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load env from backend/.env or .env.local or .env (first found)
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) {
      const val = m[2].replace(/^["']|["']$/g, '').replace(/\r$/, '').trim();
      process.env[m[1]] = val;
    }
  }
}
const backendEnv = path.join(ROOT, 'backend', '.env');
loadEnv(backendEnv);
loadEnv(path.join(ROOT, '.env.local'));
loadEnv(path.join(ROOT, '.env'));

// backend/.env may use API_KEY instead of CLOUDINARY_API_KEY
if (process.env.API_KEY && !process.env.CLOUDINARY_API_KEY) {
  process.env.CLOUDINARY_API_KEY = process.env.API_KEY;
}
if (!process.env.CLOUDINARY_URL && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  const c = process.env.CLOUDINARY_CLOUD_NAME || 'de937ijky';
  process.env.CLOUDINARY_URL = `cloudinary://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@${c}`;
}

const OUT_PATH = path.join(ROOT, 'public', 'jewelry-catalog.json');

// If your Cloudinary assets are in folders, use ['necklaces', 'rings'].
// If assets are at root (no folder in public_id), script lists all and infers category from product name.
const FOLDERS = ['necklaces', 'rings'];
const ROOT_CATEGORY = 'rings';

// Exclude from catalog: assets that are clearly not jewelry (samples, demos, etc.)
const EXCLUDE_PREFIXES = ['samples/', 'demo/', 'test/'];
const EXCLUDE_IN_PUBLIC_ID = ['kitten', 'landscape', 'panorama', 'animals', 'landscapes', 'playing', 'leather', 'ocean', 'tropical'];

function isJewelryAsset(publicId) {
  const lower = publicId.toLowerCase();
  if (EXCLUDE_PREFIXES.some((p) => lower.startsWith(p))) return false;
  if (EXCLUDE_IN_PUBLIC_ID.some((w) => lower.includes(w))) return false;
  return true;
}

// When assets are at root: productKey containing one of these → necklaces, else → rings
const NECKLACE_KEYWORDS = ['שרשרת', 'מחרוזת', 'ענק', 'צוואר', 'necklace'];

function inferCategoryFromProductKey(productKey) {
  const key = productKey.replace(/_/g, ' ');
  for (const word of NECKLACE_KEYWORDS) {
    if (key.includes(word)) return 'necklaces';
  }
  return 'rings';
}

const VARIANT_TOKENS = ['כסף', 'זהב', 'אדום', 'רוז', 'silver', 'gold', 'rose'];

function config() {
  let cloud_name = process.env.CLOUDINARY_CLOUD_NAME || 'de937ijky';
  let api_key = process.env.CLOUDINARY_API_KEY;
  let api_secret = process.env.CLOUDINARY_API_SECRET;

  // Parse CLOUDINARY_URL if set: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  const url = process.env.CLOUDINARY_URL;
  if (url) {
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (m) {
      api_key = m[1];
      api_secret = m[2];
      cloud_name = m[3].trim();
    }
  }

  if (!api_key || !api_secret) {
    console.error('Missing Cloudinary credentials. In backend/.env use CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@de937ijky');
    process.exit(1);
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
  return cloud_name;
}

/**
 * Remove Cloudinary-style uniqueness suffix from a segment (e.g. "כסף_e4s2zv" -> "כסף").
 */
function removeSuffix(segment) {
  return segment.replace(/_[a-z0-9]+$/i, '');
}

/**
 * Detect variant key from the last part of public_id (after last dot), or "default".
 */
function detectVariantKey(lastSegment) {
  const cleaned = removeSuffix(lastSegment);
  const lower = cleaned.toLowerCase();
  for (const token of VARIANT_TOKENS) {
    if (lower === token.toLowerCase() || cleaned === token) return token;
  }
  return 'default';
}

/**
 * Parse public_id into productKey and variantKey.
 * Example: "rings/טבעת_השלמה_טבעת_משובצת_אבנים.כסף_e4s2zv"
 *   -> category from folder, productKey = "טבעת_השלמה_טבעת_משובצת_אבנים", variantKey = "כסף"
 */
function parsePublicId(publicId, folder) {
  const withoutFolder = publicId.startsWith(folder + '/') ? publicId.slice(folder.length + 1) : publicId;
  const lastDot = withoutFolder.lastIndexOf('.');
  let productKey;
  let variantKey;

  if (lastDot <= 0) {
    productKey = removeSuffix(withoutFolder);
    variantKey = 'default';
  } else {
    const beforeDot = withoutFolder.slice(0, lastDot);
    const afterDot = withoutFolder.slice(lastDot + 1);
    productKey = removeSuffix(beforeDot);
    variantKey = detectVariantKey(afterDot);
  }

  return { productKey: productKey || 'unknown', variantKey };
}

/**
 * List all resources under a prefix with pagination.
 */
async function listAllByPrefix(prefix) {
  const list = [];
  let nextCursor = null;

  do {
    const opts = {
      type: 'upload',
      prefix,
      max_results: 500,
    };
    if (nextCursor) opts.next_cursor = nextCursor;

    const result = await cloudinary.api.resources(opts).catch((err) => {
      throw new Error(`Cloudinary API error: ${err.message || err}`);
    });
    if (result.error) {
      throw new Error(`Cloudinary API: ${result.error.message || JSON.stringify(result.error)}`);
    }
    const resources = result.resources || [];
    list.push(...resources);
    nextCursor = result.next_cursor || null;
  } while (nextCursor);

  return list;
}

async function main() {
  config();

  const products = {};

  let didRootFallback = false;
  for (const folder of FOLDERS) {
    const prefix = folder ? folder + '/' : '';
    const label = folder || '(root)';
    console.log(`Fetching ${label}...`);
    let resources = await listAllByPrefix(prefix);
    if (resources.length === 0 && FOLDERS.length > 0 && FOLDERS.every((f) => f)) {
      // Folders like necklaces/ and rings/ returned 0 – try listing from root (no prefix)
      const rootList = await listAllByPrefix('');
      if (rootList.length > 0 && !didRootFallback) {
        didRootFallback = true;
        resources = rootList;
        console.log(`  Using ${resources.length} assets from root (no folder in public_id)`);
      }
    }
    if (resources.length === 0 && !didRootFallback) {
      console.log(`  ${resources.length} assets`);
    } else if (resources.length > 0 && !didRootFallback) {
      console.log(`  ${resources.length} assets`);
    }

    for (const r of resources) {
      const publicId = r.public_id;
      const secure_url = r.secure_url;
      if (!secure_url) continue;
      if (!isJewelryAsset(publicId)) continue;

      const folderForParse = folder || ROOT_CATEGORY;
      const { productKey, variantKey } = parsePublicId(publicId, folderForParse);
      const category =
        resources.length > 0 && didRootFallback
          ? inferCategoryFromProductKey(productKey)
          : (folder || ROOT_CATEGORY);

      if (!products[productKey]) {
        products[productKey] = {
          category,
          displayName: undefined,
          variants: {},
        };
      }
      products[productKey].variants[variantKey] = secure_url;
    }
    if (didRootFallback) break; // only process once when using root fallback
  }

  const catalog = { products };
  const dir = path.dirname(OUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('Error:', err.message || err);
  if (err.response) console.error('Response:', err.response.body || err.response);
  process.exit(1);
});
