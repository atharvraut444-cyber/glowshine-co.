import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  LogOut,
  PackageCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAdmin, logout } = useAuth();
  const { itemCount, openCart } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/face?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchBarOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'FACE', path: '/face' },
    { label: 'HAIR', path: '/hair' },
    { label: 'BODY', path: '/body' },
    { label: 'FRAGRANCE', path: '/fragrance' },
    { label: 'RITUALS & SETS', path: '/rituals' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#EBE7DF] transition-all">
      {/* Top Banner Ticker */}
      <div className="bg-ink text-white py-1 px-4 text-center text-[10px] sm:text-[11px] tracking-widest uppercase font-medium flex items-center justify-center gap-2">
        <span>Complimentary Express Delivery on orders above ₹999</span>
        <span className="hidden sm:inline text-sand/60">·</span>
        <span className="hidden sm:inline text-rose-subtle">Instant UPI QR Checkout</span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-ink hover:text-stone-600 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo - ✦ GlowShine Co. */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-stone-800 text-lg group-hover:rotate-12 transition-transform duration-300">
            ✦
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink group-hover:text-stone-700 transition-colors">
            GlowShine Co.
          </span>
        </Link>

        {/* Desktop Navigation Links (Only HOME | FACE | HAIR | BODY | FRAGRANCE | RITUALS & SETS) */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.label}
                to={link.path}
                className={`text-[12px] uppercase tracking-[0.16em] font-medium transition-all relative py-1 ${
                  isActive
                    ? 'text-ink font-semibold border-b-2 border-stone-800'
                    : 'text-stone-500 hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Search, User, Cart) */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Admin badge link */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold hover:bg-purple-100 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
              <span>Admin</span>
            </Link>
          )}

          {/* Search Button */}
          <button
            onClick={() => setSearchBarOpen(!searchBarOpen)}
            className="p-1.5 text-stone-700 hover:text-ink transition-colors"
            aria-label="Search formulations"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="p-1.5 text-stone-700 hover:text-ink transition-colors flex items-center gap-1"
              aria-label="User account"
            >
              <User className="w-5 h-5" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-card shadow-dropdown border border-sand py-2 z-50 animate-in fade-in"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-sand/60">
                      <p className="text-xs font-semibold text-ink truncate">
                        {profile?.name || user.displayName || 'Patron'}
                      </p>
                      <p className="text-[11px] text-taupe truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-ink hover:bg-sand-light transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-taupe" />
                      <span>Beauty Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-ink hover:bg-sand-light transition-colors"
                    >
                      <PackageCheck className="w-3.5 h-3.5 text-taupe" />
                      <span>Order History</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-purple-900 font-semibold hover:bg-purple-50 transition-colors"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
                        <span>Admin Console</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-clay hover:bg-rose-light/40 transition-colors border-t border-sand/60 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b border-sand/60 text-xs text-taupe">
                      Welcome to GlowShine Co.
                    </div>
                    <Link
                      to="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-ink hover:bg-sand-light transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-taupe hover:bg-sand-light transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Bag Icon with Badge */}
          <button
            onClick={openCart}
            className="p-1.5 text-stone-700 hover:text-ink transition-colors relative"
            aria-label="Open shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {searchBarOpen && (
        <div className="border-t border-sand bg-ivory px-4 py-3 sm:px-8 animate-in slide-in-from-top-2">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-taupe" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulations across Face, Hair, Body, Fragrance..."
              className="flex-1 bg-transparent border-none text-sm text-ink placeholder:text-taupe focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-taupe hover:text-ink text-xs"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchBarOpen(false)}
              className="text-taupe hover:text-ink ml-2 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sand bg-white px-6 py-6 space-y-4 animate-in slide-in-from-top-2 shadow-dropdown">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm uppercase tracking-widest font-medium py-1.5 transition-colors ${
                    isActive ? 'text-ink font-semibold' : 'text-stone-500'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
