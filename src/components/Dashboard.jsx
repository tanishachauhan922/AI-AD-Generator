import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wand2, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Video, 
  Image as ImageIcon, 
  Palette, 
  CheckCircle2, 
  FolderKanban, 
  ArrowUpRight, 
  Clock, 
  Sliders, 
  BarChart3, 
  Plus,
  Play,
  Layers,
  ArrowRight
} from 'lucide-react';


export const Dashboard = () => {
  const { user, userProjects, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back, {user.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Ad Performance Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Brand: <strong className="text-slate-800 dark:text-slate-200">{user.company}</strong> • Workspace Tier: <strong className="text-indigo-500 dark:text-indigo-400">{user.tier}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateTo('create')}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
          >
            <Wand2 className="w-4 h-4" />
            <span>Create New Ad</span>
          </button>
          <button
            onClick={() => navigateTo('templates')}
            className="px-4 py-3 rounded-xl glass-card text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center space-x-2"
          >
            <Palette className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">Templates</span>
          </button>
        </div>
      </div>

      {/* Metrics & Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Active Campaigns */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Projects</span>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{userProjects.filter(project => project.status === "Active").length}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {userProjects.filter(project => project.status === "Completed").length} completed
            </p>
          </div>
         
        </div>

        {/* Card 2: Total Generated Creatives */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Generated Creatives</span>
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500 dark:text-pink-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{userProjects.length }</p>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2"> {userProjects.filter(p => p.type === "video").length} Video Reels •{" "}
  {userProjects.filter(p => p.type === "image").length} Image Ads</p>
        </div>

        {/* Card 3: Image & Video Generator (Replaced Avg AI Critic Quality) */}
        <div className="glass-card p-4 rounded-2xl border border-indigo-500/40 relative overflow-hidden flex flex-col justify-between space-y-2 bg-gradient-to-b from-indigo-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-1">
              <Wand2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 inline" />
              <span>Image & Video Generator</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-500/20 text-indigo-500 dark:text-indigo-300">
              QUICK LAUNCH
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              onClick={() => navigateTo('create', { initialType: 'image' })}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-between shadow-md shadow-indigo-600/20 group"
            >
              <span className="flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-200" />
                <span>🖼 AI Image Generator</span>
              </span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => navigateTo('create', { initialType: 'video' })}
              className="w-full py-2 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all flex items-center justify-between shadow-md shadow-pink-600/20 group"
            >
              <span className="flex items-center space-x-1.5">
                <Video className="w-3.5 h-3.5 text-pink-200" />
                <span>🎬 AI Video Generator</span>
              </span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Launch Action Hub */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>Quick Launch Creative Generators</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => navigateTo('create', { initialType: 'image' })}
            className="glass-card p-5 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-indigo-500/50 hover:bg-slate-800/40 text-left group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">AI Image Ad Studio</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">High-res product photography & text overlays</p>
          </button>

          <button
            onClick={() => navigateTo('create', { initialType: 'video' })}
            className="glass-card p-5 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-pink-500/50 hover:bg-slate-800/40 text-left group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-500 dark:text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">AI Video Reels (9:16)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Short animated video with voiceovers & music</p>
          </button>

          <button
            onClick={() => navigateTo('templates')}
            className="glass-card p-5 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-amber-500/50 hover:bg-slate-800/40 text-left group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">Regional & Diwali Templates</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Festive packs in Hindi, Hinglish, Tamil & Telugu</p>
          </button>

          <button
            onClick={() => navigateTo('critic')}
            className="glass-card p-5 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-emerald-500/50 hover:bg-slate-800/40 text-left group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">AI Critic Pre-Audit</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Score ad copy, contrast & platform rules</p>
          </button>

        </div>
      </div>

      {/* Main Split Layout: Active Projects Table & Recent Creatives Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Active Projects */}
<div className="lg:col-span-2 space-y-6">

  <div className="flex items-center justify-between">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
      <BarChart3 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
      <span>Active Projects</span>
    </h2>

    <button
      onClick={() => navigateTo('projects')}
      className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
    >
      <span>View All</span>
      <ArrowUpRight className="w-3.5 h-3.5" />
    </button>
  </div>

  <div className="glass-panel rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200 overflow-hidden">
    <div className="overflow-x-auto">

      <table className="w-full text-left text-xs">

        <thead className="bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100 text-slate-700 dark:text-slate-400 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 font-semibold">
          <tr>
            <th className="p-4">Campaign Name</th>
            <th className="p-4">Type</th>
            <th className="p-4">Headline</th>
            <th className="p-4">Last Updated</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800/60 dark:divide-slate-800/60 light:divide-slate-200">

        
          {userProjects
  .filter(project => project.status === "Active")
  .map(project => (
            <tr
              key={project._id}
              className="hover:bg-slate-800/30 dark:hover:bg-slate-800/30 light:hover:bg-slate-100 transition-colors"
            >

              {/* Campaign Name */}
              <td className="p-4">
                <p className="font-bold text-slate-900 dark:text-white">
                  {project.title}
                </p>

                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Created on{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </td>

              {/* Type */}
              <td className="p-4">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30 text-[10px] font-bold">
                  {project.type}
                </span>
              </td>

              {/* Headline */}
              <td className="p-4 text-slate-700 dark:text-slate-300">
                {project.headline || "No headline"}
              </td>

              {/* Last Updated */}
              <td className="p-4 text-slate-500 dark:text-slate-400">
                {new Date(project.updatedAt).toLocaleDateString()}
              </td>

              {/* Action */}
              <td className="p-4 text-right">
                <button
                  onClick={() => navigateTo('projects')}
                  className="px-2.5 py-1 rounded bg-slate-800 dark:bg-slate-800 light:bg-slate-200 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 transition-colors text-[11px] font-semibold"
                >
                  Manage
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  </div>

</div>

        {/* Right 1 Col: Recent Creatives */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-pink-500 dark:text-pink-400" />
              <span>Recent Creatives</span>
            </h2>
            <button 
              onClick={() => navigateTo('projects')}
              className="text-xs font-semibold text-pink-500 dark:text-pink-400 hover:text-pink-300"
            >
              Library
            </button>
          </div>

          <div className="space-y-4">
            {userProjects.slice(0, 3).map(item => (
              <div 
                key={item._id ?? item.id}
                className="glass-card p-3 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-indigo-500/40 transition-all flex space-x-3 items-center"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-16 h-20 rounded-xl object-cover bg-slate-900 flex-shrink-0" 
                />

                <div className="flex-grow min-w-0">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-500 dark:text-indigo-300 text-[9px] font-bold">
                      {item.platform}
                    </span>
                    <span className="text-[10px] text-amber-500 dark:text-amber-400 font-bold">
                      {item.criticScore != null
                        ? `★ ${item.criticScore}/100`
                        : 'Not scored'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.headline}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.brandName} • {item.language}</p>

                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() => navigateTo('studio', item)}
                      className="px-2 py-1 rounded bg-indigo-600 text-white text-[10px] font-bold flex items-center space-x-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => navigateTo('critic', item)}
                      className="px-2 py-1 rounded bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[10px] font-semibold"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
