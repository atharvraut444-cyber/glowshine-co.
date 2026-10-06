import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getOptimizedImageUrl } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export function WishlistPage() {
  const { wishlistItems, addToCart, toggleWishlist } = useCart();

  const handleMoveToBag = (item) => {
    addToCart(item, 1);
    toggleWishlist(item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-sand pb-6">
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">
          Your Saved Formulations
        </h1>
        <p className="text-xs sm:text-sm text-taupe mt-1">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved to your private botanical wishlist.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="surface-card rounded-card p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-ivory mx-auto flex items-center justify-center text-taupe">
            <Heart className="w-7 h-7 stroke-1" />
          </div>
          <h2 className="font-display text-xl text-ink font-normal">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-taupe">
            Save botanical formulations you love while exploring our clean collection.
          </p>
          <Link to="/shop">
            <Button variant="primary">Explore Catalogue</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.productId}
              className="surface-card rounded-card overflow-hidden flex flex-col justify-between p-4"
            >
              <div className="flex gap-4">
                <img
                  src={getOptimizedImageUrl(item.image, 200, 75)}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  width="96"
                  height="112"
                  className="w-24 h-28 object-cover rounded-subtle bg-sand/30 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-taupe">
                      {item.brand}
                    </p>
                    <h3 className="text-sm font-medium text-ink line-clamp-2 mt-0.5">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-sm font-semibold text-ink mt-2">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-sand/60 flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleMoveToBag(item)}
                  icon={ShoppingBag}
                >
                  Move to Bag
                </Button>
                <button
                  onClick={() => toggleWishlist(item)}
                  className="p-2 border border-sand hover:border-status-error text-taupe hover:text-status-error rounded-subtle transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
