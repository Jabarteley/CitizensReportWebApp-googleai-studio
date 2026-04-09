import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmail } from '../services/authService';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await signInWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-container to-slate-900 flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/10">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-on-primary-container text-6xl mb-4" style={{fontVariationSettings: "'FILL' 1"}}>admin_panel_settings</span>
          <h1 className="text-3xl font-black text-primary tracking-tighter uppercase">Admin Login</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-medium">Authenticate to access the dashboard</p>
        </div>

        {error && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@agency.gov"
              className="w-full px-4 py-4 bg-surface-container-highest border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-4 bg-surface-container-highest border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-lg text-sm" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-on-primary py-4 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-primary-container transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin material-symbols-outlined">progress_activity</span>
                Authenticating...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="border-t border-outline-variant pt-6">
          <Link to="/report" className="w-full block bg-surface-container-highest text-on-surface px-6 py-4 rounded-lg hover:bg-surface-container-high transition-all text-center font-bold text-xs uppercase tracking-widest active:scale-95">
            Continue as Anonymous
          </Link>
          <p className="text-[10px] text-on-surface-variant text-center mt-2 font-medium">No identity stored. Report without a trace.</p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-on-surface-variant hover:text-primary transition-colors">← Return to Command Center</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
