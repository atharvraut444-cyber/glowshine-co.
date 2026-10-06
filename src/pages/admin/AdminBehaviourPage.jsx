import React from 'react';
import { BrainCircuit, Activity, Sparkles, Filter, Users, ArrowUpRight, BarChart2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export function AdminBehaviourPage() {
  const eventMetrics = [
    { type: 'page_view', count: 14820, percent: '48.2%', desc: 'Storefront navigation & discovery' },
    { type: 'product_view', count: 8320, percent: '27.1%', desc: 'Detailed formulation inspections' },
    { type: 'cart_add', count: 2190, percent: '7.1%', desc: 'Bag additions (+15 GlowScore points)' },
    { type: 'quiz_complete', count: 1840, percent: '6.0%', desc: 'Diagnostic profile completions' },
    { type: 'wishlist_add', count: 1420, percent: '4.6%', desc: 'Formulations saved to beauty vault' },
    { type: 'checkout_start', count: 1210, percent: '3.9%', desc: 'Shipping address and order inits' },
    { type: 'recommendation_click', count: 940, percent: '3.1%', desc: 'GlowMatch recommendations clicked' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-purple-100 text-purple-900 text-[11px] font-semibold uppercase tracking-wider mb-1">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Rule-Based Behaviour Intelligence</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-ink font-normal">
          Behavioural Engine & GlowScore™ Telemetry
        </h1>
        <p className="text-xs text-taupe mt-1">
          Every customer event is processed to adjust affinity scores and trigger deterministic recommendations.
        </p>
      </div>

      {/* Top Engine Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-sand rounded-card p-5 shadow-subtle space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-taupe">Total Tracked Events</span>
          <p className="text-2xl font-bold text-ink">30,740</p>
          <p className="text-[11px] text-emerald-700 font-medium">+2,400 in last 24h</p>
        </div>

        <div className="bg-white border border-sand rounded-card p-5 shadow-subtle space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-taupe">Active GlowIntent Users</span>
          <p className="text-2xl font-bold text-ink">142</p>
          <p className="text-[11px] text-taupe">Shoppers with Intent Score ≥ 80</p>
        </div>

        <div className="bg-white border border-sand rounded-card p-5 shadow-subtle space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-taupe">Avg GlowScore™</span>
          <p className="text-2xl font-bold text-ink">84.2 / 100</p>
          <p className="text-[11px] text-taupe">Calculated across active members</p>
        </div>

        <div className="bg-white border border-sand rounded-card p-5 shadow-subtle space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-taupe">Lost Sales Protected</span>
          <p className="text-2xl font-bold text-ink">28</p>
          <p className="text-[11px] text-purple-700 font-medium">Auto-targeted with dynamic offers</p>
        </div>
      </div>

      {/* Scoring Weights Architecture Box */}
      <div className="bg-white border border-sand rounded-card p-6 shadow-subtle space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink pb-2 border-b border-sand/60">
          Deterministic Scoring Matrix (Architecture Rule ADR-07)
        </h2>
        <p className="text-xs text-taupe leading-relaxed">
          GlowShine Co. relies strictly on transparent, deterministic behavioral scoring rather than opaque black-box models. Weights are calibrated server-side:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-ivory rounded-subtle border border-sand/50">
            <span className="text-[10px] text-taupe uppercase font-semibold">Diagnostic Quiz</span>
            <p className="text-lg font-bold text-ink mt-0.5">+25 Pts</p>
            <p className="text-[11px] text-taupe">Establishes barrier baseline</p>
          </div>
          <div className="p-3 bg-ivory rounded-subtle border border-sand/50">
            <span className="text-[10px] text-taupe uppercase font-semibold">Cart Addition</span>
            <p className="text-lg font-bold text-ink mt-0.5">+15 Pts</p>
            <p className="text-[11px] text-taupe">High commercial purchase intent</p>
          </div>
          <div className="p-3 bg-ivory rounded-subtle border border-sand/50">
            <span className="text-[10px] text-taupe uppercase font-semibold">Wishlist Bookmark</span>
            <p className="text-lg font-bold text-ink mt-0.5">+10 Pts</p>
            <p className="text-[11px] text-taupe">Product affinity & recall</p>
          </div>
          <div className="p-3 bg-ivory rounded-subtle border border-sand/50">
            <span className="text-[10px] text-taupe uppercase font-semibold">Deep Inspection</span>
            <p className="text-lg font-bold text-ink mt-0.5">+5 Pts</p>
            <p className="text-[11px] text-taupe">Ingredient & formulation dwell</p>
          </div>
        </div>
      </div>

      {/* Events Breakdown Table */}
      <div className="bg-white border border-sand rounded-card shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-sand">
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
            Telemetry Event Distribution
          </h2>
          <p className="text-xs text-taupe">Aggregated from append-only behaviourEvents collection</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-sand text-taupe uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Event Type</th>
                <th className="p-4">Volume</th>
                <th className="p-4">Share of Activity</th>
                <th className="p-4">System Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {eventMetrics.map((em) => (
                <tr key={em.type} className="hover:bg-ivory-50/50 transition-colors">
                  <td className="p-4 font-mono font-semibold text-ink">{em.type}</td>
                  <td className="p-4 font-bold text-ink">{em.count.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-sand/60 h-1.5 rounded-pill overflow-hidden">
                        <div className="bg-rose-clay h-full" style={{ width: em.percent }} />
                      </div>
                      <span className="font-medium text-ink">{em.percent}</span>
                    </div>
                  </td>
                  <td className="p-4 text-taupe">{em.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBehaviourPage;
