import React, { useState } from 'react';
import { Settings, CreditCard, ShieldAlert, Save, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export function AdminSettingsPage() {
  const { success, info } = useToast();

  const [paymentMode, setPaymentMode] = useState(import.meta.env.VITE_PAYMENT_MODE || 'demo');
  const [payeeName, setPayeeName] = useState(import.meta.env.VITE_STORE_PAYEE_NAME || 'GlowShine Co.');
  const [payeeUpi, setPayeeUpi] = useState(import.meta.env.VITE_STORE_UPI_ID || 'glowshine@upi');
  const [maxOrderValue, setMaxOrderValue] = useState(100000);
  const [expiryMinutes, setExpiryMinutes] = useState(15);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('Store settings and payment configuration updated.', 'Settings Saved');
    }, 400);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-purple-100 text-purple-900 text-[11px] font-semibold uppercase tracking-wider mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>FR-ADM-18 · Operations Config</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-ink font-normal">
          Store & Payment Settings
        </h1>
        <p className="text-xs text-taupe mt-1">
          Configure UPI payment provider modes, payee credentials, and system kill switches.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* UPI Payments Configuration */}
        <div className="bg-white border border-sand rounded-card p-6 shadow-subtle space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-sand/60">
            <CreditCard className="w-4 h-4 text-rose-clay" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">
              UPI QR Payment Architecture
            </h2>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Active Payment Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'demo',
                  title: 'Demo Simulated Mode',
                  desc: 'Instant 1-click payment simulation. No real money or bank accounts required.',
                },
                {
                  id: 'direct_upi',
                  title: 'Direct UPI + UTR Queue',
                  desc: 'Direct payment to store UPI ID. Customer submits 12-digit UTR for admin approval.',
                },
                {
                  id: 'gateway',
                  title: 'Gateway Dynamic QR',
                  desc: 'Provider webhook auto-confirmation (Razorpay QR API integration).',
                },
              ].map((mode) => (
                <div
                  key={mode.id}
                  onClick={() => setPaymentMode(mode.id)}
                  className={`p-4 rounded-card border cursor-pointer transition-all ${
                    paymentMode === mode.id
                      ? 'border-purple-600 bg-purple-50/50 shadow-subtle'
                      : 'border-sand hover:border-ink bg-white'
                  }`}
                >
                  <p className="text-xs font-semibold text-ink">{mode.title}</p>
                  <p className="text-[11px] text-taupe mt-1 leading-relaxed">{mode.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Store Payee Display Name"
              type="text"
              required
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              helperText="Encoded in the UPI QR payload (pn parameter)"
            />

            <Input
              label="Store Payee UPI ID (VPA)"
              type="text"
              required
              value={payeeUpi}
              onChange={(e) => setPayeeUpi(e.target.value)}
              helperText="Destination VPA account for direct UPI transfers"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Maximum UPI Order Value (₹)"
              type="number"
              value={maxOrderValue}
              onChange={(e) => setMaxOrderValue(Number(e.target.value))}
              helperText="FR-PAY-16: Rejects transactions above NPCI limit"
            />

            <Input
              label="QR Code Session Lifetime (Minutes)"
              type="number"
              value={expiryMinutes}
              onChange={(e) => setExpiryMinutes(Number(e.target.value))}
              helperText="Unpaid orders expire and release reserved stock"
            />
          </div>
        </div>

        {/* System Operations & Maintenance */}
        <div className="bg-white border border-sand rounded-card p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-sand/60">
            <ShieldAlert className="w-4 h-4 text-status-warning" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">
              Storefront Operations
            </h2>
          </div>

          <div className="flex items-center justify-between p-3 bg-ivory rounded-subtle border border-sand/60">
            <div>
              <p className="text-xs font-semibold text-ink">Maintenance Mode Kill-Switch</p>
              <p className="text-[11px] text-taupe">Temporarily disable checkout while restocking inventory</p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`px-3 py-1 rounded-pill text-xs font-semibold transition-colors ${
                maintenanceMode
                  ? 'bg-status-error text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {maintenanceMode ? 'Active (Store Paused)' : 'Normal Operations'}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={saving}
          icon={Save}
        >
          Save Configuration Changes
        </Button>
      </form>
    </div>
  );
}

export default AdminSettingsPage;
