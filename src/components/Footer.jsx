import React from 'react';
import { useApp } from '../context/AppContext';
import { Wand2, Sparkles, Globe, Shield, Heart } from 'lucide-react';

export const Footer = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigateTo('landing')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white">
                AdVantage<span className="gradient-text">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-Gen AI Advertisement Creative Studio. Create viral video reels, high-converting image ads, and regional Indian festival campaigns in seconds.
            </p>
          </div>

          {/* Col 2: Studio Pages */}
          <div className="space-y-2">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">Creative Studio</p>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => navigateTo('create')} className="hover:text-indigo-400 transition-colors">Create AI Ad</button></li>
              <li><button onClick={() => navigateTo('templates')} className="hover:text-indigo-400 transition-colors">Regional & Diwali Templates</button></li>
              <li><button onClick={() => navigateTo('studio')} className="hover:text-indigo-400 transition-colors">Canvas Studio Editor</button></li>
              <li><button onClick={() => navigateTo('critic')} className="hover:text-indigo-400 transition-colors">AI Creative Critic Audit</button></li>
            </ul>
          </div>

          {/* Col 3: Workspace */}
          <div className="space-y-2">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">Workspace & Brand</p>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => navigateTo('dashboard')} className="hover:text-indigo-400 transition-colors">Performance Dashboard</button></li>
              <li><button onClick={() => navigateTo('projects')} className="hover:text-indigo-400 transition-colors">My Projects & Assets</button></li>
            </ul>
          </div>

          {/* Col 4: Platform Status */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">System Status</p>
            <div className="p-3 rounded-xl glass-card border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>All AI Generators Operational</span>
              </div>
              <p className="text-[10px] text-slate-400">99.99% Uptime • Flux.1 Pro & Sora Video Engines Active</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 AdVantage AI Studio. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">API Documentation</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
