import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Droplets,
  Leaf,
  ShieldCheck,
  Heart,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import ProductCard from '../../components/customer/ProductCard';

export function HomePage() {
  const bestsellers = MOCK_PRODUCTS.filter((p) => p.isBestseller).slice(0, 5);

  const categories = [
    {
      title: 'FACE',
      subtitle: 'Healthy Skin. Lasting Glow.',
      path: '/face',
      image: '/sections/crops/face-hero-banner.jpg',
      tag: '10 Formulations',
      desc: 'Cleansers, Serums, Moisturizers, Masks & Sunscreen',
    },
    {
      title: 'HAIR',
      subtitle: 'Healthier Hair. Brighter Days.',
      path: '/hair',
      image: '/sections/crops/hair-hero-banner.jpg',
      tag: '10 Formulations',
      desc: 'Shampoo, Conditioner, Masks, Oils & Scalp Care',
    },
    {
      title: 'BODY',
      subtitle: 'Soft Skin. Lasting Confidence.',
      path: '/body',
      image: '/sections/crops/body-hero-banner.jpg',
      tag: '10 Formulations',
      desc: 'Shower Gel, Body Butter, Scrubs & Hand Care',
    },
    {
      title: 'FRAGRANCE',
      subtitle: 'Capture / Express / Inspire',
      path: '/fragrance',
      image: '/products/frag-001-rose-body-mist.jpg',
      tag: 'Signature Scents',
      desc: 'Eau de Parfum, Body Mists & Roll-On Extraits',
    },
    {
      title: 'RITUALS & SETS',
      subtitle: 'Small Steps. Big Glow.',
      path: '/rituals',
      image: '/products/rit-006-skincare-set.jpg',
      tag: 'Curated Sets',
      desc: 'Morning, Night, Self Care & Gift Collections',
    },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-ink space-y-20 pb-28">
      {/* 1. Cinematic Luxury Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F3EC] via-[#FBF9F6] to-[#FAF8F5] border-b border-[#EBE7DF] pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2DDD3] text-stone-700 text-xs font-semibold uppercase tracking-wider shadow-2xs">
                <span>✦ Luxury Botanical Formulation</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-ink leading-[1.08] tracking-tight">
                Beauty, <br />
                <span className="italic font-normal">made personal.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed font-normal">
                Pure botanical formulations crafted with high-performance actives, synchronized with your skin’s natural rhythm for an enduring, healthy glow.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/face">
                  <button className="px-7 py-3 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium tracking-wide transition-all shadow-card flex items-center gap-2">
                    <span>Explore Face Care</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to="/rituals">
                  <button className="px-7 py-3 rounded-md border border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white text-xs sm:text-sm font-medium tracking-wide transition-all shadow-xs">
                    <span>Discover Rituals</span>
                  </button>
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 border-t border-[#EAE5DC] flex flex-wrap items-center gap-6 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-stone-800" />
                  <span>100% Pure Actives</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-stone-800" />
                  <span>Dermatologically Tested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-stone-800" />
                  <span>Clean Luxury</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Feature */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-card border border-[#E5E0D8] bg-white group">
                <img
                  src="/sections/crops/face-hero-banner.jpg"
                  alt="GlowShine Co. Signature Formulations"
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-sand-light">
                      Signature Release
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl mt-0.5">
                      Healthy Skin. Lasting Glow.
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The 5 Signature Worlds (Collections) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-stone-500">
            EXPLORE THE WORLDS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink">
            Crafted for Every Ritual
          </h2>
          <p className="text-sm text-stone-600">
            Immerse yourself in our five signature categories tailored for holistic self-care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.path}
              className="group relative bg-white border border-[#EAE5DC] rounded-xl overflow-hidden shadow-2xs hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-[#F7F4EF]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {cat.tag}
                </span>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-semibold text-ink group-hover:text-stone-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-600 italic">
                    {cat.subtitle}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-stone-900 group-hover:text-stone-700">
                  <span>Explore {cat.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Bestsellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-stone-500 block">
              PATRON FAVORITES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink mt-1">
              Iconic Bestsellers
            </h2>
          </div>
          <Link
            to="/face"
            className="text-xs uppercase tracking-widest font-semibold text-stone-800 hover:text-stone-600 inline-flex items-center gap-1.5"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
          {bestsellers.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 5}
            />
          ))}
        </div>
      </section>

      {/* 4. Editorial Ritual Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-[#E5E0D8] bg-white shadow-card">
          <Link to="/rituals">
            <img
              src="/sections/rituals-reference.jpg"
              alt="GlowShine Co. Rituals and Sets"
              className="w-full h-auto object-cover hover:opacity-98 transition-opacity"
            />
          </Link>
        </div>
      </section>

      {/* 5. Fragrance Signature Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-[#E5E0D8] bg-white shadow-card">
          <Link to="/fragrance">
            <img
              src="/sections/fragrance-reference.jpg"
              alt="GlowShine Co. Fragrance Collection"
              className="w-full h-auto object-cover hover:opacity-98 transition-opacity"
            />
          </Link>
        </div>
      </section>

      {/* 6. The GlowShine Standard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#F6F2EB] rounded-2xl border border-[#E6E1D7] p-8 sm:p-14">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-stone-500">
              OUR PROMISE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">
              The GlowShine Standard
            </h2>
            <p className="text-sm text-stone-600">
              Every formulation is meticulously balanced for potency, efficacy, and pure sensory joy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-2 p-4 bg-white/70 rounded-xl border border-sand/40">
              <div className="text-2xl">🌿</div>
              <h4 className="font-semibold text-sm text-ink">Active Botanicals</h4>
              <p className="text-xs text-stone-600">
                Cold-pressed plant lipids and bio-fermented actives with zero filler oils.
              </p>
            </div>
            <div className="space-y-2 p-4 bg-white/70 rounded-xl border border-sand/40">
              <div className="text-2xl">🔬</div>
              <h4 className="font-semibold text-sm text-ink">Clinically Validated</h4>
              <p className="text-xs text-stone-600">
                Rigorous dermatological testing on diverse skin and hair barrier types.
              </p>
            </div>
            <div className="space-y-2 p-4 bg-white/70 rounded-xl border border-sand/40">
              <div className="text-2xl">✨</div>
              <h4 className="font-semibold text-sm text-ink">Sensory Perfection</h4>
              <p className="text-xs text-stone-600">
                Weightless textures and mood-elevating natural fragrance profiles.
              </p>
            </div>
            <div className="space-y-2 p-4 bg-white/70 rounded-xl border border-sand/40">
              <div className="text-2xl">♻️</div>
              <h4 className="font-semibold text-sm text-ink">Sustainable Luxury</h4>
              <p className="text-xs text-stone-600">
                Recyclable flint glass, FSC-certified paper, and ethically harvested ingredients.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
