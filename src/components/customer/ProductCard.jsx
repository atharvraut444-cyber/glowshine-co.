import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getOptimizedImageUrl } from '../../utils/formatters';
import { Badge } from '../common/Badge';

export function ProductCard({ product, priority = false }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const [imgSrc, setImgSrc] = useState(product.image);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(product.image);
    setLoaded(false);
  }, [product.image]);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative surface-card rounded-card overflow-hidden flex flex-col cursor-pointer transition-all duration-300"
    >
      {/* Top Badges & Wishlist Button */}
      <div className="relative aspect-[4/5] bg-sand/20 overflow-hidden">
        {/* Instant skeleton shimmer while image finishes loading */}
        {!loaded && (
          <div className="absolute inset-0 skeleton-shimmer bg-sand/40 z-0" />
        )}

        <img
          src={getOptimizedImageUrl(imgSrc, 400, 75)}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : 'auto'}
          decoding="async"
          width="280"
          height="350"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (product.fallbackImage && imgSrc !== product.fallbackImage) {
              setImgSrc(product.fallbackImage);
            }
          }}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.glowMatchScore && (
            <Badge score={product.glowMatchScore} />
          )}
          {product.isBestseller && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-ink text-white px-2 py-0.5 rounded-pill shadow-subtle">
              Bestseller
            </span>
          )}
          {product.isNew && !product.isBestseller && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/90 text-ink border border-sand px-2 py-0.5 rounded-pill shadow-subtle backdrop-blur-xs">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-rose-clay text-white shadow-subtle'
              : 'bg-white/80 text-taupe hover:text-ink hover:bg-white shadow-subtle'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block z-10">
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 bg-ink/90 hover:bg-ink text-white text-xs font-medium rounded-subtle shadow-card flex items-center justify-center gap-1.5 backdrop-blur-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[11px] text-taupe mb-1">
            <span className="uppercase tracking-widest font-semibold">{product.brand}</span>
            {product.rating && (
              <span className="flex items-center gap-0.5 font-medium text-ink">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-taupe text-[10px]">({product.reviewCount || 0})</span>
              </span>
            )}
          </div>

          <h3 className="font-sans text-sm font-medium text-ink line-clamp-2 leading-snug group-hover:text-rose-clay transition-colors">
            {product.name}
          </h3>

          {product.volume && (
            <p className="text-[11px] text-taupe mt-1">{product.volume}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-sand/40">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-ink">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-taupe line-through font-normal">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Icon */}
          <button
            onClick={handleAddToCart}
            className="sm:hidden p-1.5 rounded-full bg-sand-light text-ink hover:bg-ink hover:text-white transition-colors"
            aria-label="Add to bag"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
