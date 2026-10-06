import React, { useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/customer/Navbar';
import Footer from '../components/customer/Footer';
import CartDrawer from '../components/customer/CartDrawer';
import { trackEvent } from '../services/behaviour/behaviourTracker';

function SubpageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-8 h-8 rounded-full border-2 border-sand border-t-rose-clay animate-spin" />
      <span className="text-xs uppercase tracking-widest text-taupe font-medium">Loading formulation...</span>
    </div>
  );
}

export function CustomerLayout() {
  const location = useLocation();

  // Track page_view on route transition
  useEffect(() => {
    trackEvent({
      eventType: 'page_view',
      meta: { path: location.pathname, search: location.search },
    });
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ink selection:bg-rose-clay selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<SubpageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}

export default CustomerLayout;
