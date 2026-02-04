/**
 * מוחק מ-Cloudinary תמונות שלא שייכות לקטלוג תכשיטים (samples, דמו וכו').
 * קורא את backend/.env כמו בסקריפט הייצוא.
 *
 * שימוש:
 *   node scripts/cloudinary-delete-non-jewelry.mjs --dry-run   # רק להציג מה יימחק
 *   node scripts/cloudinary-delete-non-jewelry.mjs --yes       # למחוק בפועל
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

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
loadEnv(path.join(ROOT, 'backend', '.env'));
loadEnv(path.join(ROOT, '.env.local'));
loadEnv(path.join(ROOT, '.env'));
if (process.env.API_KEY && !process.env.CLOUDINARY_API_KEY) {
  process.env.CLOUDINARY_API_KEY = process.env.API_KEY;
}
if (!process.env.CLOUDINARY_URL && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  const c = process.env.CLOUDINARY_CLOUD_NAME || 'de937ijky';
  process.env.CLOUDINARY_URL = `cloudinary://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@${c}`;
}

const EXCLUDE_PREFIXES = ['samples/', 'demo/', 'test/'];
const EXCLUDE_IN_PUBLIC_ID = ['kitten', 'landscape', 'panorama', 'animals', 'landscapes', 'playing', 'leather', 'ocean', 'tropical'];

function isJewelryAsset(publicId) {
  const lower = publicId.toLowerCase();
  if (EXCLUDE_PREFIXES.some((p) => lower.startsWith(p))) return false;
  if (EXCLUDE_IN_PUBLIC_ID.some((w) => lower.includes(w))) return false;
  return true;
}

function config() {
  let cloud_name = process.env.CLOUDINARY_CLOUD_NAME || 'de937ijky';
  let api_key = process.env.CLOUDINARY_API_KEY;
  let api_secret = process.env.CLOUDINARY_API_SECRET;
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
    console.error('Missing Cloudinary credentials. Set in backend/.env');
    process.exit(1);
  }
  cloudinary.config({ cloud_name, api_key, api_secret });
}

async function listAll(prefix = '') {
  const list = [];
  let nextCursor = null;
  do {
    const opts = { type: 'upload', max_results: 500 };
    if (prefix) opts.prefix = prefix;
    if (nextCursor) opts.next_cursor = nextCursor;
    const result = await cloudinary.api.resources(opts);
    if (result.error) throw new Error(result.error.message);
    list.push(...(result.resources || []));
    nextCursor = result.next_cursor || null;
  } while (nextCursor);
  return list;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const yes = process.argv.includes('--yes');

  if (!dryRun && !yes) {
    console.log('הרץ עם --dry-run כדי לראות מה יימחק, או עם --yes כדי למחוק בפועל.');
    process.exit(1);
  }

  config();

  console.log(dryRun ? '--- dry-run: רשימת נכסים שיימחקו ---' : '--- מוחק נכסים לא רלוונטיים ---');
  const all = await listAll('');
  const toDelete = all.filter((r) => !isJewelryAsset(r.public_id));

  if (toDelete.length === 0) {
    console.log('אין נכסים למחוק.');
    return;
  }

  console.log(`נמצאו ${toDelete.length} נכסים למחוק:`);
  toDelete.forEach((r) => console.log('  ', r.public_id));

  if (dryRun) {
    console.log('\nלמחוק בפועל הרץ: node scripts/cloudinary-delete-non-jewelry.mjs --yes');
    return;
  }

  for (const r of toDelete) {
    try {
      await cloudinary.uploader.destroy(r.public_id, { resource_type: r.resource_type || 'image' });
      console.log('נמחק:', r.public_id);
    } catch (err) {
      console.error('שגיאה במחיקת', r.public_id, err.message);
    }
  }
  console.log('סיום.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
