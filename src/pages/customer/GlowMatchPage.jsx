import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/products/productService';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import ProductCard from '../../components/customer/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import { Button } from '../../components/common/Button';

export function GlowMatchPage() {
  const { user, profile } = useAuth();
  const [matchedProducts, setMatchedProducts] = useState(() => MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  const beautyProfile = profile?.beautyProfile;

  useEffect(() => {
    async function loadMatches() {
      const res = await productService.getProducts({
        sortBy: 'match',
        beautyProfile,
      });
      setMatchedProducts(res.products);
      setLoading(false);
    }
    loadMatches();
  }, [beautyProfile]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-ivory via-white to-ivory-50 border border-sand rounded-2xl p-6 sm:p-10 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-rose-light text-rose-clay text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Behavioral Retail Intelligence Engine</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">
            Your Calibrated GlowMatch™ Results
          </h1>

          <p className="text-xs sm:text-sm text-taupe max-w-xl leading-relaxed">
            Formulations ranked deterministically using your skin profile and shopping intent. We cross-reference active ingredients against barrier tolerance.
          </p>

          {beautyProfile && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="bg-white border border-sand px-3 py-1 rounded-pill text-ink font-medium">
                Skin: <strong className="capitalize">{beautyProfile.skinType}</strong>
              </span>
              <span className="bg-white border border-sand px-3 py-1 rounded-pill text-ink font-medium">
                Focus: <strong className="capitalize">{beautyProfile.primaryConcern?.replace('_', ' ')}</strong>
              </span>
              <span className="bg-white border border-sand px-3 py-1 rounded-pill text-ink font-medium">
                Ritual: <strong className="capitalize">{beautyProfile.routineExperience}</strong>
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
          <Link to="/quiz">
            <Button variant="secondary" size="sm" icon={RotateCcw}>
              Recalibrate Diagnostic
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="primary" size="sm">
              Explore All Formulations
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Matched Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink font-normal">
              High-Affinity Recommendations ({matchedProducts.length})
            </h2>
            <p className="text-xs text-taupe mt-0.5">
              Sorted by highest compatibility score first
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {matchedProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GlowMatchPage;
