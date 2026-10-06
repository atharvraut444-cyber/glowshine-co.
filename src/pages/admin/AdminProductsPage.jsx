import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Check, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { productService } from '../../services/products/productService';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';

export function AdminProductsPage() {
  const { success, info } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    const res = await productService.getProducts({ search, maxResults: 100 });
    setProducts(res.products);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleAdjustStock = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
    success('Inventory stock level updated.', 'Inventory');
  };

  const handleToggleActive = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newActive = !p.active;
          info(`Formulation "${p.name}" set to ${newActive ? 'Active' : 'Inactive'}.`);
          return { ...p, active: newActive };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-normal">
            Catalogue & Stock Management
          </h1>
          <p className="text-xs text-taupe mt-1">
            Manage clean botanical formulations, stock thresholds, and active availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-taupe" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search formulations..."
              className="pl-9 pr-3 py-1.5 bg-white border border-sand rounded-subtle text-xs text-ink placeholder:text-taupe/60 focus:outline-none focus:border-ink"
            />
          </div>
        </div>
      </div>

      {/* Catalogue Table */}
      <div className="bg-white border border-sand rounded-card shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-sand text-taupe uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Formulation</th>
                <th className="p-4">Category</th>
                <th className="p-4">Retail Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-taupe">
                    Loading catalogue...
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-12 object-cover rounded bg-sand/30 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-ink">{prod.name}</p>
                          <p className="text-[11px] text-taupe">{prod.brand} · {prod.volume}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 capitalize text-taupe font-medium">{prod.category}</td>
                    <td className="p-4 font-bold text-ink">{formatCurrency(prod.price)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAdjustStock(prod.id, -5)}
                          className="w-5 h-5 rounded border border-sand bg-ivory text-ink hover:bg-sand/40 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className={`font-mono font-semibold ${prod.stock < 15 ? 'text-status-error' : 'text-ink'}`}>
                          {prod.stock} units
                        </span>
                        <button
                          onClick={() => handleAdjustStock(prod.id, 5)}
                          className="w-5 h-5 rounded border border-sand bg-ivory text-ink hover:bg-sand/40 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(prod.id)}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-pill flex items-center gap-1 ${
                          prod.active
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-sand/40 text-taupe border border-sand'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${prod.active ? 'bg-emerald-500' : 'bg-taupe'}`} />
                        <span>{prod.active ? 'Active' : 'Archived'}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={`/product/${prod.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-rose-clay hover:underline font-medium"
                      >
                        Preview Storefront ↗
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminProductsPage;
