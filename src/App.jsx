import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Layouts & Guards
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Customer Pages (Lazy loaded for optimal initial bundle & paint)
const HomePage = lazy(() => import('./pages/customer/HomePage'));
const ShopPage = lazy(() => import('./pages/customer/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/customer/ProductDetailPage'));
const LoginPage = lazy(() => import('./pages/customer/LoginPage'));
const RegisterPage = lazy(() => import('./pages/customer/RegisterPage'));
const SkinQuizPage = lazy(() => import('./pages/customer/SkinQuizPage'));
const GlowMatchPage = lazy(() => import('./pages/customer/GlowMatchPage'));
const WishlistPage = lazy(() => import('./pages/customer/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/customer/CheckoutPage'));
const CheckoutPayPage = lazy(() => import('./pages/customer/CheckoutPayPage'));
const OrdersPage = lazy(() => import('./pages/customer/OrdersPage'));
const ProfilePage = lazy(() => import('./pages/customer/ProfilePage'));
const JourneyPage = lazy(() => import('./pages/customer/JourneyPage'));

// Admin Pages (Lazy loaded - only downloaded on demand)
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminSalesPage = lazy(() => import('./pages/admin/AdminSalesPage'));
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'));
const AdminBehaviourPage = lazy(() => import('./pages/admin/AdminBehaviourPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminCampaignsPage = lazy(() => import('./pages/admin/AdminCampaignsPage'));
const AdminLivePage = lazy(() => import('./pages/admin/AdminLivePage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

export function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-8 h-8 rounded-full border-2 border-sand border-t-rose-clay animate-spin" />
      <span className="text-xs uppercase tracking-widest text-taupe font-medium">Loading...</span>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Customer Facing Storefront Routes */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/quiz" element={<SkinQuizPage />} />
                  <Route path="/glowmatch" element={<GlowMatchPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/checkout/pay/:orderId" element={<CheckoutPayPage />} />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/journey" element={<JourneyPage />} />
                </Route>

                {/* Admin Console Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="sales" element={<AdminSalesPage />} />
                  <Route path="payments" element={<AdminPaymentsPage />} />
                  <Route path="behaviour" element={<AdminBehaviourPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="campaigns" element={<AdminCampaignsPage />} />
                  <Route path="live" element={<AdminLivePage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
