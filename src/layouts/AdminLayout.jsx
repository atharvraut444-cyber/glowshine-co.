import React, { useState, Suspense } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  BrainCircuit,
  Users,
  Package,
  Sparkles,
  Activity,
  Settings,
  Store,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const paymentMode = import.meta.env.VITE_PAYMENT_MODE || 'demo';

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Sales & Orders', path: '/admin/sales', icon: TrendingUp },
    { label: 'Payments & UTR Queue', path: '/admin/payments', icon: CreditCard, badge: 'v2.1' },
    { label: 'Behaviour Engine', path: '/admin/behaviour', icon: BrainCircuit },
    { label: 'Customer Segments', path: '/admin/customers', icon: Users },
    { label: 'Catalogue & Stock', path: '/admin/products', icon: Package },
    { label: 'Campaigns & Rules', path: '/admin/campaigns', icon: Sparkles },
    { label: 'Live Store Activity', path: '/admin/live', icon: Activity },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#F3F4F6] text-ink antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-ink text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="h-18 px-6 flex items-center justify-between border-b border-white/10">
            <div>
              <span className="font-display text-lg tracking-[0.18em] text-white">
                GLOWSHINE
              </span>
              <p className="text-[10px] tracking-widest text-sand/60 uppercase">
                Admin Console
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-sand/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-subtle text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-rose-clay text-white shadow-subtle'
                      : 'text-sand/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-pill bg-white/20 text-white font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Active Payment Mode Status */}
          <div className="px-3 py-2 rounded-subtle bg-white/5 border border-white/10 text-[11px] text-sand/80 flex items-center justify-between">
            <span className="text-sand/60">Payment Mode:</span>
            <span className="font-mono uppercase font-semibold text-rose-subtle">
              {paymentMode}
            </span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-sand/80 hover:text-white hover:bg-white/10 rounded-subtle transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>View Storefront</span>
          </Link>

          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-subtle hover:text-white hover:bg-white/10 rounded-subtle transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-sand/70 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-ink hover:bg-sand/30 rounded-subtle"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700 hidden sm:inline" />
              <span className="text-xs font-semibold text-ink uppercase tracking-wider">
                Retail Intelligence & Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime System Online</span>
            </span>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-ink">
                {profile?.name || user?.displayName || 'Administrator'}
              </span>
              <span className="text-[10px] text-taupe">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Suspense
            fallback={
              <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-sand border-t-rose-clay animate-spin" />
                <span className="text-xs uppercase tracking-widest text-taupe font-medium">Loading console view...</span>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
