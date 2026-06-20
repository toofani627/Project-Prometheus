import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'adminkapassword') {
      localStorage.setItem('isAdminAuth', 'true');
      navigate('/admin-dashboard');
    } else {
      setError('Invalid admin credentials.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-transparent"
    >
      {/* Card */}
      <div
        className={`w-full max-w-sm neo-card border-2 border-neo-cream rounded-3xl shadow-[8px_8px_0px_var(--color-neo-cream)] p-8 transition-transform ${shake ? 'animate-shake' : ''}`}
      >
        {/* Logo + title */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-neo-green-dark" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeOpacity="0.3"/>
            </svg>
          </div>
          <h1 className="font-heading text-4xl text-neo-cream uppercase leading-none mb-2">
            ADMIN LOGIN
          </h1>
          <p className="font-body text-neo-cream/40 text-xs uppercase tracking-widest">
            Restricted Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block font-subheading text-[11px] uppercase tracking-widest text-neo-cream/50 mb-2">
              Admin ID
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full border-2 border-neo-cream/50 rounded-xl px-4 py-3 font-body text-sm text-neo-cream focus:outline-none focus:border-neo-cream transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-subheading text-[11px] uppercase tracking-widest text-neo-cream/50 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full border-2 border-neo-cream/50 rounded-xl px-4 py-3 pr-12 font-body text-sm text-neo-cream focus:outline-none focus:border-neo-cream transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-cream/40 hover:text-neo-cream transition-colors"
                tabIndex={-1}
              >
                {showPass ? (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="border border-red-500/50 rounded-xl px-4 py-3 bg-red-500/10 neo-card">
              <p className="font-subheading text-xs text-red-400 uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-neo-green-dark text-neo-cream border-2 border-neo-cream rounded-xl py-4 font-heading text-xl uppercase shadow-[4px_4px_0px_var(--color-neo-cream)] hover:translate-y-[3px] hover:translate-x-[3px] hover:shadow-[1px_1px_0px_var(--color-neo-cream)] transition-all duration-200 mt-2"
          >
            SIGN IN
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-5px); }
          80%      { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.45s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
