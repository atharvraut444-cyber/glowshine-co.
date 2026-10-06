import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loginDemo } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const destination = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    const { user, error } = await login(email, password);
    setLoading(false);

    if (error) {
      setAuthError(error);
    } else if (user) {
      success('Welcome back to GlowShine Co.', 'Signed In');
      navigate(destination, { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setLoading(true);
    const { user, error } = await loginWithGoogle();
    setLoading(false);

    if (error) {
      setAuthError(error);
    } else if (user) {
      success('Successfully signed in with Google.', 'Signed In');
      navigate(destination, { replace: true });
    }
  };

  const handleDemoLogin = async (role) => {
    setAuthError('');
    await loginDemo(role);
    success(
      `Logged in as Demo ${role === 'admin' ? 'Administrator' : 'Customer'}.`,
      'Demo Access'
    );
    navigate(role === 'admin' ? '/admin' : destination, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-sand rounded-2xl shadow-elevated p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="font-display text-2xl tracking-[0.18em] text-ink">
            GLOWSHINE CO.
          </span>
          <h2 className="font-display text-2xl text-ink font-normal">Welcome Back</h2>
          <p className="text-xs text-taupe">
            Sign in to access your custom routine, GlowMatch scores, and orders.
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-subtle text-xs text-status-error">
            {authError}
          </div>
        )}

        {/* 1-Click Demo Buttons for Fast Evaluation & Testing */}
        <div className="p-3.5 bg-ivory rounded-card border border-sand/80 space-y-2">
          <p className="text-[11px] font-semibold text-ink uppercase tracking-wider text-center">
            ⚡ Quick Evaluation Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('customer')}
              className="py-2 px-2.5 text-xs font-medium bg-white hover:bg-sand/30 border border-sand rounded-subtle text-ink transition-colors"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-2 px-2.5 text-xs font-semibold bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-subtle text-purple-900 transition-colors"
            >
              Demo Admin Console
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            isLoading={loading}
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-sand w-full" />
          <span className="bg-white px-3 text-[11px] text-taupe uppercase tracking-wider absolute">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 bg-white border border-sand hover:border-ink rounded-subtle text-xs font-medium text-ink flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.13C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.27 6.59l4.01 3.13c.95-2.84 3.6-4.97 6.72-4.97z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-xs text-taupe pt-2">
          New to GlowShine?{' '}
          <Link to="/register" className="text-rose-clay font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
