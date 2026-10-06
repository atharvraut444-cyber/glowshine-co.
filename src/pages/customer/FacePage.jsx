import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import ProductCard from '../../components/customer/ProductCard';

export function FacePage() {
  const [selectedSubCat, setSelectedSubCat] = useState('All');

  const filterTabs = [
    'All',
    'Cleansers',
    'Serums',
    'Moisturizers',
    'Masks',
    'Eye Care',
    'Sunscreen',
  ];

  const faceProducts = useMemo(() => {
    const list = MOCK_PRODUCTS.filter((p) => p.category === 'face');
    if (selectedSubCat === 'All') return list;
    return list.filter((p) => p.subCategory === selectedSubCat);
  }, [selectedSubCat]);

  const scrollToProducts = () => {
    const el = document.getElementById('face-products-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden border-b border-[#EBE7DF] bg-[#F7F3EC]">
        {/* Banner image representation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-left">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-stone-600 block">
                SKIN CARE
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink leading-[1.15] font-normal">
                Healthy Skin. <br />
                <span className="italic font-normal">Lasting Glow.</span>
              </h1>
              <p className="text-sm sm:text-base text-stone-600 max-w-md leading-relaxed">
                Discover skincare that understands your skin. Gentle, effective and made for your natural glow.
              </p>
              <div>
                <button
                  onClick={scrollToProducts}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-stone-800 text-stone-900 text-xs sm:text-sm font-medium hover:bg-stone-900 hover:text-white transition-all shadow-xs"
                >
                  <span>EXPLORE ALL FACE PRODUCTS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Formulation Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-subtle border border-sand/60 bg-white/40 max-h-[380px]">
                <img
                  src="/sections/crops/face-hero-banner.jpg"
                  alt="GlowShine Face Formulations"
                  className="w-full h-auto object-cover max-h-[380px]"
                />
              </div>
            </div>

            {/* Right Trust Indicators */}
            <div className="lg:col-span-2 flex flex-row lg:flex-col justify-around lg:justify-center gap-6 text-left border-t lg:border-t-0 lg:border-l border-sand/70 pt-6 lg:pt-0 lg:pl-8">
              <div className="space-y-1">
                <div className="text-stone-800 text-base">✦</div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-800">
                  Pure Ingredients
                </h4>
              </div>
              <div className="space-y-1">
                <div className="text-stone-800 text-base">🍃</div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-800">
                  Dermatologically Tested
                </h4>
              </div>
              <div className="space-y-1">
                <div className="text-stone-800 text-base">♡</div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-800">
                  For All Skin Types
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Products Grid */}
      <div id="face-products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Subcategory Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
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

        {/* 5-Column Responsive Product Grid matching reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
          {faceProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 5}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FacePage;
