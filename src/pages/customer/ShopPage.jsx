import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { productService } from '../../services/products/productService';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, BRANDS, SKIN_TYPES, SKIN_CONCERNS, MOCK_PRODUCTS } from '../../data/mockProducts';
import ProductCard from '../../components/customer/ProductCard';
import { ProductCardSkeleton } from '../../components/common/Skeleton';
import { Button } from '../../components/common/Button';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile } = useAuth();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSkinType = searchParams.get('skinType') || 'all';
  const currentConcern = searchParams.get('concern') || 'all';
  const currentBrand = searchParams.get('brand') || 'all';
  const currentSort = searchParams.get('sort') || 'featured';

  const [products, setProducts] = useState(() => MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadFilteredProducts() {
      const res = await productService.getProducts({
        category: currentCategory,
        skinType: currentSkinType,
        concern: currentConcern,
        brand: currentBrand,
        search: currentSearch,
        sortBy: currentSort,
        beautyProfile: profile?.beautyProfile,
      });
      setProducts(res.products);
      setLoading(false);
    }
    loadFilteredProducts();
  }, [currentCategory, currentSkinType, currentConcern, currentBrand, currentSearch, currentSort, profile?.beautyProfile]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    currentCategory !== 'all' ||
    currentSkinType !== 'all' ||
    currentConcern !== 'all' ||
    currentBrand !== 'all' ||
    Boolean(currentSearch);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-sand pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal">
              {currentCategory !== 'all'
                ? CATEGORIES.find((c) => c.slug === currentCategory)?.name || 'Formulations'
                : 'All Formulations'}
            </h1>
            <p className="text-xs sm:text-sm text-taupe mt-1 max-w-xl">
              Botanical-first, clinically balanced formulas. Clean actives targeted to respect your skin's natural lipid barrier.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-taupe whitespace-nowrap">
              {loading ? 'Finding formulations...' : `${products.length} Products`}
            </span>

            {/* Sort Select */}
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="text-xs font-medium bg-white border border-sand rounded-subtle px-3 py-2 text-ink focus:outline-none focus:border-ink cursor-pointer"
            >
              <option value="featured">Featured / Bestsellers</option>
              <option value="match">Highest GlowMatch™</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">New Releases</option>
            </select>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2 border border-sand bg-white rounded-subtle text-ink flex items-center gap-1.5 text-xs font-medium"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => updateParam('category', cat.slug)}
                className={`text-xs px-4 py-1.5 rounded-pill whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? 'bg-ink text-white shadow-subtle'
                    : 'bg-white border border-sand text-ink hover:border-ink'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid with Sidebar Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white border border-sand p-6 rounded-card">
          <div className="flex items-center justify-between pb-3 border-b border-sand/60">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-ink flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-rose-clay" />
              <span>Refine Formulation</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-rose-clay hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Skin Type Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">Skin Type</h4>
            <div className="space-y-1">
              {SKIN_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 text-xs text-taupe cursor-pointer hover:text-ink">
                  <input
                    type="radio"
                    name="skinType"
                    checked={currentSkinType === type}
                    onChange={() => updateParam('skinType', type)}
                    className="accent-rose-clay"
                  />
                  <span className="capitalize">{type === 'all' ? 'All Skin Types' : `${type} Skin`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skin Concern Filter */}
          <div className="space-y-2 pt-4 border-t border-sand/40">
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">Primary Concern</h4>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs text-taupe cursor-pointer hover:text-ink">
                <input
                  type="radio"
                  name="concern"
                  checked={currentConcern === 'all'}
                  onChange={() => updateParam('concern', 'all')}
                  className="accent-rose-clay"
                />
                <span>All Concerns</span>
              </label>
              {SKIN_CONCERNS.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-xs text-taupe cursor-pointer hover:text-ink">
                  <input
                    type="radio"
                    name="concern"
                    checked={currentConcern === c.id}
                    onChange={() => updateParam('concern', c.id)}
                    className="accent-rose-clay"
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-4 border-t border-sand/40">
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">Brand / House</h4>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs text-taupe cursor-pointer hover:text-ink">
                <input
                  type="radio"
                  name="brand"
                  checked={currentBrand === 'all'}
                  onChange={() => updateParam('brand', 'all')}
                  className="accent-rose-clay"
                />
                <span>All Brands</span>
              </label>
              {BRANDS.map((b) => (
                <label key={b} className="flex items-center gap-2 text-xs text-taupe cursor-pointer hover:text-ink">
                  <input
                    type="radio"
                    name="brand"
                    checked={currentBrand === b}
                    onChange={() => updateParam('brand', b)}
                    className="accent-rose-clay"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 bg-ivory-50 p-3 rounded-card border border-sand">
              <span className="text-[11px] text-taupe font-medium">Applied Filters:</span>
              {currentCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-white border border-sand px-2.5 py-1 rounded-pill">
                  <span>Category: {currentCategory}</span>
                  <X className="w-3 h-3 cursor-pointer text-taupe hover:text-ink" onClick={() => updateParam('category', 'all')} />
                </span>
              )}
              {currentSkinType !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-white border border-sand px-2.5 py-1 rounded-pill">
                  <span>Skin: {currentSkinType}</span>
                  <X className="w-3 h-3 cursor-pointer text-taupe hover:text-ink" onClick={() => updateParam('skinType', 'all')} />
                </span>
              )}
              {currentConcern !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-white border border-sand px-2.5 py-1 rounded-pill">
                  <span>Concern: {currentConcern.replace('_', ' ')}</span>
                  <X className="w-3 h-3 cursor-pointer text-taupe hover:text-ink" onClick={() => updateParam('concern', 'all')} />
                </span>
              )}
              {currentBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-white border border-sand px-2.5 py-1 rounded-pill">
                  <span>Brand: {currentBrand}</span>
                  <X className="w-3 h-3 cursor-pointer text-taupe hover:text-ink" onClick={() => updateParam('brand', 'all')} />
                </span>
              )}
              {currentSearch && (
                <span className="inline-flex items-center gap-1 text-xs bg-white border border-sand px-2.5 py-1 rounded-pill">
                  <span>Search: "{currentSearch}"</span>
                  <X className="w-3 h-3 cursor-pointer text-taupe hover:text-ink" onClick={() => updateParam('search', '')} />
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-clay hover:underline ml-auto font-medium"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Grid or Skeletons or Empty */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="surface-card rounded-card p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-ivory mx-auto flex items-center justify-center text-taupe">
                <Search className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-display text-xl text-ink font-normal">
                No matching formulations found
              </h3>
              <p className="text-xs text-taupe max-w-sm mx-auto">
                We couldn't find any products matching your specific combination of filters. Try broadening your criteria.
              </p>
              <Button variant="primary" onClick={clearAllFilters} className="text-xs">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 6} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
