import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles, Gift, Heart, ShieldCheck } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import ProductCard from '../../components/customer/ProductCard';

export function RitualsPage() {
  const [selectedSubCat, setSelectedSubCat] = useState('All');

  const filterTabs = [
    'All',
    'Morning',
    'Night',
    'Glow',
    'Hair',
    'Body',
    'Complete Care',
    'Gift Sets',
  ];

  const ritualsProducts = useMemo(() => {
    const list = MOCK_PRODUCTS.filter((p) => p.category === 'rituals');
    if (selectedSubCat === 'All') return list;
    return list.filter((p) => p.subCategory === selectedSubCat);
  }, [selectedSubCat]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* Editorial Luxury Visual Banner matching Image 4 */}
      <section className="relative overflow-hidden border-b border-[#EBE7DF] bg-[#FBF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="rounded-2xl overflow-hidden shadow-card border border-sand/60 bg-white">
            <img
              src="/sections/rituals-reference.jpg"
              alt="GlowShine Co. Rituals and Sets Collection"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Content & Products Grid */}
      <div id="rituals-products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink">
              Rituals & Gift Sets
            </h2>
            <p className="text-xs sm:text-sm text-taupe mt-1">
              Thoughtfully paired formulation rituals and limited luxury gift collections.
            </p>
          </div>

          {/* Subcategory Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => {
              const isSelected = selectedSubCat === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedSubCat(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#7D6B5D] text-white shadow-xs'
                      : 'bg-white border border-[#E2DDD3] text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
          {ritualsProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RitualsPage;
