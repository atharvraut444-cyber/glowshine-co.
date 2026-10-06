import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  LogOut,
  PackageCheck,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAdmin, logout } = useAuth();
  const { itemCount, wishlistItems, openCart } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchBarOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Shop All', path: '/shop' },
    { label: 'Skincare', path: '/shop?category=skincare' },
    { label: 'Haircare', path: '/shop?category=haircare' },
    { label: 'Body Care', path: '/shop?category=bodycare' },
    { label: 'GlowMatch™', path: '/glowmatch' },
    { label: 'Glow Quiz', path: '/quiz' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sand transition-all">
      {/* Top Banner Ticker */}
      <div className="bg-ink text-white py-1.5 px-4 text-center text-[11px] tracking-widest uppercase font-medium flex items-center justify-center gap-2">
        <span>Complimentary Express Delivery on orders above ₹999</span>
        <span className="hidden sm:inline text-sand/60">·</span>
        <span className="hidden sm:inline text-rose-subtle">Exact-amount instant UPI QR checkout</span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-ink hover:text-rose-clay transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex flex-col items-center sm:items-start group">
          <span className="font-display text-2xl sm:text-2xl tracking-[0.2em] font-normal text-ink group-hover:text-rose-clay transition-colors">
            GLOWSHINE CO.
          </span>
          <span className="text-[9px] tracking-[0.25em] text-taupe uppercase -mt-0.5 font-medium">
            Beauty Intelligence
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname + location.search === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-rose-clay relative py-1 ${
                  isActive ? 'text-rose-clay font-semibold' : 'text-ink'
                }`}
              >
                {link.label}
                {link.label.includes('GlowMatch') && (
                  <span className="absolute -top-1.5 -right-3 w-1.5 h-1.5 rounded-full bg-rose-clay animate-ping" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Search, Wishlist, Cart, User) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Admin badge link */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold hover:bg-purple-100 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
              <span>Admin Console</span>
            </Link>
          )}

          {/* Search Toggle */}
          <button
            onClick={() => setSearchBarOpen(!searchBarOpen)}
            className="p-2 text-ink hover:text-rose-clay transition-colors"
            aria-label="Search products"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="p-2 text-ink hover:text-rose-clay transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-clay text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Bag / Cart Icon */}
          <button
            onClick={openCart}
            className="p-2 text-ink hover:text-rose-clay transition-colors relative"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-ink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="p-1.5 rounded-full border border-sand hover:border-ink transition-colors flex items-center justify-center text-ink bg-ivory"
              aria-label="Account options"
            >
              <User className="w-4 h-4" />
            </button>

            {userDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-sand rounded-card shadow-elevated py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-sand/50">
                        <p className="text-xs font-semibold text-ink truncate">
                          {profile?.name || user.displayName || 'Glow Member'}
                        </p>
                        <p className="text-[11px] text-taupe truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-purple-800 hover:bg-purple-50"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-ink hover:bg-ivory"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-rose-clay" />
                        <span>Beauty Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-ink hover:bg-ivory"
                      >
                        <PackageCheck className="w-3.5 h-3.5 text-taupe" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/journey"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-ink hover:bg-ivory"
                      >
                        <Compass className="w-3.5 h-3.5 text-taupe" />
                        <span>Beauty Journey</span>
                      </Link>

                      <div className="border-t border-sand/50 my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-status-error hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-sand/50">
                        <p className="text-xs font-semibold text-ink">Welcome to GlowShine</p>
                        <p className="text-[11px] text-taupe">Sign in for personalized routines</p>
                      </div>
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-ink hover:bg-ivory"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-rose-clay hover:bg-ivory"
                      >
                        Create an Account
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchBarOpen && (
        <div className="border-t border-sand bg-ivory-50 px-4 py-3 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-taupe" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ingredient (e.g. Squalane, Ceramides) or concern..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-sand rounded-subtle text-sm text-ink placeholder:text-taupe/60 focus:outline-none focus:border-ink"
              />
            </div>
            <button
              type="submit"
              className="btn-primary text-xs px-4 py-2"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sand bg-white px-5 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-wider text-ink hover:text-rose-clay py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-sand space-y-2">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-purple-800 bg-purple-50 p-2.5 rounded-subtle"
              >
                <ShieldAlert className="w-4 h-4 text-purple-700" />
                <span>Admin Console</span>
              </Link>
            )}
            <Link
              to="/quiz"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs font-medium text-rose-clay bg-rose-light p-2.5 rounded-subtle"
            >
              <span>Take the 2-Minute Skin Quiz</span>
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
