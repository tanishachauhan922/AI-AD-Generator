import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Sparkles, 
  Palette, 
  Cpu, 
  Key, 
  Zap, 
  Sun, 
  Moon, 
  Check, 
  Save, 
  ShieldCheck, 
  User,
  Mail,
  CreditCard
} from 'lucide-react';

export const SettingsPage = () => {
  const { theme, toggleTheme, user, setUser, brandKit, setBrandKit, addToast } = useApp();

  const [formBrand, setFormBrand] = useState({ ...brandKit });
  const [formAccount, setFormAccount] = useState({
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || ''
  });
  const [accountSaving, setAccountSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [selectedVideoModel, setSelectedVideoModel] = useState('OpenAI Sora Video Engine');
  const [selectedVoiceModel, setSelectedVoiceModel] = useState('ElevenLabs v2 Multilingual');

  useEffect(() => {
    setFormAccount({
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || ''
    });
  }, [user.name, user.email, user.avatar]);

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      addToast('Please sign in to update your account.', 'error');
      return;
    }

    setAccountSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formAccount)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update account');
      }

      setUser((currentUser) => ({ ...currentUser, ...data.user }));
      addToast('Account details saved successfully.', 'success');
    } catch (error) {
      console.error('Account update failed:', error);
      addToast(error.message || 'Failed to save account details.', 'error');
    } finally {
      setAccountSaving(false);
    }
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Choose an image file for your avatar.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('Avatar image must be 5 MB or smaller.', 'error');
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.message || 'Avatar upload failed');
      }

      setFormAccount((currentAccount) => ({
        ...currentAccount,
        avatar: data.imageUrl
      }));
      addToast('Avatar uploaded. Save Changes to apply it to your account.', 'success');
    } catch (error) {
      console.error('Avatar upload failed:', error);
      addToast(error.message || 'Avatar upload failed.', 'error');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveBrandKit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/auth/brand-kit",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formBrand),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save brand kit");
    }

    // Update AppContext only after MongoDB successfully saves
    setBrandKit(data.brandKit);

    addToast(
      "✅ Brand kit preferences saved successfully!",
      "success"
    );

  } catch (error) {
    console.error("Brand kit save failed:", error);

    addToast(
      "❌ Failed to save brand kit",
      "error"
    );
  }
};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 mb-1">
          <Settings className="w-4 h-4" />
          <span>Brand & Studio Preferences</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Profile & Account Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage brand colors, logo watermarks, AI engine models, theme mode, and API integrations.
        </p>
      </div>

      {/* Grid: Left Brand Kit & Right AI Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Brand Kit Setup */}
        <div className="lg:col-span-2 space-y-6">

          <form onSubmit={handleSaveAccount} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 pb-3">
              <User className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <span>Account Settings</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="account-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  id="account-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formAccount.name}
                  onChange={(e) => setFormAccount({ ...formAccount, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="account-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="account-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formAccount.email}
                    onChange={(e) => setFormAccount({ ...formAccount, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="account-avatar" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Profile Avatar</label>
                <input
                  id="account-avatar"
                  type="url"
                  value={formAccount.avatar}
                  onChange={(e) => setFormAccount({ ...formAccount, avatar: e.target.value })}
                  placeholder="https://example.com/profile-photo.jpg"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-xl border border-slate-700 dark:border-slate-700 light:border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-500">
                    {avatarUploading ? 'Uploading...' : 'Choose image from device'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      disabled={avatarUploading}
                      className="sr-only"
                      aria-label="Choose profile avatar image"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Image files up to 5 MB. Or enter an image URL above.</span>
                </div>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                disabled={accountSaving}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{accountSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
          
          {/* Theme Mode Selector Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interface Theme Mode</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Toggle between Dark Mode and Light Mode appearance.</p>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs font-bold text-slate-900 dark:text-white hover:border-indigo-500 flex items-center space-x-2 transition-colors shadow-sm"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSaveBrandKit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-6">
            
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 pb-3">
              <Palette className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <span>Brand Kit Configuration</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={formBrand.name}
                  onChange={(e) => setFormBrand({ ...formBrand, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Default Tagline</label>
                <input
                  type="text"
                  value={formBrand.tagline}
                  onChange={(e) => setFormBrand({ ...formBrand, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Logo Image URL</label>
                <input
                  type="text"
                  value={formBrand.logoUrl}
                  onChange={(e) => setFormBrand({ ...formBrand, logoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Brand Color Palette</label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Primary Color</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formBrand.primaryColor}
                      onChange={(e) => setFormBrand({ ...formBrand, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg bg-transparent cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">{formBrand.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Secondary Accent</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formBrand.secondaryColor}
                      onChange={(e) => setFormBrand({ ...formBrand, secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg bg-transparent cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">{formBrand.secondaryColor}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Highlight Glow</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formBrand.accentColor}
                      onChange={(e) => setFormBrand({ ...formBrand, accentColor: e.target.value })}
                      className="w-8 h-8 rounded-lg bg-transparent cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">{formBrand.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Brand Kit</span>
              </button>
            </div>

          </form>

        </div>

        {/* Right 1 Col: AI Engine Models & Subscription */}
        <div className="space-y-6">
          
          {/* Subscription Tier */}
          <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-500 dark:text-indigo-300 text-[10px] font-bold uppercase">
                {user.tier}
              </span>
              <span className="text-xs font-bold text-amber-500 dark:text-amber-400 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>{user.creditsRemaining} Credits</span>
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro Workspace Plan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Renews on Oct 1, 2026. Includes unlimited video rendering & AI Critic audits.</p>
            </div>

            <button
              onClick={() => addToast('🎉 Upgrade options loaded!')}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-700 dark:border-slate-700 light:border-slate-300 transition-colors"
            >
              Manage Subscription & Top-up
            </button>
          </div>

          {/* AI Models Selector */}
         {/* AI Models */}
<div className="glass-panel p-6 rounded-3xl border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-4">
  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 pb-2">
    <Cpu className="w-4 h-4 text-pink-500 dark:text-pink-400" />
    <span>AI Engine Models</span>
  </h3>

  {/* Image Generation */}
  <div>
    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
      Image Generation Engine
    </label>

    <div className="w-full px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs text-slate-900 dark:text-white">
      FLUX.1 Schnell
    </div>
  </div>

  {/* Video Generation */}
  <div>
    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
      Video Generation Engine
    </label>

    <div className="w-full px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs text-slate-900 dark:text-white">
      AI Video Generation
    </div>
  </div>

  {/* Voiceover */}
  <div>
    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
      Voiceover Engine
    </label>

    <div className="w-full px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs text-slate-900 dark:text-white">
      Voice Generation
    </div>
  </div>
</div>

        </div>

      </div>

    </div>
  );
};
