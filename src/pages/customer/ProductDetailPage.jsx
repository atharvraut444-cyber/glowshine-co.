import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  Droplet,
  Compass,
} from 'lucide-react';
import { productService } from '../../services/products/productService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { trackEvent } from '../../services/behaviour/behaviourTracker';
import { formatCurrency, getOptimizedImageUrl } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import { MOCK_PRODUCTS } from '../../data/mockProducts';

export function ProductDetailPage() {
  const { id } = useParams();
  const { profile } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(() => MOCK_PRODUCTS.find((p) => p.id === id) || null);
  const [loading, setLoading] = useState(() => !MOCK_PRODUCTS.some((p) => p.id === id));
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('formulation');

  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    async function loadProduct() {
      const res = await productService.getProductById(id, profile?.beautyProfile);
      if (res.product) {
        setProduct(res.product);
        // Track product_view event
        trackEvent({
          eventType: 'product_view',
          productId: res.product.id,
          category: res.product.category,
          value: res.product.price,
        });
      }
      setLoading(false);
    }
    loadProduct();
  }, [id, profile?.beautyProfile]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[4/5] bg-sand/30 rounded-2xl skeleton-shimmer" />
          <div className="space-y-4">
            <div className="h-4 w-28 bg-sand/40 skeleton-shimmer rounded" />
            <div className="h-8 w-3/4 bg-sand/40 skeleton-shimmer rounded" />
            <div className="h-6 w-24 bg-sand/40 skeleton-shimmer rounded" />
            <div className="h-24 w-full bg-sand/40 skeleton-shimmer rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
        <h2 className="font-display text-2xl text-ink font-normal">Formulation Not Found</h2>
        <p className="text-xs text-taupe">The product you are looking for is currently unavailable or has been archived.</p>
        <Link to="/shop">
          <Button variant="primary">Return to Catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-taupe flex items-center gap-2">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-ink capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Imagery */}
        <div className="lg:col-span-6 relative">
          <div className="surface-card rounded-2xl overflow-hidden p-2 sm:p-3 shadow-elevated">
            <img
              src={getOptimizedImageUrl(product.image, 700, 80)}
              alt={product.name}
              fetchpriority="high"
              decoding="async"
              width="600"
              height="750"
              onError={(e) => {
                if (product.fallbackImage && e.target.src !== product.fallbackImage) {
                  e.target.src = product.fallbackImage;
                }
              }}
              className="w-full aspect-[4/5] object-cover rounded-xl"
            />
          </div>

          {/* Floating GlowMatch Badge */}
          {product.glowMatchScore && (
            <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md border border-sand px-3 py-1.5 rounded-pill shadow-card flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-clay" />
              <span className="text-xs font-semibold text-rose-clay">
                {product.glowMatchScore}% Compatibility Match
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Product Detail & Formulation Intel */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-taupe mb-1">
              {product.brand}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal leading-tight">
              {product.name}
            </h1>

            {/* Rating and Volume */}
            <div className="flex items-center gap-4 mt-3 text-xs text-taupe">
              <div className="flex items-center gap-1 font-medium text-ink">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-taupe">({product.reviewCount} customer reviews)</span>
              </div>
              <span>·</span>
              <span>{product.volume}</span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">In Stock ({product.stock} units)</span>
            </div>
          </div>

          {/* Price Bar */}
          <div className="flex items-baseline gap-3 py-3 border-y border-sand">
            <span className="text-2xl sm:text-3xl font-bold text-ink">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-taupe line-through font-normal">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="text-xs text-taupe ml-auto">
              Inclusive of all taxes · Exact UPI QR enabled
            </span>
          </div>

          {/* Editorial Description */}
          <p className="text-sm text-taupe leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Behavioral GlowMatch Rationale Box */}
          <div className="bg-rose-light/50 border border-rose-subtle p-4 rounded-card space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-clay uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GlowMatch™ Formula Compatibility</span>
            </div>
            <p className="text-xs text-ink/80 leading-relaxed">
              Targeted for {product.skinTypes.join(', ')} skin experiencing {product.concerns.map(c => c.replace('_', ' ')).join(' & ')}. Biocompatible lipid ratio mimics healthy epidermal stratum corneum.
            </p>
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-sand rounded-subtle bg-white h-12 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-taupe hover:text-ink transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 text-taupe hover:text-ink transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <Button
                variant="primary"
                className="flex-1 h-12 text-sm"
                onClick={() => addToCart(product, quantity)}
                icon={ShoppingBag}
              >
                <span>Add to Bag — {formatCurrency(product.price * quantity)}</span>
              </Button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`h-12 w-12 rounded-subtle border flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'bg-rose-clay border-rose-clay text-white'
                    : 'border-sand bg-white text-taupe hover:text-ink hover:border-ink'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-taupe pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
                <span>Complimentary shipping over ₹999</span>
              </span>
              <span>7-Day Return Guarantee</span>
            </div>
          </div>

          {/* Tabbed Science & Formulation Breakdown */}
          <div className="pt-6 border-t border-sand">
            <div className="flex gap-6 border-b border-sand pb-2">
              {['formulation', 'usage', 'ingredients'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs uppercase tracking-wider font-semibold pb-2 border-b-2 transition-all capitalize ${
                    activeTab === tab
                      ? 'border-ink text-ink'
                      : 'border-transparent text-taupe hover:text-ink'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="pt-4 text-xs text-taupe leading-relaxed">
              {activeTab === 'formulation' && (
                <div className="space-y-2">
                  <p><span className="font-semibold text-ink">Texture:</span> {product.texture}</p>
                  <p><span className="font-semibold text-ink">Target Concerns:</span> {product.concerns.map(c => c.replace('_', ' ')).join(', ')}</p>
                  <p><span className="font-semibold text-ink">Suitable For:</span> {product.skinTypes.join(', ')} skin types</p>
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="space-y-2">
                  <p><span className="font-semibold text-ink">Application Ritual:</span> {product.usage}</p>
                  <p className="text-[11px] text-taupe/80">Always patch test new active botanicals 24 hours prior to full facial application.</p>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients?.map((ing) => (
                      <span key={ing} className="bg-sand-light text-ink border border-sand px-2 py-0.5 rounded-pill text-[11px] font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
