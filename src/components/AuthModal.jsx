import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Wand2, 
  Check, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, loadAuthenticatedUser, addToast, navigateTo } = useApp();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  if (!authModalOpen) return null;

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    mode === "signup" &&
    (password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[^A-Za-z0-9\s]/.test(password))
  ) {
    setPasswordError(
      "Password must be at least 8 characters and include an uppercase letter and a special character."
    );
    return;
  }
  setPasswordError('');
  setAuthError('');

  try {
    // ================= SIGNUP =================
    if (mode === "signup") {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // EMAIL VERIFICATION TEMPORARILY DISABLED FOR DEPLOYMENT
      // Re-enable this when a production Resend domain is configured.
      localStorage.setItem("token", data.token);
      await loadAuthenticatedUser();

      addToast("Account created! You are now signed in.", "success");
      setAuthModalOpen(false);
      navigateTo("dashboard");

      return;
    }

    // ================= LOGIN =================
    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);

    await loadAuthenticatedUser();

    addToast(
      "Welcome back! Logged in successfully.",
      "success"
    );

    setAuthModalOpen(false);
    navigateTo("dashboard");

  } catch (error) {
    console.error("AUTH ERROR:", error);
    if (mode === "signup") {
      if (error.message.includes("already exists")) {
        setMode("login");
        setAuthError('');
        addToast("This email already has an account. Sign in with its password.", "info");
      } else {
        setAuthError(error.message);
      }
    } else {
      addToast(error.message, "error");
    }
  }
};
const handleVerifyEmail = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/verify-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: verificationEmail,
          otp
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Email verification failed");
    }

    localStorage.setItem("token", data.token);

    await loadAuthenticatedUser();

    addToast(
      "Email verified! Welcome to AdVantage AI.",
      "success"
    );

    setAuthModalOpen(false);
    navigateTo("dashboard");

  } catch (error) {
    console.error("EMAIL VERIFICATION ERROR:", error);
    addToast(error.message, "error");
  }
};
   
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Container Card */}
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 light:bg-white grid grid-cols-1 md:grid-cols-2">
        
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand Highlights Panel */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col justify-between hidden md:flex border-r border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-white">
                AdVantage<span className="gradient-text">.AI</span>
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-3 leading-tight">
              Create AI Ad Creatives That
              <br />
              Convert Better
            </h3>
            <p className="text-sm text-slate-300 mb-8 leading-relaxed">
              Generate, customize and analyze
              <br />
              professional ad creatives in one place.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">AI-Powered Ad Generation</p>
                  <p className="text-[11px] text-slate-400">Create unique image creatives with AI.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 rounded bg-amber-500/20 text-amber-400 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Ready-to-Customize Templates</p>
                  <p className="text-[11px] text-slate-400">Start with a template and make it your own.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 rounded bg-pink-500/20 text-pink-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">AI Creative Critic</p>
                  <p className="text-[11px] text-slate-400">Get instant feedback before publishing.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400">
            Create • Customize • Analyze
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          
          {/* Header Switcher Tabs */}
          {mode !== "verify" && (
  <div className="flex items-center space-x-4 mb-6 border-b border-slate-800 dark:border-slate-800 pb-3">
    <button
      onClick={() => { setMode("login"); setAuthError(''); setPasswordError(''); }}
      className={`text-lg font-bold transition-all ${
        mode === "login"
          ? "text-white dark:text-white light:text-slate-900 border-b-2 border-indigo-500 pb-1"
          : "text-slate-500 hover:text-slate-300"
      }`}
    >
      Sign In
    </button>

    <button
      onClick={() => { setMode("signup"); setAuthError(''); setPasswordError(''); }}
      className={`text-lg font-bold transition-all ${
        mode === "signup"
          ? "text-white dark:text-white light:text-slate-900 border-b-2 border-indigo-500 pb-1"
          : "text-slate-500 hover:text-slate-300"
      }`}
    >
      Create Account
    </button>
  </div>
)}
          {/* Form */}
          {mode === "verify" ? (
  <div className="space-y-5">

    <div>
      <h2 className="text-2xl font-extrabold text-white">
        Verify your email
      </h2>

      <p className="text-sm text-slate-400 mt-2">
        We sent a 6-digit verification code to
      </p>

      <p className="text-sm font-semibold text-indigo-400 mt-1">
        {verificationEmail}
      </p>
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">
        Verification Code
      </label>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value.replace(/\D/g, ""))
        }
        placeholder="Enter 6-digit OTP"
        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-center tracking-[0.5em] focus:outline-none focus:border-indigo-500"
      />
    </div>

    <button
      type="button"
      onClick={handleVerifyEmail}
      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-extrabold text-xs"
    >
      Verify Email
    </button>

  </div>
) : (
  <form onSubmit={handleSubmit} className="space-y-4">

    {mode === "signup" && (
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">
          Full Name
        </label>

        <div className="relative">
          <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />

          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=""
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    )}

    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">
        Work Email
      </label>

      <div className="relative">
        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@brand.com"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">
        Password
      </label>

      <div className="relative">
        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />

        <input
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError('');
          }}
          placeholder="••••••••••••"
          className="w-full pl-9 pr-11 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
        >
          {showPassword
            ? <EyeOff className="w-4 h-4" />
            : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {mode === "signup" && (
        <p className="mt-1.5 text-[11px] text-slate-500">
          At least 8 characters, with one uppercase letter and one special character.
        </p>
      )}
      {passwordError && mode === "signup" && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-rose-400">
          {passwordError}
        </p>
      )}
    </div>

    {authError && mode === "signup" && (
      <p role="alert" className="text-xs font-medium text-rose-400">
        {authError}
      </p>
    )}

    <button
      type="submit"
      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2 transition-all mt-2"
    >
      <span>
        {mode === "login"
          ? "Sign In to Workspace"
          : "Get Started Free "}
      </span>

      <ArrowRight className="w-4 h-4" />
    </button>

  </form>
)}
        </div>

      </div>

    </div>
  );
};
