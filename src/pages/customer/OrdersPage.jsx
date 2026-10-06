import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase/firebase';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      let list = [];

      const isDemo =
        !import.meta.env.VITE_FIREBASE_API_KEY ||
        import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoKey');
      const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';

      try {
        if (user && (!isDemo || useEmulators)) {
          const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1200)
          );
          const snapshot = await Promise.race([getDocs(q), timeoutPromise]);
          if (!snapshot.empty) {
            list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
          }
        }
      } catch (err) {
        console.warn('[OrdersPage] Checking local storage:', err.message);
      }

      // Check localStorage for demo/offline orders if Firestore had none
      if (list.length === 0) {
        try {
          const keys = Object.keys(localStorage).filter((k) => k.startsWith('order_'));
          list = keys.map((k) => JSON.parse(localStorage.getItem(k))).filter(Boolean);
        } catch (e) {
          // ignore
        }
      }

      // Sort by createdAt descending
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setOrders(list);
      setLoading(false);
    }

    loadOrders();
  }, [user]);

  const getStatusBadge = (order) => {
    if (order.paymentStatus === 'paid' || order.status === 'confirmed') {
      return <Badge variant="success">Confirmed & Paid</Badge>;
    }
    if (order.paymentStatus === 'reference_submitted') {
      return <Badge variant="warning">Awaiting UTR Verification</Badge>;
    }
    return <Badge variant="error">Payment Pending</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-sand pb-4">
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">
          My Order History
        </h1>
        <p className="text-xs sm:text-sm text-taupe mt-1">
          Track active shipments and review past botanical formulations.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="surface-card rounded-card p-6 h-36 skeleton-shimmer" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="surface-card rounded-card p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-ivory mx-auto flex items-center justify-center text-taupe">
            <Package className="w-7 h-7 stroke-1" />
          </div>
          <h2 className="font-display text-xl text-ink font-normal">
            No orders placed yet
          </h2>
          <p className="text-xs text-taupe">
            When you complete an order via our exact-amount UPI QR, it will appear here with live tracking.
          </p>
          <Link to="/shop">
            <Button variant="primary">Explore Catalogue</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="surface-card rounded-card p-6 space-y-4 border border-sand transition-all hover:border-ink/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand/60 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-mono text-xs font-semibold text-ink">
                      {order.id}
                    </h3>
                    {getStatusBadge(order)}
                  </div>
                  <p className="text-[11px] text-taupe">
                    Placed on {formatDate(order.createdAt, true)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-ink">
                    {formatCurrency(order.total)}
                  </span>
                  {order.paymentStatus !== 'paid' && order.status !== 'confirmed' && (
                    <Link to={`/checkout/pay/${order.id}`}>
                      <Button variant="accent" size="sm">
                        <span>Pay by UPI QR</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Items in order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-ivory-50 rounded-subtle border border-sand/40">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded bg-sand/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ink truncate">{item.name}</p>
                      <p className="text-[11px] text-taupe">
                        Qty: {item.quantity} · {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-sand/40 text-xs text-taupe gap-2">
                <span>
                  Delivery to: <strong className="text-ink">{order.shippingAddress?.fullName}</strong>, {order.shippingAddress?.city}
                </span>
                <span className="font-mono text-[11px] uppercase">
                  Payment Mode: {order.paymentMode || 'UPI'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
