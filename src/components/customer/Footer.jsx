import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function Footer() {
  const [email, setEmail] = useState('');
  const { success } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      success('Thank you for joining our beauty collective. Your welcome gift is on its way.', 'Subscribed');
      setEmail('');
    }
  };

  return (
    <footer className="bg-ink text-white border-t border-sand/20 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Ethos & Newsletter Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-display text-2xl tracking-[0.2em] font-normal text-white">
              GLOWSHINE CO.
            </span>
            <p className="text-sand/80 text-sm max-w-sm leading-relaxed">
              Beauty on the surface. Intelligence underneath. Clean, botanical-first formulations curated dynamically around your skin’s changing barrier and climate needs.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-sand/60">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-clay" /> 100% Cruelty-Free
              </span>
              <span>·</span>
              <span>Dermatologically Evaluated</span>
              <span>·</span>
              <span>Non-Comedogenic</span>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-card max-w-xl">
              <h4 className="font-display text-lg text-white font-normal">
                Receive personalized formulation drops & skin science
              </h4>
              <p className="text-xs text-sand/70 mt-1 mb-4">
                Be the first to access limited batch botanical extraits and private member discounts.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-subtle text-sm text-white placeholder:text-sand/40 focus:outline-none focus:border-rose-clay"
                />
                <button
                  type="submit"
                  className="btn-accent px-5 text-xs uppercase tracking-wider font-semibold"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-xs">
          <div>
            <h5 className="font-semibold uppercase tracking-widest text-white mb-4">Discovery</h5>
            <ul className="space-y-2.5 text-sand/70">
              <li><Link to="/shop?category=skincare" className="hover:text-white transition-colors">Barrier Skincare</Link></li>
              <li><Link to="/shop?category=haircare" className="hover:text-white transition-colors">Scalp & Hair Tonics</Link></li>
              <li><Link to="/shop?category=bodycare" className="hover:text-white transition-colors">Botanical Body Care</Link></li>
              <li><Link to="/shop?category=fragrance" className="hover:text-white transition-colors">Artisanal Fragrance</Link></li>
              <li><Link to="/shop?category=suncare" className="hover:text-white transition-colors">Invisible Sun Fluid</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold uppercase tracking-widest text-white mb-4">Beauty Intelligence</h5>
            <ul className="space-y-2.5 text-sand/70">
              <li><Link to="/quiz" className="hover:text-white transition-colors">2-Minute Skin Quiz</Link></li>
              <li><Link to="/glowmatch" className="hover:text-white transition-colors">GlowMatch™ Engine</Link></li>
              <li><Link to="/routine" className="hover:text-white transition-colors">GlowRoutine™ Builder</Link></li>
              <li><Link to="/journey" className="hover:text-white transition-colors">Customer Journey</Link></li>
              <li><Link to="/offers" className="hover:text-white transition-colors">Personalized Offers</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold uppercase tracking-widest text-white mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-sand/70">
              <li><Link to="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Shipping & Returns</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Exact UPI QR FAQs</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Contact Care Concierge</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Formulation Transparency</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold uppercase tracking-widest text-white mb-4">Payment & Trust</h5>
            <div className="space-y-3 text-sand/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Exact-Amount UPI QR</span>
              </div>
              <p className="text-[11px] text-sand/60 leading-relaxed">
                Pay directly through Google Pay, PhonePe, Paytm, or BHIM. GlowShine never asks for or stores UPI PINs or card details.
              </p>
              <div className="pt-2 text-[10px] text-sand/40">
                <span>NPCI UPI Specification · 256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Academic Project Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sand/60 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} GlowShine Co. All rights reserved.</p>

          <div className="flex items-center gap-1.5 text-sand/80">
            <span>Engineered by</span>
            <span className="text-white font-medium">Chetann</span>
            <span>·</span>
            <span>Computer Engineering, VIT Pune</span>
          </div>

          <div className="flex items-center gap-4 text-sand/60">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
