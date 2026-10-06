import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Droplets, Leaf, Activity, Check } from 'lucide-react';
import { productService } from '../../services/products/productService';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import ProductCard from '../../components/customer/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import { Button } from '../../components/common/Button';

export function HomePage() {
  const { user, profile } = useAuth();
  const [trendingProducts, setTrendingProducts] = useState(() =>
    MOCK_PRODUCTS.filter((p) => p.isBestseller).slice(0, 4)
  );
  const [personalizedProducts, setPersonalizedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const [trending, matches] = await Promise.all([
        productService.getTrending(4, profile?.beautyProfile),
        profile?.beautyProfile
          ? productService.getPersonalizedMatches(profile.beautyProfile, 4)
          : Promise.resolve([]),
      ]);
      if (isMounted) {
        setTrendingProducts(trending);
        if (matches.length > 0) {
          setPersonalizedProducts(matches);
        }
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [profile?.beautyProfile]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-ivory to-ivory border-b border-sand pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Narrative */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-rose-light border border-rose-subtle text-rose-clay text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Behavioral Retail Intelligence</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-ink leading-[1.08] tracking-tight">
                Beauty, <br />
                <span className="italic font-normal">but personal.</span>
              </h1>

              <p className="text-base sm:text-lg text-taupe max-w-xl leading-relaxed font-normal">
                Intelligent botanical formulations designed to learn and synchronize with your skin’s changing moisture barrier and environmental stress.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/shop">
                  <Button variant="primary" size="lg" className="px-8 shadow-card">
                    <span>Explore Formulations</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link to="/quiz">
                  <Button variant="secondary" size="lg" className="border-sand hover:border-ink">
                    <span>Take Skin Diagnostic</span>
                    <Sparkles className="w-4 h-4 text-rose-clay" />
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-sand/60 grid grid-cols-3 gap-4 max-w-lg text-xs text-taupe">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-clay shrink-0" />
                  <span>Exact-Amount UPI QR</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-rose-clay shrink-0" />
                  <span>Clinical Bio-Actives</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-clay shrink-0" />
                  <span>Adaptive Scoring</span>
                </div>
              </div>
            </div>

            {/* Right Hero Imagery Grid */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="surface-card rounded-2xl overflow-hidden p-2 shadow-elevated">
                  <img
                    src="/products/hero-formulation.jpg"
                    alt="Ceramide Dew Barrier Repair Moisturizer"
                    fetchpriority="high"
                    decoding="async"
                    width="448"
                    height="560"
                    className="w-full aspect-[4/5] object-cover rounded-xl"
                  />
                  <div className="p-4 bg-white/95 backdrop-blur-sm rounded-lg mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-taupe font-semibold">Featured Formulation</p>
                      <h3 className="font-display text-base text-ink font-normal">Ceramide Dew Barrier Repair</h3>
                    </div>
                    <span className="text-sm font-semibold text-rose-clay">₹1,299</span>
                  </div>
                </div>

                {/* Floating GlowMatch Badge Card */}
                <div className="absolute -bottom-5 -left-4 sm:-left-8 bg-white border border-sand shadow-modal rounded-card p-4 max-w-[220px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-ink">GlowMatch™</p>
                  </div>
                  <p className="text-2xl font-bold text-ink">96%</p>
                  <p className="text-[11px] text-taupe mt-0.5">High compatibility with barrier repair profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized GlowMatch Section (if profile exists) */}
      {profile?.beautyProfile && personalizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-sand rounded-2xl p-6 sm:p-10 shadow-subtle space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-rose-clay font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated for {profile.name || user?.displayName || 'You'}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-ink font-normal">
                  Your High-Affinity Formulations
                </h2>
                <p className="text-xs sm:text-sm text-taupe mt-1 max-w-xl">
                  Ranked by compatibility with your <span className="text-ink font-medium">{profile.beautyProfile.skinType}</span> skin and <span className="text-ink font-medium">{profile.beautyProfile.primaryConcern?.replace('_', ' ')}</span> focus.
                </p>
              </div>
              <Link to="/glowmatch" className="text-xs uppercase tracking-widest font-semibold text-ink hover:text-rose-clay flex items-center gap-1">
                <span>View Full Match Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {personalizedProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 4} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Discovery Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest text-taupe font-semibold">Formulation Categories</span>
          <h2 className="font-display text-2xl sm:text-3xl text-ink font-normal mt-1">
            Targeted Botanical Architecture
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { label: 'Skincare', slug: 'skincare', count: '18 Products', icon: Droplets },
            { label: 'Haircare', slug: 'haircare', count: '8 Products', icon: Leaf },
            { label: 'Body Care', slug: 'bodycare', count: '6 Products', icon: Sparkles },
            { label: 'Fragrance', slug: 'fragrance', count: '5 Products', icon: Activity },
            { label: 'Clean Makeup', slug: 'makeup', count: '7 Products', icon: Sparkles },
            { label: 'Sun Shield', slug: 'suncare', count: '4 Products', icon: ShieldCheck },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="surface-card rounded-card p-4 flex flex-col items-center text-center group hover:border-ink transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-ivory group-hover:bg-rose-light text-ink group-hover:text-rose-clay flex items-center justify-center transition-colors mb-2.5">
                  <Icon className="w-5 h-5 stroke-1.5" />
                </div>
                <h4 className="text-xs font-semibold text-ink group-hover:text-rose-clay transition-colors">{cat.label}</h4>
                <p className="text-[11px] text-taupe mt-0.5">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending Bestsellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-taupe font-semibold">Most Desired</span>
            <h2 className="font-display text-2xl sm:text-4xl text-ink font-normal mt-1">
              Bestselling Formulations
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest font-semibold text-ink hover:text-rose-clay flex items-center gap-1"
          >
            <span>View All ({trendingProducts.length > 0 ? '40+' : '...'})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 4} />
            ))}
          </div>
        )}
      </section>

      {/* Diagnostic Skin Quiz Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-ink text-white p-8 sm:p-14 border border-sand/20">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-rose-subtle font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-clay" />
              <span>GlowShine Diagnostic</span>
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-normal text-white leading-tight">
              Unsure what your skin barrier requires?
            </h2>
            <p className="text-sand/80 text-sm leading-relaxed max-w-xl">
              Answer 4 questions about your skin sensitivity, environment, and daily routine. Our rule-driven beauty intelligence matches you to precise ingredient profiles in seconds.
            </p>
            <div className="pt-4">
              <Link to="/quiz">
                <Button variant="accent" size="lg">
                  <span>Start 2-Minute Diagnostic</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Transparency Commitments (Aesop inspiration) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-sand pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-2">
              <h3 className="font-display text-lg text-ink font-normal">Barrier Biocompatible</h3>
              <p className="text-xs text-taupe leading-relaxed">
                Every formula is balanced between pH 4.8 and 5.5 to support your acid mantle and beneficial cutaneous microbiome without irritation.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-lg text-ink font-normal">Transparent Formulation</h3>
              <p className="text-xs text-taupe leading-relaxed">
                Full ingredient percentages declared for key bio-actives: 5 ceramides, pure Kashmiri saffron, copper peptides, and 10% niacinamide.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-lg text-ink font-normal">Rule-Driven Intelligence</h3>
              <p className="text-xs text-taupe leading-relaxed">
                Recommendations are computed purely from deterministic skin compatibility rules and your browsing behaviour. No opaque black-box models.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
