import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles, Droplets, Heart } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import ProductCard from '../../components/customer/ProductCard';

export function FragrancePage() {
  const [selectedSubCat, setSelectedSubCat] = useState('All');

  const filterTabs = [
    'All',
    'Eau de Parfum',
    'Body Mists',
    'Roll-On Fragrance',
    'Fragrance Sets',
  ];

  const fragranceProducts = useMemo(() => {
    const list = MOCK_PRODUCTS.filter((p) => p.category === 'fragrance');
    if (selectedSubCat === 'All') return list;
    return list.filter((p) => p.subCategory === selectedSubCat);
  }, [selectedSubCat]);

  const fragranceShowcase = [
    {
      name: 'ROSE',
      type: 'Body Mist',
      tags: ['Romantic', 'Floral', 'Fresh'],
      image: '/products/frag-001-rose-body-mist.jpg',
      id: 'frag-001',
    },
    {
      name: 'VANILLA',
      type: 'Body Mist',
      tags: ['Warm', 'Sweet', 'Comforting'],
      image: '/products/frag-002-vanilla-body-mist.jpg',
      id: 'frag-002',
    },
    {
      name: 'JASMINE',
      type: 'Body Mist',
      tags: ['Elegant', 'Floral', 'Fresh'],
      image: '/products/frag-003-jasmine-body-mist.jpg',
      id: 'frag-003',
    },
    {
      name: 'CITRUS',
      type: 'Body Mist',
      tags: ['Zesty', 'Fresh', 'Uplifting'],
      image: '/products/frag-004-citrus-body-mist.jpg',
      id: 'frag-004',
    },
    {
      name: 'NOIR',
      type: 'Eau de Parfum',
      tags: ['Bold', 'Classy', 'Mysterious'],
      image: '/products/frag-005-noir-eau-de-parfum.jpg',
      id: 'frag-005',
    },
    {
      name: 'AURA',
      type: 'Eau de Parfum',
      tags: ['Feminine', 'Graceful', 'Alluring'],
      image: '/products/frag-006-aura-eau-de-parfum.jpg',
      id: 'frag-006',
    },
  ];

  const scrollToProducts = () => {
    const el = document.getElementById('fragrance-products-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* Editorial Luxury Visual Banner matching Image 5 */}
      <section className="relative overflow-hidden border-b border-[#EBE7DF] bg-[#FBF9F6]">
        {/* Full Visual Reference Graphic */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="rounded-2xl overflow-hidden shadow-card border border-sand/60 bg-white">
            <img
              src="/sections/fragrance-reference.jpg"
              alt="GlowShine Co. Fragrance Collection"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Content & Products Grid */}
      <div id="fragrance-products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink">
              Signature Scents
            </h2>
            <p className="text-xs sm:text-sm text-taupe mt-1">
              Pure botanical extraits, uplifting body mists and artisanal discovery sets.
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
          {fragranceProducts.map((product, idx) => (
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

export default FragrancePage;
