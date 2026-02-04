/**
 * Builds catalog (products + variants) from Cloudinary using the Admin API.
 * Naming convention: folder/productName.variant → one product, variant = color/metal.
 * Credentials from env: CLOUDINARY_URL (cloudinary://api_key:api_secret@cloud_name)
 */

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config from env (CLOUDINARY_URL or separate vars)
if (process.env.CLOUDINARY_URL) {
  // CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
  cloudinary.config();
} else if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'de937ijky',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'de937ijky';
const DELIVERY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/`;

const CATEGORIES = ['rings', 'necklaces', 'bracelets', 'earrings'];

/**
 * Parse public_id into product name and variant name.
 * Convention: "folder/productName.variant" or "folder/productName" (variant = default)
 */
function parsePublicId(publicId) {
  const slash = publicId.indexOf('/');
  const rest = slash >= 0 ? publicId.slice(slash + 1) : publicId;
  const dot = rest.lastIndexOf('.');
  if (dot <= 0) {
    return { productName: rest.trim(), variantName: 'default' };
  }
  const productName = rest.slice(0, dot).trim();
  const variantName = rest.slice(dot + 1).trim();
  return { productName, variantName: variantName || 'default' };
}

/**
 * Build delivery URL for an asset. Encode each path segment for Hebrew/special chars.
 */
function deliveryUrl(publicId) {
  const parts = publicId.split('/').map((p) => encodeURIComponent(p));
  return DELIVERY_BASE + parts.join('/');
}

/**
 * Fetch all resources for a given prefix (e.g. "rings/").
 */
async function listResourcesByPrefix(prefix) {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: prefix,
      max_results: 500,
    });
    return result.resources || [];
  } catch (err) {
    console.error(`Cloudinary list error for ${prefix}:`, err.message);
    return [];
  }
}

/**
 * Build catalog from Cloudinary: for each category folder, list assets,
 * group by product name, collect variants. Returns same shape as catalog.json.
 */
export async function buildCatalogFromCloudinary() {
  if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary not configured (CLOUDINARY_URL or CLOUDINARY_API_SECRET).');
    return { rings: [], necklaces: [], bracelets: [], earrings: [] };
  }

  const catalog = { rings: [], necklaces: [], bracelets: [], earrings: [] };
  const productMap = {}; // category -> { productName -> { id, name, variants[] } }

  for (const category of CATEGORIES) {
    productMap[category] = {};
    const prefix = category + '/';
    const resources = await listResourcesByPrefix(prefix);

    for (const r of resources) {
      const publicId = r.public_id;
      const { productName, variantName } = parsePublicId(publicId);
      if (!productName) continue;

      const map = productMap[category];
      if (!map[productName]) {
        map[productName] = { id: productName, name: productName, variants: [] };
      }
      map[productName].variants.push({
        name: variantName,
        image: deliveryUrl(publicId),
      });
    }

    catalog[category] = Object.values(productMap[category]);
  }

  return catalog;
}
