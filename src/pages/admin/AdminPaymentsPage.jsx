import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { doc, getDocs, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate, maskUtr } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export function AdminPaymentsPage() {
  const { user } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [revealedUtrs, setRevealedUtrs] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalAction, setModalAction] = useState(null); // 'verify' | 'reject'
  const [actionLoading, setActionLoading] = useState(false);

  // Load orders with payment data
  const loadOrders = async () => {
    let list = [];
    const isDemo =
      !import.meta.env.VITE_FIREBASE_API_KEY ||
      import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoKey');
    const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';

    try {
      if (!isDemo || useEmulators) {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1200)
        );
        const snap = await Promise.race([getDocs(collection(db, 'orders')), timeoutPromise]);
        if (!snap.empty) {
          list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        }
      }
    } catch (e) {
      console.warn('[AdminPayments] Error fetching from firestore:', e.message);
    }

    // Merge local storage orders
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('order_'));
      const localOrders = keys.map((k) => JSON.parse(localStorage.getItem(k))).filter(Boolean);
      list = [...list, ...localOrders];
    } catch (e) {
      // ignore
    }

    // Deduplicate
    const seen = new Set();
    const deduped = [];
    for (const o of list) {
      if (!seen.has(o.id)) {
        seen.add(o.id);
        deduped.push(o);
      }
    }

    // Default seeded payments if empty
    if (deduped.length === 0) {
      deduped.push(
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
          referenceSubmittedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        },
        {
          id: 'ord_9182a',
          customerName: 'Aarav Mehta',
          userEmail: 'aarav@example.com',
          total: 2499,
          paymentStatus: 'paid',
          status: 'confirmed',
          paymentMode: 'gateway',
          reference: 'pay_rzp_99412',
          createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          paidAt: new Date(Date.now() - 2 * 3600 * 1000 + 45000).toISOString(),
        }
      );
    }

    deduped.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    setOrders(deduped);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const toggleRevealUtr = (id) => {
    setRevealedUtrs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirmVerify = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);

    try {
      const orderRef = doc(db, 'orders', selectedOrder.id);
      const updateData = {
        paymentStatus: 'paid',
        status: 'confirmed',
        verifiedByAdminUid: user?.uid || 'admin',
        verifiedAt: new Date().toISOString(),
      };

      if (!isDemo || useEmulators) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1500)
          );
          await Promise.race([updateDoc(orderRef, updateData), timeoutPromise]);
          // Write audit log
          await Promise.race([
            addDoc(collection(db, 'auditLogs'), {
              action: 'verify_direct_upi_payment',
              orderId: selectedOrder.id,
              amount: selectedOrder.total,
              utr: selectedOrder.utrReference,
              adminUid: user?.uid || 'admin',
              timestamp: serverTimestamp(),
            }),
            timeoutPromise,
          ]);
        } catch (e) {
          console.warn('[AdminPayments] Local fallback for verification:', e.message);
        }
      }

      // Update local storage copy
      const current = JSON.parse(localStorage.getItem(`order_${selectedOrder.id}`) || '{}');
      localStorage.setItem(
        `order_${selectedOrder.id}`,
        JSON.stringify({ ...current, ...updateData })
      );

      success(`Payment for ${selectedOrder.id} verified. Order confirmed!`, 'Verified');
      setSelectedOrder(null);
      setModalAction(null);
      loadOrders();
    } catch (err) {
      toastError(err.message, 'Verification Failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);

    try {
      const orderRef = doc(db, 'orders', selectedOrder.id);
      const updateData = {
        paymentStatus: 'unpaid',
        utrRejected: true,
        rejectionReason: 'UTR could not be matched with bank statement credit.',
        rejectedAt: new Date().toISOString(),
      };

      if (!isDemo || useEmulators) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1500)
          );
          await Promise.race([updateDoc(orderRef, updateData), timeoutPromise]);
        } catch (e) {
          // local update
        }
      }

      const current = JSON.parse(localStorage.getItem(`order_${selectedOrder.id}`) || '{}');
      localStorage.setItem(
        `order_${selectedOrder.id}`,
        JSON.stringify({ ...current, ...updateData })
      );

      info(`Payment reference rejected for order ${selectedOrder.id}.`, 'UTR Rejected');
      setSelectedOrder(null);
      setModalAction(null);
      loadOrders();
    } catch (err) {
      toastError(err.message, 'Rejection Failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return o.paymentStatus === 'reference_submitted';
    if (filterStatus === 'paid') return o.paymentStatus === 'paid';
    if (filterStatus === 'unpaid') return o.paymentStatus === 'unpaid';
    return true;
  });

  const pendingVerificationCount = orders.filter((o) => o.paymentStatus === 'reference_submitted').length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-purple-100 text-purple-900 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>FR-ADM-17 · PRD v2.1</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-normal">
            UPI Payments & Verification Queue
          </h1>
          <p className="text-xs text-taupe mt-1">
            Exact-amount UPI payments console with bank statement reference matching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-card font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>{pendingVerificationCount} Awaiting Store Verification</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-sand pb-3">
        {[
          { id: 'all', label: 'All Transactions' },
          { id: 'pending', label: `Verification Queue (${pendingVerificationCount})` },
          { id: 'paid', label: 'Confirmed & Paid' },
          { id: 'unpaid', label: 'Unpaid / Expired' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`text-xs px-3.5 py-1.5 rounded-pill font-medium transition-all ${
              filterStatus === tab.id
                ? 'bg-ink text-white shadow-subtle'
                : 'bg-white border border-sand text-ink hover:border-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-sand rounded-card shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-sand text-taupe uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order & Customer</th>
                <th className="p-4">Payable</th>
                <th className="p-4">Mode</th>
                <th className="p-4">Status</th>
                <th className="p-4">UTR Reference (SEC-17)</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-taupe">
                    No payment records match this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isRevealed = revealedUtrs[ord.id];
                  const utr = ord.utrReference || ord.reference;

                  return (
                    <tr key={ord.id} className="hover:bg-ivory-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-mono font-medium text-ink">{ord.id}</p>
                        <p className="font-semibold text-ink mt-0.5">{ord.customerName}</p>
                        <p className="text-[11px] text-taupe">{ord.userEmail}</p>
                      </td>
                      <td className="p-4 font-bold text-ink text-sm">
                        {formatCurrency(ord.total)}
                      </td>
                      <td className="p-4 uppercase font-mono text-[10px] text-taupe">
                        {ord.paymentMode || 'demo'}
                      </td>
                      <td className="p-4">
                        {ord.paymentStatus === 'paid' || ord.status === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-pill border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        ) : ord.paymentStatus === 'reference_submitted' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-pill border border-amber-200 animate-pulse">
                            <Clock className="w-3 h-3" /> UTR Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-pill border border-rose-200">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-xs">
                        {utr ? (
                          <div className="flex items-center gap-2">
                            <span>{isRevealed ? utr : maskUtr(utr)}</span>
                            <button
                              onClick={() => toggleRevealUtr(ord.id)}
                              className="text-taupe hover:text-ink p-1"
                              title={isRevealed ? 'Mask UTR' : 'Unmask UTR'}
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-taupe italic">No reference</span>
                        )}
                      </td>
                      <td className="p-4 text-taupe">
                        {formatDate(ord.referenceSubmittedAt || ord.createdAt, true)}
                      </td>
                      <td className="p-4 text-right">
                        {ord.paymentStatus === 'reference_submitted' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="accent"
                              size="sm"
                              className="text-[11px] py-1 bg-emerald-700 hover:bg-emerald-800"
                              onClick={() => {
                                setSelectedOrder(ord);
                                setModalAction('verify');
                              }}
                            >
                              Confirm Paid
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[11px] py-1 text-status-error hover:bg-red-50 border-red-200"
                              onClick={() => {
                                setSelectedOrder(ord);
                                setModalAction('reject');
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-taupe text-[11px]">
                            {ord.paymentStatus === 'paid' ? 'Settled' : 'Awaiting payment'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => {
            setSelectedOrder(null);
            setModalAction(null);
          }}
          title={modalAction === 'verify' ? 'Confirm Payment & Fulfill Order' : 'Reject UTR Reference'}
          subtitle={`Order ${selectedOrder.id} · ${formatCurrency(selectedOrder.total)}`}
        >
          {modalAction === 'verify' ? (
            <div className="space-y-4 text-xs text-taupe">
              <p>
                Have you verified that the bank or UPI merchant statement has credited <strong className="text-ink">{formatCurrency(selectedOrder.total)}</strong> with reference <strong className="font-mono text-ink">{selectedOrder.utrReference}</strong>?
              </p>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-subtle text-emerald-900 leading-relaxed">
                Confirming will set order status to <span className="font-bold">PAID</span>, trigger inventory allocation, and notify the customer.
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  className="bg-emerald-700 hover:bg-emerald-800"
                  isLoading={actionLoading}
                  onClick={handleConfirmVerify}
                >
                  Confirm & Mark Paid
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs text-taupe">
              <p>
                Are you sure you want to reject reference <strong className="font-mono text-ink">{selectedOrder.utrReference}</strong>? The order will revert to unpaid status and the customer will be requested to resubmit a valid bank reference.
              </p>
              <div className="flex justify-end gap-2 pt-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  isLoading={actionLoading}
                  onClick={handleConfirmReject}
                >
                  Reject Reference
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default AdminPaymentsPage;
