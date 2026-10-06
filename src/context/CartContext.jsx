import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase/firebase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { trackEvent } from '../services/behaviour/behaviourTracker';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { success, info } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('glowshine_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('glowshine_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync with Firestore carts/{uid} when user logs in
  useEffect(() => {
    if (!user) return;

    const cartRef = doc(db, 'carts', user.uid);
    const unsubscribe = onSnapshot(
      cartRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.items && Array.isArray(data.items)) {
            setCartItems(data.items);
            localStorage.setItem('glowshine_cart', JSON.stringify(data.items));
          }
        }
      },
      (err) => {
        console.warn('[CartContext] Cart listener error:', err.message);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Persist cart to localStorage & Firestore
  const persistCart = useCallback(
    async (items) => {
      setCartItems(items);
      try {
        localStorage.setItem('glowshine_cart', JSON.stringify(items));
      } catch (e) {
        console.warn('[CartContext] localStorage error:', e);
      }

      if (user) {
        try {
          const cartRef = doc(db, 'carts', user.uid);
          await setDoc(cartRef, { items, updatedAt: new Date() }, { merge: true });
        } catch (e) {
          console.warn('[CartContext] Firestore cart sync error:', e);
        }
      }
    },
    [user]
  );

  // Persist wishlist
  const persistWishlist = useCallback((items) => {
    setWishlistItems(items);
    try {
      localStorage.setItem('glowshine_wishlist', JSON.stringify(items));
    } catch (e) {
      console.warn('[CartContext] localStorage error:', e);
    }
  }, []);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.productId === product.id);
        let newItems;

        if (existingIndex > -1) {
          newItems = prevItems.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          newItems = [
            ...prevItems,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              priceInPaise: product.priceInPaise || product.price * 100,
              image: product.image,
              brand: product.brand,
              category: product.category,
              quantity,
            },
          ];
        }

        persistCart(newItems);
        return newItems;
      });

      success(`Added "${product.name}" to your bag.`, 'Shopping Bag');
      setIsCartOpen(true);

      // Track behaviour event
      trackEvent({
        eventType: 'cart_add',
        productId: product.id,
        category: product.category,
        value: product.price,
        meta: { quantity },
      });
    },
    [persistCart, success]
  );

  const updateQuantity = useCallback(
    (productId, newQty) => {
      if (newQty <= 0) {
        removeFromCart(productId);
        return;
      }

      setCartItems((prev) => {
        const newItems = prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQty } : item
        );
        persistCart(newItems);
        return newItems;
      });
    },
    [persistCart]
  );

  const removeFromCart = useCallback(
    (productId) => {
      setCartItems((prev) => {
        const target = prev.find((item) => item.productId === productId);
        const newItems = prev.filter((item) => item.productId !== productId);
        persistCart(newItems);

        if (target) {
          trackEvent({
            eventType: 'cart_remove',
            productId,
            category: target.category,
            value: target.price,
          });
        }

        return newItems;
      });
      info('Item removed from your bag.');
    },
    [persistCart, info]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    persistCart([]);
  }, [persistCart]);

  const toggleWishlist = useCallback(
    (product) => {
      setWishlistItems((prev) => {
        const exists = prev.some((item) => item.productId === product.id);
        let newWishlist;

        if (exists) {
          newWishlist = prev.filter((item) => item.productId !== product.id);
          info(`Removed "${product.name}" from your wishlist.`);
          trackEvent({
            eventType: 'wishlist_remove',
            productId: product.id,
            category: product.category,
          });
        } else {
          newWishlist = [
            ...prev,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              brand: product.brand,
              category: product.category,
              addedAt: new Date().toISOString(),
            },
          ];
          success(`Saved "${product.name}" to wishlist.`, 'Wishlist');
          trackEvent({
            eventType: 'wishlist_add',
            productId: product.id,
            category: product.category,
          });
        }

        persistWishlist(newWishlist);
        return newWishlist;
      });
    },
    [persistWishlist, success, info]
  );

  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some((item) => item.productId === productId);
    },
    [wishlistItems]
  );

  // Computed Cart Metrics
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const deliveryFee = subtotal >= 999 || subtotal === 0 ? 0 : 99; // Free delivery above ₹999

  const total = subtotal + deliveryFee;

  const value = {
    cartItems,
    wishlistItems,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isInWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
