import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const { success } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (password.length < 8) {
      setAuthError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const { user, error } = await register(email, password, name);
    setLoading(false);

    if (error) {
      setAuthError(error);
    } else if (user) {
      success('Welcome to GlowShine Co.! Let us personalize your experience.', 'Account Created');
      // Direct user straight to skin diagnostic quiz
      navigate('/quiz');
    }
  };

  const handleGoogleRegister = async () => {
    setAuthError('');
    setLoading(true);
    const { user, error } = await loginWithGoogle();
    setLoading(false);

    if (error) {
      setAuthError(error);
    } else if (user) {
      success('Signed in with Google.', 'Welcome');
      navigate('/quiz');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-sand rounded-2xl shadow-elevated p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="font-display text-2xl tracking-[0.18em] text-ink">
            GLOWSHINE CO.
          </span>
          <h2 className="font-display text-2xl text-ink font-normal">Create Your Account</h2>
          <p className="text-xs text-taupe">
            Unlock adaptive GlowMatch™ recommendations and tailored skin rituals.
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-subtle text-xs text-status-error">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Priya Sharma"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="priya@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            helperText="At least 8 characters with letters & numbers"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            isLoading={loading}
          >
            <span>Create Account & Start Quiz</span>
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
          onClick={handleGoogleRegister}
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
          <span>Sign up with Google</span>
        </button>

        <p className="text-center text-xs text-taupe pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-rose-clay font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
