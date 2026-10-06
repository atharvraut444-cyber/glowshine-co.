import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, MapPin, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, getOptimizedImageUrl } from '../../utils/formatters';
import { validateAddress } from '../../utils/validators';
import { trackEvent } from '../../services/behaviour/behaviourTracker';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/firebase';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user, profile, loginDemo } = useAuth();
  const { error: toastError } = useToast();

  const [address, setAddress] = useState({
    fullName: profile?.name || user?.displayName || '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // If bag is empty, redirect to shop
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-display text-2xl text-ink font-normal">Your Bag is Empty</h2>
        <p className="text-xs text-taupe">Please add items to your shopping bag before proceeding to checkout.</p>
        <Button variant="primary" onClick={() => navigate('/shop')}>
          Explore Formulations
        </Button>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateAddress(address);

    if (!isValid) {
      setFormErrors(errors);
      toastError('Please check highlighted address fields.', 'Incomplete Address');
      return;
    }

    setSubmitting(true);

    try {
      // Auto-create guest/demo session if user is not signed in yet
      let currentUid = user?.uid;
      let currentUserEmail = user?.email;

      if (!currentUid) {
        await loginDemo('customer');
        currentUid = 'demo-customer-uid-01';
        currentUserEmail = 'customer@glowshine.demo';
      }

      // Generate unique order ID
      const orderId = 'ord_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

      const orderPayload = {
        id: orderId,
        userId: currentUid,
        userEmail: currentUserEmail,
        customerName: address.fullName,
        shippingAddress: address,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          brand: item.brand,
          price: item.price,
          priceInPaise: item.priceInPaise || item.price * 100,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        deliveryFee,
        total,
        totalInPaise: total * 100,
        status: 'payment_pending',
        paymentStatus: 'unpaid',
        paymentMode: import.meta.env.VITE_PAYMENT_MODE || 'demo',
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      };

      // Write order to Firestore if configured
      const isDemo =
        !import.meta.env.VITE_FIREBASE_API_KEY ||
        import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoKey');
      const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';

      if (!isDemo || useEmulators) {
        try {
          const orderRef = doc(db, 'orders', orderId);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1500)
          );
          await Promise.race([setDoc(orderRef, orderPayload), timeoutPromise]);
        } catch (err) {
          console.warn('[Checkout] Firestore write fallback:', err.message);
        }
      }

      // Also persist to localStorage for offline demo reliability
      try {
        localStorage.setItem(`order_${orderId}`, JSON.stringify(orderPayload));
      } catch (e) {
        // ignore
      }

      // Track checkout_start behaviour event
      trackEvent({
        eventType: 'checkout_start',
        value: total,
        meta: { orderId, itemCount: cartItems.length },
      });

      // Clear the cart bag
      clearCart();

      // Navigate to UPI QR payment page
      navigate(`/checkout/pay/${orderId}`);
    } catch (err) {
      console.error('[Checkout] Error creating order:', err);
      toastError('Could not initialize checkout. Please try again.', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="border-b border-sand pb-4">
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-taupe mt-1">
          Step 1 of 2: Shipping Destination · Step 2: Exact UPI QR Payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Shipping Address Form */}
        <div className="lg:col-span-7 bg-white border border-sand p-6 sm:p-8 rounded-card shadow-subtle space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-sand/60">
            <MapPin className="w-4 h-4 text-rose-clay" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">
              1. Delivery Address
            </h2>
          </div>

          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                value={address.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                error={formErrors.fullName}
                placeholder="Priya Sharma"
              />

              <Input
                label="Mobile Phone"
                type="tel"
                required
                value={address.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={formErrors.phone}
                placeholder="9876543210"
                helperText="10-digit Indian mobile number for delivery updates"
              />
            </div>

            <Input
              label="Street Address / Building"
              required
              value={address.addressLine1}
              onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              error={formErrors.addressLine1}
              placeholder="Flat 402, Lotus Residency, MG Road"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City"
                required
                value={address.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={formErrors.city}
                placeholder="Pune"
              />

              <Input
                label="State"
                required
                value={address.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                error={formErrors.state}
                placeholder="Maharashtra"
              />

              <Input
                label="PIN Code"
                required
                value={address.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                error={formErrors.pincode}
                placeholder="411037"
              />
            </div>
          </form>

          <div className="p-4 bg-ivory rounded-subtle border border-sand/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-taupe leading-relaxed">
              <span className="font-semibold text-ink">Exact-Amount UPI QR Protection:</span> After clicking proceed, a dynamic QR code encoded for exactly <strong className="text-ink">{formatCurrency(total)}</strong> will be generated. You can scan with Google Pay, PhonePe, Paytm or BHIM without typing amounts or sharing card details.
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-white border border-sand p-6 sm:p-8 rounded-card shadow-subtle space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink pb-3 border-b border-sand/60">
            2. Order Summary ({cartItems.length} items)
          </h2>

          <div className="divide-y divide-sand/50 max-h-72 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.productId} className="py-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={getOptimizedImageUrl(item.image, 120, 75)}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    width="48"
                    height="56"
                    className="w-12 h-14 object-cover rounded bg-sand/30 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-ink truncate">{item.name}</p>
                    <p className="text-taupe text-[11px]">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-ink shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-sand text-xs text-taupe">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-ink font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-ink font-medium">
                {deliveryFee === 0 ? 'Complimentary' : formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-sand text-sm font-semibold text-ink">
              <span>Total Payable</span>
              <span className="text-base text-rose-clay">{formatCurrency(total)}</span>
            </div>
          </div>

          <Button
            type="submit"
            form="checkout-form"
            variant="accent"
            className="w-full py-3.5 text-sm font-semibold shadow-card"
            isLoading={submitting}
          >
            <span>Proceed to UPI QR Payment</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <p className="text-[11px] text-center text-taupe flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-taupe" />
            <span>256-Bit SSL Encrypted & NPCI UPI Compatible</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
