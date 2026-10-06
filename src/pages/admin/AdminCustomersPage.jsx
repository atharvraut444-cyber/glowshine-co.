import React from 'react';
import { Users, Sparkles, TrendingUp, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export function AdminCustomersPage() {
  const segments = [
    {
      id: 'high_intent_explorers',
      name: 'High-Intent Barrier Seekers',
      criteria: 'GlowScore ≥ 80 · 3+ Ceramide/Barrier views in last 48h · Cart uncompleted',
      userCount: 42,
      aov: '₹1,850',
      action: 'Automated 10% Barrier Recovery Campaign Triggered',
      badge: 'High Value',
      badgeVariant: 'match',
    },
    {
      id: 'loyal_skincare_devotees',
      name: 'Loyal Botanical Connoisseurs',
      criteria: '2+ completed UPI orders · RFM Score Top 10% · High NPS',
      userCount: 78,
      aov: '₹2,640',
      action: 'Priority Access to Limited Batch Saffron Harvest Drop',
      badge: 'VIP Tier',
      badgeVariant: 'success',
    },
    {
      id: 'first_time_diagnostic_takers',
      name: 'Newly Calibrated Seekers',
      criteria: 'Skin Quiz completed in last 72 hours · Zero orders placed',
      userCount: 114,
      aov: '₹0 (Prospect)',
      action: 'Welcome Routine Builder Prompt in Notification Drawer',
      badge: 'Onboarding',
      badgeVariant: 'info',
    },
    {
      id: 'dormant_glowers',
      name: 'Dormant Cart Explorers',
      criteria: 'No visit in 30 days · Previously had item in bag',
      userCount: 35,
      aov: '₹1,200',
      action: 'Complimentary Express Delivery Re-Engagement Offer',
      badge: 'At Risk',
      badgeVariant: 'warning',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-purple-100 text-purple-900 text-[11px] font-semibold uppercase tracking-wider mb-1">
          <Users className="w-3.5 h-3.5" />
          <span>Dynamic RFM & Behavioral Segments</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-ink font-normal">
          Customer Intelligence & Segments
        </h1>
        <p className="text-xs text-taupe mt-1">
          Real-time customer cohorts segmented dynamically by browsing frequency, formulation focus, and RFM scores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {segments.map((seg) => (
          <div
            key={seg.id}
            className="bg-white border border-sand rounded-card p-6 shadow-subtle space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={seg.badgeVariant}>{seg.badge}</Badge>
                <span className="font-mono text-xs font-bold text-ink">
                  {seg.userCount} Members
                </span>
              </div>

              <h3 className="font-display text-lg text-ink font-normal">{seg.name}</h3>
              <p className="text-xs text-taupe leading-relaxed">
                <span className="font-semibold text-ink">Criteria:</span> {seg.criteria}
              </p>
            </div>

            <div className="pt-3 border-t border-sand/60 space-y-2 text-xs">
              <div className="flex justify-between text-taupe">
                <span>Cohort Mean AOV:</span>
                <span className="font-semibold text-ink">{seg.aov}</span>
              </div>
              <div className="p-2.5 bg-ivory rounded-subtle border border-sand/60 text-[11px] text-ink flex items-center justify-between">
                <span>{seg.action}</span>
                <Sparkles className="w-3 h-3 text-rose-clay shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCustomersPage;
