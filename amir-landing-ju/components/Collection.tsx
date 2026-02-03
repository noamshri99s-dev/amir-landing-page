
import { memo } from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    title: 'טבעת Eternity',
    price: '₪12,500',
    description: 'יהלומי קולקציה בליטוש עגול, משובצים בזהב לבן 18K בעיצוב נקי ועל-זמני.',
    image: '/images/product-1.png',
    category: 'Fine Rings',
    link: '/rings'
  },
  {
    id: 2,
    title: 'שרשרת Stellar',
    price: '₪8,900',
    description: 'תליון יהלום מרכזי בעיצוב הילה, המעניק נוכחות יוקרתית ונוצצת לכל הופעה.',
    image: '/images/product-2.png',
    category: 'Necklaces',
    link: '/necklaces'
  },
  {
    id: 3,
    title: 'צמיד Classic',
    price: '₪24,000',
    description: 'צמיד טניס אייקוני עם רצף יהלומים אחידים באיכות גבוהה ביותר.',
    image: '/images/product-3.png',
    category: 'Bracelets',
    link: '/bracelets'
  },
  {
    id: 4,
    title: 'עגילי Pearl',
    price: '₪5,200',
    description: 'שילוב מנצח של פניני מים מתוקים נבחרות ויהלומי קולקציה עדינים.',
    image: '/images/product-4.png',
    category: 'Earrings',
    link: '/earrings'
  }
];

const Collection = memo(function Collection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-24 md:gap-y-48">
      {products.map((product, idx) => (
        <Link 
          key={product.id} 
          to={product.link}
          className={`group cursor-pointer block ${idx % 2 !== 0 ? 'md:mt-48' : ''}`}
        >
          <div className="img-reveal relative overflow-hidden aspect-[4/5] mb-8 md:mb-12 bg-[#E8E0D5] rounded-sm shadow-soft-xl product-glow group-hover:product-glow transition-all duration-700">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      loading="eager"
                      decoding="async"
                      width="400"
                      height="500"
                      className="w-full h-full object-cover grayscale-0 transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-[#4a5c52] text-sm">תמונה לא זמינה</div>';
                        }
                      }}
                    />
          </div>
          <div className="reveal px-2 md:px-0">
            <div className="flex justify-between items-baseline mb-4">
              <h3 className="text-3xl md:text-4xl font-serif leading-tight text-[#16382b] group-hover:text-[#1f4a3a] transition-colors">{product.title}</h3>
              <p className="text-[#4a5c52] font-light text-xs tracking-widest group-hover:text-[#16382b] transition-colors">{product.price}</p>
            </div>
            <p className="text-[#4a5c52] text-sm font-light leading-relaxed max-w-sm mb-6">
              {product.description}
            </p>
            <div className="w-8 h-px bg-[#4a5c52]/30 group-hover:w-20 group-hover:bg-[#16382b] transition-all duration-700"></div>
          </div>
        </Link>
      ))}
    </div>
  );
});

export default Collection;
