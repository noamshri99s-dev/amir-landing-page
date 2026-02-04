import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { CatalogProduct } from '@/lib/catalog';
import { cloudinaryUrl } from '@/lib/cloudinary';

interface CatalogCarouselProps {
  products: CatalogProduct[];
  productLabel?: string; // e.g. "טבעת" for display name
}

const CatalogCarousel: React.FC<CatalogCarouselProps> = ({ products, productLabel }) => {
  const [productIndex, setProductIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);

  const product = products[productIndex];
  const variant = product?.variants[variantIndex];
  const hasMultipleProducts = products.length > 1;
  const hasMultipleVariants = (product?.variants.length ?? 0) > 1;

  const goPrev = useCallback(() => {
    setProductIndex((i) => (i <= 0 ? products.length - 1 : i - 1));
    setVariantIndex(0);
  }, [products.length]);

  const goNext = useCallback(() => {
    setProductIndex((i) => (i >= products.length - 1 ? 0 : i + 1));
    setVariantIndex(0);
  }, [products.length]);

  if (!product || !variant) {
    return (
      <div className="py-20 text-center text-[#4a5c52]">
        אין פריטים בקטלוג כרגע. הוסף תמונות לתיקיית הסוג המתאימה והרץ <code className="bg-[#16382b]/10 px-2 py-1 rounded">npm run catalog:build</code>.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main image + product name */}
      <div className="relative aspect-[4/5] bg-[#E8E0D5] rounded-sm shadow-soft-xl product-glow overflow-hidden mb-8">
        <img
          src={cloudinaryUrl(variant.image)}
          alt={`${product.name} - ${variant.name}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-[#4a5c52] text-sm">תמונה לא זמינה</div>';
            }
          }}
        />
        {/* Arrows - product carousel */}
        {hasMultipleProducts && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#16382b]/80 text-[#e0d7d3] flex items-center justify-center hover:bg-[#16382b] transition-all z-10"
              aria-label="פריט קודם"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#16382b]/80 text-[#e0d7d3] flex items-center justify-center hover:bg-[#16382b] transition-all z-10"
              aria-label="פריט הבא"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Product title */}
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-serif text-[#16382b]">
          {productLabel ? `${productLabel} ${product.name}` : product.name}
        </h3>
        {hasMultipleVariants && (
          <p className="text-sm text-[#4a5c52] mt-1">גרסה: {variant.name}</p>
        )}
      </div>

      {/* Variant selector (dots or thumbnails) */}
      {hasMultipleVariants && (
        <div className="flex flex-wrap justify-center gap-2">
          {product.variants.map((v, i) => (
            <button
              key={v.image}
              type="button"
              onClick={() => setVariantIndex(i)}
              className={`
                w-14 h-14 rounded-lg overflow-hidden border-2 transition-all
                ${i === variantIndex ? 'border-[#16382b] ring-2 ring-[#16382b]/30' : 'border-[#4a5c52]/30 hover:border-[#16382b]/50'}
              `}
              aria-label={`גרסה ${v.name}`}
              aria-pressed={i === variantIndex}
            >
              <img src={cloudinaryUrl(v.image)} alt={v.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Product counter */}
      {hasMultipleProducts && (
        <p className="text-center text-[10px] uppercase tracking-widest text-[#4a5c52] mt-6">
          {productIndex + 1} / {products.length}
        </p>
      )}
    </div>
  );
};

export default CatalogCarousel;
