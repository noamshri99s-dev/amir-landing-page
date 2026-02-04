import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { CatalogProduct } from '@/lib/catalog';
import { cloudinaryUrl } from '@/lib/cloudinary';

interface ProductCardProps {
  product: CatalogProduct;
  productLabel?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, productLabel }) => {
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex];
  const hasMultipleVariants = product.variants.length > 1;

  const goPrevVariant = () => {
    setVariantIndex((i) => (i <= 0 ? product.variants.length - 1 : i - 1));
  };

  const goNextVariant = () => {
    setVariantIndex((i) => (i >= product.variants.length - 1 ? 0 : i + 1));
  };

  if (!variant) return null;

  return (
    <div className="group">
      {/* Image container with variant carousel */}
      <div className="relative aspect-[4/5] bg-[#E8E0D5] rounded-lg shadow-soft-xl overflow-hidden mb-4">
        <img
          src={cloudinaryUrl(variant.image)}
          alt={`${product.name} - ${variant.name}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.error-msg')) {
              const errorDiv = document.createElement('div');
              errorDiv.className = 'error-msg w-full h-full flex items-center justify-center text-[#4a5c52] text-sm';
              errorDiv.textContent = 'תמונה לא זמינה';
              parent.appendChild(errorDiv);
            }
          }}
        />
        
        {/* Variant navigation arrows */}
        {hasMultipleVariants && (
          <>
            <button
              type="button"
              onClick={goPrevVariant}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#16382b]/70 text-[#e0d7d3] flex items-center justify-center hover:bg-[#16382b] transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="וריאציה קודמת"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              type="button"
              onClick={goNextVariant}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#16382b]/70 text-[#e0d7d3] flex items-center justify-center hover:bg-[#16382b] transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="וריאציה הבאה"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </>
        )}

        {/* Variant indicator dots */}
        {hasMultipleVariants && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {product.variants.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setVariantIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === variantIndex 
                    ? 'bg-[#16382b] w-4' 
                    : 'bg-[#16382b]/40 hover:bg-[#16382b]/60'
                }`}
                aria-label={`וריאציה ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="text-center px-2">
        <h3 className="text-lg md:text-xl font-serif text-[#16382b] mb-1 leading-tight">
          {productLabel && !product.name.startsWith(productLabel.trim())
            ? `${productLabel} ${product.name}`
            : product.name}
        </h3>
        {hasMultipleVariants && (
          <p className="text-xs text-[#4a5c52]">{variant.name}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
