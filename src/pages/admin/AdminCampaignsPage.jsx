import React from 'react';
import { Sparkles, Calendar, Tag, Plus, Check } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export function AdminCampaignsPage() {
  const campaigns = [
    {
      id: 'cmp_barrier_first',
      name: 'Hydration & Barrier Renewal Week',
      discount: '15% Off Ceramides & Hydrators',
      target: 'Segment: High-Intent Barrier Seekers',
      status: 'active',
      validUntil: '14 Oct 2026',
      redemptions: 48,
    },
    {
      id: 'cmp_quiz_welcome',
      name: 'Diagnostic Graduate Welcome Gift',
      discount: 'Complimentary Travel Sized Squalane with 1st Order',
      target: 'Newly Calibrated Seekers',
      status: 'active',
      validUntil: '31 Dec 2026',
      redemptions: 92,
    },
    {
      id: 'cmp_monsoon_glow',
      name: 'Monsoon Clarity Protocol',
      discount: '10% Off Niacinamide & Zinc Clarifying Regimen',
      target: 'Oily & Combination Profiles',
      status: 'draft',
      validUntil: '30 Nov 2026',
      redemptions: 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-normal">
            Campaigns & Personalization Rules
          </h1>
          <p className="text-xs text-taupe mt-1">
            Deterministic marketing rules targeting specific behavioural segments.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus}>
          New Campaign Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((cmp) => (
          <div
            key={cmp.id}
            className="bg-white border border-sand rounded-card p-6 shadow-subtle space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={cmp.status === 'active' ? 'success' : 'sand'}>
                  {cmp.status === 'active' ? 'Live & Active' : 'Draft'}
                </Badge>
                <span className="text-[11px] font-mono text-taupe">{cmp.validUntil}</span>
              </div>

              <h3 className="font-display text-lg text-ink font-normal">{cmp.name}</h3>
              <p className="text-xs font-semibold text-rose-clay">{cmp.discount}</p>
              <p className="text-xs text-taupe">{cmp.target}</p>
            </div>

            <div className="pt-3 border-t border-sand/60 flex items-center justify-between text-xs text-taupe">
              <span>Redemptions: <strong className="text-ink">{cmp.redemptions}</strong></span>
              <button className="text-rose-clay font-medium hover:underline text-[11px]">
                Edit Rule →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCampaignsPage;
