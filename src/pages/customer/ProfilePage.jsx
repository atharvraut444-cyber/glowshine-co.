import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Sparkles, Shield, RotateCcw, Check, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { authService } from '../../services/auth/authService';

export function ProfilePage() {
  const { user, profile } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState(profile?.name || user?.displayName || '');
  const [saving, setSaving] = useState(false);

  const beautyProfile = profile?.beautyProfile;

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const res = await authService.updateName(user.uid, name);
    setSaving(false);

    if (res.success) {
      success('Name updated successfully.', 'Profile Updated');
    } else {
      toastError(res.error, 'Update Failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-sand pb-4">
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">
          Member Profile & Beauty Vault
        </h1>
        <p className="text-xs sm:text-sm text-taupe mt-1">
          Manage your account credentials and calibrated barrier diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Account Details */}
        <div className="md:col-span-6 bg-white border border-sand rounded-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-sand/60">
            <div className="w-10 h-10 rounded-full bg-ivory text-ink flex items-center justify-center font-bold font-display">
              {(profile?.name || user?.displayName || 'G')[0]}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-ink">
                {profile?.name || user?.displayName || 'Member'}
              </h2>
              <p className="text-xs text-taupe">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <Input
              label="Display Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              disabled
              value={user?.email || ''}
              helperText="Email is bound to your secure authentication provider."
            />

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={saving}
              icon={Save}
            >
              Save Profile Changes
            </Button>
          </form>
        </div>

        {/* Right Column: Beauty Profile Card */}
        <div className="md:col-span-6 bg-white border border-sand rounded-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-sand/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-clay" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                Calibrated Skin Barrier
              </h3>
            </div>
            <Link to="/quiz" className="text-xs text-rose-clay hover:underline flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              <span>Retake Quiz</span>
            </Link>
          </div>

          {beautyProfile ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-ivory rounded-subtle border border-sand/60 space-y-1">
                <p className="text-taupe uppercase tracking-wider text-[10px] font-semibold">Skin Type</p>
                <p className="text-sm font-semibold text-ink capitalize">{beautyProfile.skinType} Skin</p>
              </div>

              <div className="p-3 bg-ivory rounded-subtle border border-sand/60 space-y-1">
                <p className="text-taupe uppercase tracking-wider text-[10px] font-semibold">Primary Target Concern</p>
                <p className="text-sm font-semibold text-ink capitalize">{beautyProfile.primaryConcern?.replace('_', ' ')}</p>
              </div>

              <div className="p-3 bg-ivory rounded-subtle border border-sand/60 space-y-1">
                <p className="text-taupe uppercase tracking-wider text-[10px] font-semibold">Daily Ritual Intensity</p>
                <p className="text-sm font-semibold text-ink capitalize">{beautyProfile.routineExperience}</p>
              </div>

              {beautyProfile.sensitivities?.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <p className="text-taupe uppercase tracking-wider text-[10px] font-semibold">Saved Sensitivities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {beautyProfile.sensitivities.map((s) => (
                      <span key={s} className="bg-sand-light text-ink text-[11px] px-2.5 py-0.5 rounded-pill border border-sand">
                        {s.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-taupe">No beauty profile calibrated yet.</p>
              <Link to="/quiz">
                <Button variant="accent" size="sm">
                  Take 2-Minute Diagnostic
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
