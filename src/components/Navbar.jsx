import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Wand2, 
  LayoutDashboard, 
  Palette, 
  CheckCircle2, 
  FolderKanban, 
  Settings, 
  ChevronDown,
  LogOut
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeTab, 
    navigateTo, 
    user, 
    isLoggedIn, 
    setIsLoggedIn,
    setAuthModalOpen 
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Removed "Studio Editor" from top navbar items
  const navItems = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Ad', icon: Wand2, highlight: true },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'critic', label: 'AI Critic', icon: CheckCircle2 },
    { id: 'projects', label: 'Projects & Assets', icon: FolderKanban },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/60 dark:border-slate-800/80 light:bg-white/90 light:border-slate-200 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => navigateTo('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 dark:bg-slate-950 light:bg-white rounded-[10px] flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  AdVantage<span className="gradient-text">.AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 hidden sm:block">
                AI Ad Creative Studio
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    item.highlight 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02]' 
                      : isActive 
                        ? 'bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30 font-bold' 
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-800/40 light:hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive && !item.highlight ? 'text-indigo-500 dark:text-indigo-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User Control */}
          <div className="flex items-center space-x-3">
            
            {/* Profile Menu / Login Button */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full border border-slate-700/60 hover:border-indigo-500/50 transition-all"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40" 
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-indigo-500/40">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-2xl py-2 border border-slate-700/80 light:bg-white light:border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-800 dark:border-slate-800 light:border-slate-100">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                        {user.tier}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => { navigateTo('settings'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-500 flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Brand & Account Settings</span>
                    </button>
                    
                    <button
                      onClick={() => { navigateTo('projects'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-500 flex items-center space-x-2"
                    >
                      <FolderKanban className="w-4 h-4" />
                      <span>My Campaigns Library</span>
                    </button>

                    <div className="border-t border-slate-800 dark:border-slate-800 light:border-slate-100 my-1"></div>

                    <button
                      onClick={() => {  localStorage.removeItem("token");setIsLoggedIn(false); setUserMenuOpen(false); setAuthModalOpen(true); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
              >
                Sign In
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Bar Links */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/80 light:border-slate-200 px-2 py-2 light:bg-white overflow-x-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap ${
                isActive ? 'text-indigo-500 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
