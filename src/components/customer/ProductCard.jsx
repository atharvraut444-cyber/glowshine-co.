import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getOptimizedImageUrl } from '../../utils/formatters';

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

  // Render 5 stars matching visual reference
  const ratingValue = product.rating || 4.8;
  const reviewCountFormatted =
    product.reviewCount >= 1000
      ? `${(product.reviewCount / 1000).toFixed(1)}k`
      : product.reviewCount || '980';

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white border border-[#EBE7DF] rounded-xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-card hover:border-[#D8D1C3]"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[1/1] sm:aspect-[1.05/1] bg-[#F7F4EF] overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 skeleton-shimmer bg-sand/40 z-0" />
        )}

        <img
          src={getOptimizedImageUrl(imgSrc, 400, 80)}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : 'auto'}
          decoding="async"
          width="280"
          height="280"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (product.fallbackImage && imgSrc !== product.fallbackImage) {
              setImgSrc(product.fallbackImage);
            }
          }}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Wishlist Heart Icon Top Right */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-500 hover:text-stone-900 backdrop-blur-xs transition-colors z-10 shadow-xs"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-clay text-rose-clay' : 'text-stone-500'
            }`}
          />
        </button>

        {/* Bestseller Badge */}
        {product.isBestseller && (
          <span className="absolute top-2.5 left-2.5 text-[9px] font-semibold uppercase tracking-wider bg-stone-900/90 text-white px-2 py-0.5 rounded-pill z-10">
            Bestseller
          </span>
        )}
      </div>

      {/* Card Info Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Subcategory Label */}
          <span className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-taupe mb-1">
            {product.subCategory || product.category}
          </span>

          {/* Product Title */}
          <h3 className="font-sans text-sm font-semibold text-ink line-clamp-1 group-hover:text-rose-clay transition-colors">
            {product.name}
          </h3>

          {/* Short Formulation Description */}
          <p className="text-[11px] sm:text-xs text-taupe/90 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Star Rating Row */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(ratingValue)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-ink">
              {ratingValue}
            </span>
            <span className="text-[11px] text-taupe">
              ({reviewCountFormatted})
            </span>
          </div>
        </div>

        {/* Bottom Row: Price & Add to Cart Button */}
        <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-sand/40">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-ink">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-taupe line-through font-normal">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-3.5 py-1.5 bg-[#7D6B5D] hover:bg-[#68584B] active:scale-95 text-white text-xs font-medium rounded-md transition-all shadow-xs"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
