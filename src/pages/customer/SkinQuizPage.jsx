import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { trackEvent } from '../../services/behaviour/behaviourTracker';
import { Button } from '../../components/common/Button';

export function SkinQuizPage() {
  const navigate = useNavigate();
  const { user, profile, updateBeautyProfile, loginDemo } = useAuth();
  const { success } = useToast();

  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState(profile?.beautyProfile?.skinType || 'combination');
  const [primaryConcern, setPrimaryConcern] = useState(profile?.beautyProfile?.primaryConcern || 'hydration');
  const [sensitivities, setSensitivities] = useState(profile?.beautyProfile?.sensitivities || []);
  const [routineExperience, setRoutineExperience] = useState(profile?.beautyProfile?.routineExperience || 'intermediate');
  const [saving, setSaving] = useState(false);

  const toggleSensitivity = (item) => {
    setSensitivities((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    const beautyProfile = {
      skinType,
      primaryConcern,
      concerns: [primaryConcern],
      sensitivities,
      routineExperience,
      quizCompletedAt: new Date().toISOString(),
    };

    // If not logged in, auto-login as demo customer to preserve flow
    if (!user) {
      await loginDemo('customer');
    }

    await updateBeautyProfile(beautyProfile);

    // Track behaviour event
    trackEvent({
      eventType: 'quiz_complete',
      meta: { skinType, primaryConcern, experience: routineExperience },
    });

    // Launch confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B87568', '#CDBBA8', '#E8DED4', '#111111'],
      });
    } catch (e) {
      // ignore
    }

    setSaving(false);
    success('Beauty Profile calibrated! Viewing your personalized GlowMatch.', 'Diagnostic Complete');
    navigate('/glowmatch');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Step Tracker Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-rose-light text-rose-clay text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GlowShine Diagnostic</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">
          Formulation Compatibility Diagnostic
        </h1>
        <p className="text-xs sm:text-sm text-taupe max-w-md mx-auto">
          2 minutes to decode your epidermal barrier needs and unlock precise GlowMatch™ scores.
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto bg-sand/60 h-1.5 rounded-pill overflow-hidden mt-6">
          <div
            className="bg-rose-clay h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-taupe font-medium">Question {step} of 4</p>
      </div>

      {/* Diagnostic Card */}
      <div className="bg-white border border-sand rounded-2xl shadow-card p-6 sm:p-10 space-y-8">
        {/* Step 1: Skin Type */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-ink font-normal">
                How would you describe your skin midday?
              </h2>
              <p className="text-xs text-taupe mt-1">Select the condition that best mirrors your bare skin.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'dry', title: 'Dry & Tight', desc: 'Flakes easily, feels tight after cleansing, lacks sebum.' },
                { id: 'oily', title: 'Oily & Shiny', desc: 'Visible shine across entire face, prone to congestion and enlarged pores.' },
                { id: 'combination', title: 'Combination', desc: 'Shiny T-zone (forehead, nose, chin) with dry or normal cheeks.' },
                { id: 'sensitive', title: 'Reactive / Sensitive', desc: 'Flushes easily, stings with new actives, delicate barrier.' },
                { id: 'normal', title: 'Balanced & Normal', desc: 'Neither excessively dry nor oily, comfortable throughout the day.' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSkinType(opt.id)}
                  className={`p-4 rounded-card border cursor-pointer transition-all ${
                    skinType === opt.id
                      ? 'border-rose-clay bg-rose-light/30 shadow-subtle'
                      : 'border-sand hover:border-ink/60 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-ink">{opt.title}</h3>
                    {skinType === opt.id && <Check className="w-4 h-4 text-rose-clay" />}
                  </div>
                  <p className="text-xs text-taupe">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Primary Concern */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-ink font-normal">
                What is your primary barrier concern?
              </h2>
              <p className="text-xs text-taupe mt-1">GlowMatch will prioritize clinical actives targeting this goal.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'hydration', title: 'Deep Cellular Hydration', desc: 'Plumping parched layers with multi-weight hyaluronic acid and squalane.' },
                { id: 'barrier_repair', title: 'Restorative Barrier Repair', desc: 'Ceramide NP, oat beta-glucans and soothing ectoin to heal redness.' },
                { id: 'glow', title: 'Luminosity & Dullness', desc: 'Pure Kashmiri saffron and antioxidants for an authentic dewy glow.' },
                { id: 'pigmentation', title: 'Dark Spots & Pigmentation', desc: 'Targeting uneven skin tone and post-acne marks with gentle bio-actives.' },
                { id: 'acne_clarity', title: 'Blemish & Pore Clarity', desc: 'Niacinamide, zinc PCA, and tea tree to calm breakouts and decongest.' },
                { id: 'anti_aging', title: 'Firmness & Collagen Care', desc: 'Copper peptides and Ayurvedic Bakuchiol to support youthful elasticity.' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setPrimaryConcern(opt.id)}
                  className={`p-4 rounded-card border cursor-pointer transition-all ${
                    primaryConcern === opt.id
                      ? 'border-rose-clay bg-rose-light/30 shadow-subtle'
                      : 'border-sand hover:border-ink/60 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-ink">{opt.title}</h3>
                    {primaryConcern === opt.id && <Check className="w-4 h-4 text-rose-clay" />}
                  </div>
                  <p className="text-xs text-taupe">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Sensitivities */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-ink font-normal">
                Any formulation preferences or sensitivities?
              </h2>
              <p className="text-xs text-taupe mt-1">Select all that apply to filter incompatible ingredients.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'fragrance_free', title: 'Fragrance-Free Only', desc: 'Zero synthetic perfumes or essential oils.' },
                { id: 'alcohol_free', title: 'Drying Alcohol-Free', desc: 'No denatured ethyl alcohols that disrupt hydration.' },
                { id: 'essential_oil_free', title: 'Essential Oil-Free', desc: 'Free of citrus, lavender or botanical terpene irritants.' },
                { id: 'vegan_only', title: '100% Certified Vegan', desc: 'Strictly plant and bio-fermented ingredients.' },
              ].map((opt) => {
                const selected = sensitivities.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleSensitivity(opt.id)}
                    className={`p-4 rounded-card border cursor-pointer transition-all ${
                      selected
                        ? 'border-rose-clay bg-rose-light/30 shadow-subtle'
                        : 'border-sand hover:border-ink/60 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-ink">{opt.title}</h3>
                      {selected && <Check className="w-4 h-4 text-rose-clay" />}
                    </div>
                    <p className="text-xs text-taupe">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Routine Experience */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-ink font-normal">
                How elaborate is your daily ritual?
              </h2>
              <p className="text-xs text-taupe mt-1">We tailor ritual step counts to fit seamlessly into your lifestyle.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'beginner', title: 'Essentialist (2–3 Steps)', desc: 'Cleanse, hydrate, and shield with SPF. Quick, effortless and effective.' },
                { id: 'intermediate', title: 'Dedicated (3–4 Steps)', desc: 'Includes targeted treatment serums and barrier-balancing emulsions.' },
                { id: 'advanced', title: 'Skin Connoisseur (5+ Steps)', desc: 'Full multi-step layering: essences, peptide tonics, active oils, and mists.' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setRoutineExperience(opt.id)}
                  className={`p-4 rounded-card border cursor-pointer transition-all ${
                    routineExperience === opt.id
                      ? 'border-rose-clay bg-rose-light/30 shadow-subtle'
                      : 'border-sand hover:border-ink/60 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-ink">{opt.title}</h3>
                    {routineExperience === opt.id && <Check className="w-4 h-4 text-rose-clay" />}
                  </div>
                  <p className="text-xs text-taupe">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-sand flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              icon={ArrowLeft}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              variant="primary"
              onClick={() => setStep(step + 1)}
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="accent"
              isLoading={saving}
              onClick={handleComplete}
            >
              <span>Calibrate My GlowMatch</span>
              <Sparkles className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SkinQuizPage;
