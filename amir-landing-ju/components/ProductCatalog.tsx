import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getCatalog, getCategoryProducts, type CatalogCategory, type CatalogProduct } from '@/lib/catalog';

interface ProductCatalogProps {
  category: CatalogCategory;
  productLabel?: string;
  title?: string;
  subtitle?: string;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  category, 
  productLabel,
  title,
  subtitle 
}) => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCatalog()
      .then((catalog) => {
        setProducts(getCategoryProducts(catalog, category));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-[#E8E0D5] rounded-lg mb-4"></div>
              <div className="h-4 bg-[#E8E0D5] rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-[#E8E0D5] rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-[#4a5c52]">
        <p className="mb-4">אין פריטים בקטלוג כרגע.</p>
        <p className="text-sm">
          הוסף תמונות לתיקייה <code className="bg-[#16382b]/10 px-2 py-1 rounded">public/images/{category}</code> והרץ{' '}
          <code className="bg-[#16382b]/10 px-2 py-1 rounded">npm run catalog:build</code>
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-16">
      {/* Section header */}
      {(title || subtitle) && (
        <div className="text-center mb-8 md:mb-12">
          {subtitle && (
            <span className="text-[10px] uppercase tracking-[0.6em] text-[#4a5c52] mb-4 block font-medium">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="text-3xl md:text-5xl font-serif text-[#16382b]">{title}</h2>
          )}
        </div>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            productLabel={productLabel}
          />
        ))}
      </div>

      {/* Product count */}
      <p className="text-center text-[10px] uppercase tracking-widest text-[#4a5c52] mt-8 md:mt-12">
        {products.length} פריטים בקטלוג
      </p>
    </div>
  );
};

export default ProductCatalog;
