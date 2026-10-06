import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Package,
} from 'lucide-react';
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/firebase';
import { formatCurrency, maskUpiId } from '../../utils/formatters';
import { validateUtr } from '../../utils/validators';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export function CheckoutPayPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError, info } = useToast();

  const [order, setOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(`order_${orderId}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem(`order_${orderId}`);
    } catch {
      return true;
    }
  });
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins

  // Direct UPI UTR submission
  const [utrNumber, setUtrNumber] = useState('');
  const [utrSubmitting, setUtrSubmitting] = useState(false);
  const [utrError, setUtrError] = useState('');

  // Payment configuration
  const paymentMode = import.meta.env.VITE_PAYMENT_MODE || 'demo';
  const payeeUpi = import.meta.env.VITE_STORE_UPI_ID || 'glowshine@upi';
  const payeeName = import.meta.env.VITE_STORE_PAYEE_NAME || 'GlowShine Co.';

  // Subscribe to real-time order updates
  useEffect(() => {
    let unsubscribe = () => {};

    async function subscribeOrder() {
      setLoading(true);
      try {
        const orderRef = doc(db, 'orders', orderId);
        unsubscribe = onSnapshot(
          orderRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setOrder(data);

              // If order gets confirmed, trigger confetti
              if (data.paymentStatus === 'paid' || data.status === 'confirmed') {
                try {
                  confetti({
                    particleCount: 100,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#B87568', '#CDBBA8', '#2E7D32', '#111111'],
                  });
                } catch (e) {
                  // ignore
                }
              }
            } else {
              // Try local storage fallback
              const saved = localStorage.getItem(`order_${orderId}`);
              if (saved) {
                setOrder(JSON.parse(saved));
              }
            }
            setLoading(false);
          },
          (err) => {
            console.warn('[CheckoutPay] Listener error, using local fallback:', err.message);
            const saved = localStorage.getItem(`order_${orderId}`);
            if (saved) setOrder(JSON.parse(saved));
            setLoading(false);
          }
        );
      } catch (err) {
        const saved = localStorage.getItem(`order_${orderId}`);
        if (saved) setOrder(JSON.parse(saved));
        setLoading(false);
      }
    }

    subscribeOrder();
    return () => unsubscribe();
  }, [orderId]);

  // 15-Minute Countdown Timer
  useEffect(() => {
    if (order?.paymentStatus === 'paid') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order?.paymentStatus]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate UPI Deep Link URL (NPCI UPI Specification)
  const upiAmount = order ? (order.total).toFixed(2) : '0.00';
  const upiPayload = `upi://pay?pa=${encodeURIComponent(payeeUpi)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${upiAmount}&cu=INR&tr=${encodeURIComponent(orderId)}&tn=${encodeURIComponent(
    `GlowShine Order ${orderId}`
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(payeeUpi);
    setCopiedUpi(true);
    info('Store UPI ID copied to clipboard.');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handlePayViaApp = () => {
    window.location.href = upiPayload;
  };

  // Demo Mode: Simulate Instant Payment Success
  const handleSimulatePayment = async () => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updateData = {
        paymentStatus: 'paid',
        status: 'confirmed',
        paidAt: new Date().toISOString(),
        paymentMode: 'demo',
        reference: `DEMO_PAY_${Date.now()}`,
      };

      const isDemo =
        !import.meta.env.VITE_FIREBASE_API_KEY ||
        import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoKey');
      const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';

      if (!isDemo || useEmulators) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1500)
          );
          await Promise.race([updateDoc(orderRef, updateData), timeoutPromise]);
        } catch (e) {
          setOrder((prev) => ({ ...prev, ...updateData }));
        }
      } else {
        setOrder((prev) => ({ ...prev, ...updateData }));
      }

      localStorage.setItem(`order_${orderId}`, JSON.stringify({ ...order, ...updateData }));
      success('Demo UPI payment verified successfully!', 'Order Confirmed');
    } catch (err) {
      toastError(err.message, 'Payment Error');
    }
  };

  // Direct UPI Mode: Submit UTR Bank Reference
  const handleSubmitUtr = async (e) => {
    e.preventDefault();
    setUtrError('');

    if (!validateUtr(utrNumber)) {
      setUtrError('Please enter a valid 12-digit UTR reference from your UPI app receipt.');
      return;
    }

    setUtrSubmitting(true);
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updateData = {
        paymentStatus: 'reference_submitted',
        status: 'payment_pending',
        utrReference: utrNumber.trim(),
        referenceSubmittedAt: new Date().toISOString(),
      };

      const isDemo =
        !import.meta.env.VITE_FIREBASE_API_KEY ||
        import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoKey');
      const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';

      if (!isDemo || useEmulators) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1500)
          );
          await Promise.race([updateDoc(orderRef, updateData), timeoutPromise]);
        } catch (e) {
          setOrder((prev) => ({ ...prev, ...updateData }));
        }
      } else {
        setOrder((prev) => ({ ...prev, ...updateData }));
      }

      localStorage.setItem(`order_${orderId}`, JSON.stringify({ ...order, ...updateData }));
      success('UTR reference submitted. Awaiting store verification.', 'Submitted');
    } catch (err) {
      setUtrError('Could not record UTR. Please try again.');
    } finally {
      setUtrSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Clock className="w-8 h-8 animate-spin text-rose-clay" />
        <p className="text-xs uppercase tracking-widest text-taupe font-medium">
          Generating Exact-Amount UPI QR...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-display text-2xl text-ink font-normal">Order Session Not Found</h2>
        <p className="text-xs text-taupe">We could not retrieve this payment session. It may have expired.</p>
        <Link to="/shop">
          <Button variant="primary">Return to Storefront</Button>
        </Link>
      </div>
    );
  }

  // State: Payment Confirmed / Paid
  if (order.paymentStatus === 'paid' || order.status === 'confirmed') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center space-y-8 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-status-success mx-auto flex items-center justify-center border border-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-pill">
            Payment Confirmed
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">
            Thank you for your order
          </h1>
          <p className="text-xs sm:text-sm text-taupe max-w-md mx-auto">
            Order <strong className="text-ink">{order.id}</strong> has been confirmed. Our apothecary team is preparing your fresh botanical batch.
          </p>
        </div>

        {/* Order Details Receipt Box */}
        <div className="surface-card rounded-card p-6 text-left space-y-4 max-w-lg mx-auto">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-sand">
            <span className="text-taupe">Total Paid</span>
            <span className="font-bold text-ink text-base">{formatCurrency(order.total)}</span>
          </div>

          <div className="space-y-2 text-xs text-taupe">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="text-ink font-medium uppercase font-mono">{order.paymentMode || paymentMode}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="text-ink font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery To:</span>
              <span className="text-ink font-medium text-right max-w-[200px] truncate">
                {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/orders">
            <Button variant="primary" icon={Package}>
              View My Orders
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Banner Notice */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">
          Scan & Pay with Any UPI App
        </h1>
        <p className="text-xs sm:text-sm text-taupe max-w-md mx-auto">
          Scan the QR code below using Google Pay, PhonePe, Paytm, or BHIM for the exact order total.
        </p>
      </div>

      {/* Main Payment Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: QR Code Showcase */}
        <div className="md:col-span-6 bg-white border border-sand rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-card">
          {/* Expiry Timer Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
            <span>QR expires in {formatTimer(timeLeft)}</span>
          </div>

          {/* Exact QR Code with Quiet Zone */}
          <div className="bg-white p-5 border border-sand/80 rounded-card inline-block shadow-subtle mx-auto">
            <QRCodeSVG
              value={upiPayload}
              size={220}
              level="M"
              includeMargin={true}
              imageSettings={{
                src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✨</text></svg>",
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>

          {/* Exact Amount Display */}
          <div>
            <p className="text-xs uppercase tracking-widest text-taupe font-medium">Exact Order Amount</p>
            <p className="font-display text-3xl sm:text-4xl text-ink font-normal mt-0.5">
              {formatCurrency(order.total)}
            </p>
            <p className="text-[11px] text-taupe mt-1">
              Payee: <strong className="text-ink">{payeeName}</strong> ({maskUpiId(payeeUpi)})
            </p>
          </div>

          {/* Mobile "Pay with UPI App" button (FR-PAY-05) */}
          <div className="pt-2">
            <Button
              variant="accent"
              className="w-full py-3 sm:hidden"
              onClick={handlePayViaApp}
              icon={Smartphone}
            >
              Pay with Installed UPI App
            </Button>
          </div>
        </div>

        {/* Right Column: Instructions, Verification & Demo Controls */}
        <div className="md:col-span-6 space-y-6">
          {/* Step-by-Step Instructions */}
          <div className="bg-white border border-sand rounded-card p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink pb-2 border-b border-sand/60">
              Payment Instructions
            </h2>
            <ol className="space-y-3 text-xs text-taupe">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-ivory border border-sand text-ink font-semibold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>Open Google Pay, PhonePe, Paytm, or BHIM on your smartphone.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-ivory border border-sand text-ink font-semibold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>Scan the QR code. The exact total ({formatCurrency(order.total)}) is preset automatically.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-ivory border border-sand text-ink font-semibold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>Authorize payment inside your bank app. Keep this page open; your order confirms automatically.</span>
              </li>
            </ol>

            {/* SEC-17 Reassurance */}
            <div className="pt-3 border-t border-sand/60 flex items-start gap-2 text-[11px] text-emerald-800 bg-emerald-50/60 p-3 rounded-subtle">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Your security is absolute:</strong> Your UPI PIN is entered solely within your trusted banking app. GlowShine never receives, sees, or stores your PIN.
              </span>
            </div>
          </div>

          {/* Mode 1: Demo Mode Controls */}
          {paymentMode === 'demo' && (
            <div className="bg-purple-50/80 border border-purple-200 rounded-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-200 text-purple-900 px-2 py-0.5 rounded-pill">
                  TEST MODE
                </span>
                <p className="text-xs font-semibold text-purple-900">Simulate Payment (No Real Money Charged)</p>
              </div>
              <p className="text-xs text-purple-800 leading-relaxed">
                You are running in demo mode. Test the complete order flow, state machine, and confirmation by clicking below:
              </p>
              <Button
                variant="primary"
                onClick={handleSimulatePayment}
                className="w-full bg-purple-900 hover:bg-purple-800 text-white py-2.5 text-xs font-semibold"
              >
                <span>⚡ Simulate Successful UPI Payment</span>
              </Button>
            </div>
          )}

          {/* Mode 2: Direct UPI UTR Submission (FR-PAY-11) */}
          {(paymentMode === 'direct_upi' || order.paymentStatus === 'reference_submitted') && (
            <div className="bg-white border border-sand rounded-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-sand/60">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Direct UPI Verification
                </h3>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="text-[11px] text-rose-clay hover:underline flex items-center gap-1"
                >
                  {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy Store UPI ID'}</span>
                </button>
              </div>

              {order.paymentStatus === 'reference_submitted' ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-subtle space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Awaiting Store Verification</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Your UTR reference (<strong>{order.utrReference}</strong>) was recorded. An administrator will verify the bank statement entry and confirm your order shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitUtr} className="space-y-3">
                  <p className="text-xs text-taupe leading-relaxed">
                    Once paid from your UPI app, submit the 12-digit UTR / UPI Transaction ID from your payment receipt:
                  </p>
                  <Input
                    label="12-Digit UTR / Bank Reference"
                    type="text"
                    required
                    maxLength={12}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 428190184712"
                    error={utrError}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full text-xs"
                    isLoading={utrSubmitting}
                  >
                    <span>Submit Reference for Verification</span>
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutPayPage;
