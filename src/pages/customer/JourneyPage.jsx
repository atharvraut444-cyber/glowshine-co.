import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, CheckCircle2, PackageCheck, Heart, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/common/Button';

export function JourneyPage() {
  const { user, profile } = useAuth();
  const { wishlistItems } = useCart();

  const beautyProfile = profile?.beautyProfile;

  const milestones = [
    {
      title: 'Joined the GlowShine Collective',
      desc: user ? `Registered with ${user.email}` : 'Browse as guest',
      completed: Boolean(user),
      date: 'Step 1',
    },
    {
      title: 'Epidermal Diagnostic Completed',
      desc: beautyProfile
        ? `Calibrated for ${beautyProfile.skinType} skin targeting ${beautyProfile.primaryConcern?.replace('_', ' ')}`
        : 'Take the 2-minute skin diagnostic to personalize matching',
      completed: Boolean(beautyProfile),
      date: 'Step 2',
      action: !beautyProfile ? '/quiz' : null,
      actionText: 'Take Quiz',
    },
    {
      title: 'Botanical Formulations Saved',
      desc: wishlistItems.length > 0
        ? `${wishlistItems.length} products bookmarked in your beauty vault`
        : 'Save your favorite barrier treatments while browsing',
      completed: wishlistItems.length > 0,
      date: 'Step 3',
      action: wishlistItems.length === 0 ? '/shop' : '/wishlist',
      actionText: wishlistItems.length === 0 ? 'Explore Shop' : 'View Saved',
    },
    {
      title: 'Exact-Amount UPI QR Checkout',
      desc: 'Complete an order through our seamless UPI QR scan experience',
      completed: false,
      date: 'Step 4',
      action: '/shop',
      actionText: 'Shop Formulations',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-sand pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs text-rose-clay font-semibold uppercase tracking-wider mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>Beauty Intelligence Evolution</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">
          Your Beauty Journey
        </h1>
        <p className="text-xs sm:text-sm text-taupe mt-1">
          Watch how GlowShine adapts to your skin as your interaction history and feedback grow.
        </p>
      </div>

      {/* Engagement Card */}
      <div className="bg-white border border-sand rounded-2xl p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] uppercase tracking-widest text-taupe font-semibold">Active Behavioral Affinity</span>
          <h3 className="font-display text-2xl text-ink font-normal">GlowScore™ 88 / 100</h3>
          <p className="text-xs text-taupe max-w-md">
            Your high affinity for restorative ceramides and clean chemical filters continuously sharpens our recommendation ranking.
          </p>
        </div>
        <div className="w-20 h-20 rounded-full border-4 border-rose-subtle border-t-rose-clay flex items-center justify-center font-bold text-lg text-ink">
          88%
        </div>
      </div>

      {/* Timeline Milestones */}
      <div className="space-y-6">
        <h2 className="font-display text-xl text-ink font-normal">
          Milestones & Discoveries
        </h2>

        <div className="relative border-l-2 border-sand/80 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  m.completed
                    ? 'bg-rose-clay border-rose-clay text-white shadow-subtle'
                    : 'bg-white border-sand text-sand-dark'
                }`}
              >
                {m.completed && <CheckCircle2 className="w-3 h-3" />}
              </div>

              <div className="surface-card rounded-card p-5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm font-semibold text-ink">{m.title}</h3>
                  <span className="text-[11px] text-taupe font-mono">{m.date}</span>
                </div>
                <p className="text-xs text-taupe leading-relaxed">{m.desc}</p>

                {m.action && (
                  <div className="pt-2">
                    <Link to={m.action}>
                      <Button variant="outline" size="sm">
                        <span>{m.actionText}</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JourneyPage;
