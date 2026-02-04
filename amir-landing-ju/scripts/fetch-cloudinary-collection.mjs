/**
 * Fetches images from Cloudinary collection and updates catalog.json
 * to use Cloudinary URLs instead of local paths.
 * 
 * Cloudinary collection: https://collection.cloudinary.com/de937ijky/a59a02c5b0b131008ec67374f6bacca5
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'public', 'data');
const CATALOG_PATH = path.join(DATA_DIR, 'catalog.json');

const CLOUDINARY_CLOUD_NAME = 'de937ijky';
const CLOUDINARY_COLLECTION_ID = 'a59a02c5b0b131008ec67374f6bacca5';

/**
 * Convert local image path to Cloudinary URL
 * Format: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}
 * 
 * Cloudinary public_id should match the filename structure in the collection
 * Note: Cloudinary URLs need proper encoding for Hebrew characters
 */
function getCloudinaryUrl(localPath) {
  // Extract the filename from local path (e.g., "/images/rings/טבעת טיפות.זהב.PNG")
  const filename = localPath.split('/').pop();
  
  // Determine folder/category
  const folder = localPath.includes('/rings/') ? 'rings' : 
                 localPath.includes('/necklaces/') ? 'necklaces' :
                 localPath.includes('/bracelets/') ? 'bracelets' :
                 localPath.includes('/earrings/') ? 'earrings' : '';
  
  // Remove extension for public_id (Cloudinary handles format automatically)
  const publicId = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  
  // Cloudinary URL format: https://res.cloudinary.com/{cloud}/image/upload/{folder}/{public_id}
  // We need to encode each part separately, keeping slashes
  // Encode folder and public_id separately, then join with /
  const encodedFolder = encodeURIComponent(folder);
  const encodedPublicId = encodeURIComponent(publicId);
  
  // Construct Cloudinary URL - Cloudinary handles Hebrew in public_id
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${encodedFolder}/${encodedPublicId}`;
}

/**
 * Update catalog.json to use Cloudinary URLs
 */
function updateCatalogToCloudinary() {
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error('Catalog file not found. Run npm run catalog:build first.');
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  
  // Update all image paths to Cloudinary URLs
  for (const category in catalog) {
    if (Array.isArray(catalog[category])) {
      catalog[category].forEach(product => {
        if (product.variants && Array.isArray(product.variants)) {
          product.variants.forEach(variant => {
            if (variant.image && variant.image.startsWith('/images/')) {
              variant.image = getCloudinaryUrl(variant.image);
            }
          });
        }
      });
    }
  }

  // Write updated catalog
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
  console.log('✅ Catalog updated to use Cloudinary URLs');
  console.log(`📦 Cloudinary cloud: ${CLOUDINARY_CLOUD_NAME}`);
  console.log(`📁 Collection ID: ${CLOUDINARY_COLLECTION_ID}`);
}

updateCatalogToCloudinary();
