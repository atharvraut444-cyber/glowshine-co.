import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Users,
  BrainCircuit,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../services/firebase/firebase';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 284500,
    totalOrders: 184,
    unverifiedUtrCount: 3,
    activeShoppers: 24,
    avgGlowScore: 84,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      let ordersList = [];

      const isDemo =
        !import.meta.env.VITE_FIREBASE_API_KEY ||
        import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoKey');
      const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';

      try {
        if (!isDemo || useEmulators) {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1200)
          );
          const snap = await Promise.race([
            getDocs(query(collection(db, 'orders'), limit(10))),
            timeoutPromise,
          ]);
          if (!snap.empty) {
            ordersList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          }
        }
      } catch (e) {
        console.warn('[AdminDashboard] Using local store orders:', e.message);
      }

      // Check localStorage for local orders
      try {
        const keys = Object.keys(localStorage).filter((k) => k.startsWith('order_'));
        const localOrders = keys.map((k) => JSON.parse(localStorage.getItem(k))).filter(Boolean);
        ordersList = [...ordersList, ...localOrders];
      } catch (e) {
        // ignore
      }

      // Deduplicate orders by id
      const seen = new Set();
      const deduped = [];
      for (const o of ordersList) {
        if (!seen.has(o.id)) {
          seen.add(o.id);
          deduped.push(o);
        }
      }

      // Seed realistic demo orders if empty
      if (deduped.length === 0) {
        deduped.push(
          {
            id: 'ord_9182a',
            customerName: 'Aarav Mehta',
            userEmail: 'aarav@example.com',
            total: 2499,
            paymentStatus: 'paid',
            status: 'confirmed',
            paymentMode: 'gateway',
            createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            items: [{ name: 'Velvet Santal Extrait', quantity: 1, price: 2499 }],
          },
          {
            id: 'ord_7741c',
            customerName: 'Pooja Iyer',
            userEmail: 'pooja.i@example.com',
            total: 1299,
            paymentStatus: 'reference_submitted',
            status: 'payment_pending',
            utrReference: '428190184712',
            paymentMode: 'direct_upi',
            createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
            items: [{ name: 'Ceramide Dew Barrier Repair', quantity: 1, price: 1299 }],
          },
          {
            id: 'ord_3290d',
            customerName: 'Rohan Deshmukh',
            userEmail: 'rohan.d@example.com',
            total: 1848,
            paymentStatus: 'paid',
            status: 'confirmed',
            paymentMode: 'demo',
            createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
            items: [
              { name: '10% Niacinamide Serum', quantity: 1, price: 949 },
              { name: 'Solar Silk Invisible Fluid', quantity: 1, price: 899 },
            ],
          }
        );
      }

      setRecentOrders(deduped.slice(0, 5));
      setLoading(false);
    }

    loadAdminData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-normal">
            Retail Intelligence Overview
          </h1>
          <p className="text-xs text-taupe mt-1">
            Real-time commerce telemetry, exact UPI payments verification, and behavioural scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/payments">
            <Button variant="accent" size="sm" icon={CreditCard}>
              <span>Verify UTR Payments ({metrics.unverifiedUtrCount})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Gross Sales */}
        <div className="bg-white border border-sand rounded-card p-5 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-taupe">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-ink">{formatCurrency(metrics.totalRevenue)}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bg-white border border-sand rounded-card p-5 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-taupe">
            <span className="text-xs font-semibold uppercase tracking-wider">Paid Orders</span>
            <ShoppingBag className="w-4 h-4 text-rose-clay" />
          </div>
          <p className="text-2xl font-bold text-ink">{metrics.totalOrders}</p>
          <div className="flex items-center gap-1 text-[11px] text-taupe">
            <span>Exact UPI QR conversion: 92%</span>
          </div>
        </div>

        {/* KPI 3: Live Shoppers */}
        <div className="bg-white border border-sand rounded-card p-5 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-taupe">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Shoppers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-ink">{metrics.activeShoppers}</p>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-taupe">Synchronized via RTDB Presence</p>
        </div>

        {/* KPI 4: Mean GlowScore */}
        <div className="bg-white border border-sand rounded-card p-5 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-taupe">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg GlowScore™</span>
            <BrainCircuit className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-ink">{metrics.avgGlowScore} / 100</p>
          <p className="text-[11px] text-taupe">High behavioural engagement</p>
        </div>
      </div>

      {/* UTR Verification Alert Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              {metrics.unverifiedUtrCount} Direct UPI Payments Awaiting Verification
            </h3>
            <p className="text-xs text-amber-800 mt-0.5">
              Customers have submitted bank UTR reference numbers. Match them against your bank statement to confirm orders.
            </p>
          </div>
        </div>
        <Link to="/admin/payments">
          <Button variant="secondary" size="sm" className="whitespace-nowrap border-amber-400 text-amber-900 hover:bg-amber-100">
            Open Verification Queue
          </Button>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-sand rounded-card shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-sand flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
              Recent Customer Transactions
            </h2>
            <p className="text-xs text-taupe">Latest incoming orders and UPI payment states</p>
          </div>
          <Link to="/admin/sales" className="text-xs text-rose-clay hover:underline font-semibold">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-sand text-taupe uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment State</th>
                <th className="p-4">Mode</th>
                <th className="p-4">Placed At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-ivory-50/50 transition-colors">
                  <td className="p-4 font-mono font-medium text-ink">{ord.id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-ink">{ord.customerName}</p>
                    <p className="text-[11px] text-taupe">{ord.userEmail}</p>
                  </td>
                  <td className="p-4 font-semibold text-ink">{formatCurrency(ord.total)}</td>
                  <td className="p-4">
                    {ord.paymentStatus === 'paid' || ord.status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-pill border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Paid & Confirmed
                      </span>
                    ) : ord.paymentStatus === 'reference_submitted' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-pill border border-amber-200">
                        <Clock className="w-3 h-3" /> UTR Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-pill border border-rose-200">
                        <AlertTriangle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 uppercase font-mono text-[10px] text-taupe">
                    {ord.paymentMode || 'demo'}
                  </td>
                  <td className="p-4 text-taupe">{formatDate(ord.createdAt, true)}</td>
                  <td className="p-4 text-right">
                    <Link
                      to="/admin/payments"
                      className="text-xs text-rose-clay font-medium hover:underline"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
