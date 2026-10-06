import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getOptimizedImageUrl } from '../../utils/formatters';
import { Button } from '../common/Button';

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 999;
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-sand flex items-center justify-between bg-ivory-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-clay" />
            <h2 className="font-display text-xl text-ink font-normal">Your Bag</h2>
            <span className="text-xs bg-sand text-taupe px-2 py-0.5 rounded-pill font-medium">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-taupe hover:text-ink transition-colors rounded-full hover:bg-sand/30"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-ivory border-b border-sand text-xs">
          {remainingForFree > 0 ? (
            <p className="text-taupe mb-1.5">
              Add <span className="font-semibold text-ink">{formatCurrency(remainingForFree)}</span> more for <span className="text-rose-clay font-medium">Complimentary Delivery</span>
            </p>
          ) : (
            <p className="text-status-success font-medium mb-1.5 flex items-center gap-1">
              <span>✨</span> You've unlocked Complimentary Express Delivery!
            </p>
          )}
          <div className="w-full bg-sand/60 h-1.5 rounded-pill overflow-hidden">
            <div
              className="bg-rose-clay h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-sand/50">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center text-taupe">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink font-normal">Your bag is currently empty</h3>
                <p className="text-xs text-taupe mt-1 max-w-xs">
                  Discover clean botanical formulations tailored to your skin's unique needs.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
              >
                Explore Catalogue
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="py-4 first:pt-0 flex gap-4">
                <img
                  src={getOptimizedImageUrl(item.image, 160, 75)}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  width="64"
                  height="80"
                  className="w-16 h-20 object-cover rounded-subtle bg-sand/30 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-[11px] uppercase tracking-wider text-taupe font-medium">
                        {item.brand}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-taupe hover:text-status-error p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-medium text-ink line-clamp-1 mt-0.5">{item.name}</h4>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-sand rounded-luxury overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-sand/30 text-taupe hover:text-ink transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs px-2.5 font-medium text-ink">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-sand/30 text-taupe hover:text-ink transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-ink">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-sand bg-ivory-50 space-y-4">
            <div className="space-y-1.5 text-xs text-taupe">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-ink font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-ink font-medium">
                  {deliveryFee === 0 ? 'Complimentary' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-sand text-sm font-semibold text-ink">
                <span>Total</span>
                <span className="text-base text-rose-clay">{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              variant="accent"
              className="w-full py-3"
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-taupe">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              <span>Instant UPI QR payment at next step</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
