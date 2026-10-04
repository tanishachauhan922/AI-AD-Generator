import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AUDIO_TRACKS, VOICE_NARRATORS } from '../mockData';
import { 
  Sliders, 
  Type, 
  Image as ImageIcon, 
  Palette, 
  Volume2, 
  Play, 
  Pause, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Maximize2, 
  RotateCcw,
  Eye,
  Share2,
  Zap,
  Layers
} from 'lucide-react';

export const StudioEditor = () => {
  const { activeCreative, setActiveCreative, updateProjectStatus, navigateTo, addToast } = useApp();
  const [activeStudioTab, setActiveStudioTab] = useState('text'); // 'text' | 'visuals' | 'colors' | 'audio'
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStatusChange = async () => {
    const nextStatus = activeCreative.status === 'Completed' ? 'Active' : 'Completed';
    await updateProjectStatus(activeCreative._id, nextStatus);
  };

  // Local state bound to activeCreative
  const {
    headline,
    subtext,
    cta,
    brandName,
    aspectRatio,
    imageUrl,
    logoUrl,
    primaryColor,
    secondaryColor,
    fontFamily,
    audioTrack,
    voiceover,
    showLogo,
    textPosition,
    filterStyle
  } = activeCreative;

  const updateCreative = (field, value) => {
    setActiveCreative(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyCaptions = () => {
    const textToCopy = `${headline}\n\n${subtext}\n\n👉 ${cta}\n#DiwaliSale #AdVantageAI #${brandName.replace(/\s+/g, '')}`;
    navigator.clipboard.writeText(textToCopy);
    addToast('📋 Ad copy & hashtags copied to clipboard!', 'success');
  };

  const handleDownload = () => {
    addToast(`📥 Download started for "${activeCreative.title}" (${aspectRatio})`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Export Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & Info */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-white truncate">{activeCreative.title}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                {activeCreative.type === 'video' ? 'Video Reel' : 'Image Ad'}
              </span>
              {activeCreative._id && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeCreative.status === 'Completed'
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {activeCreative.status || 'Active'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Platform: <strong className="text-slate-200">{activeCreative.platform}</strong> • Region: <strong className="text-slate-200">{activeCreative.region}</strong>
            </p>
          </div>
        </div>

        {/* Aspect Ratio & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {activeCreative._id && (
            <button
              type="button"
              onClick={handleStatusChange}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                activeCreative.status === 'Completed'
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{activeCreative.status === 'Completed' ? 'Reopen Project' : 'Mark as Completed'}</span>
            </button>
          )}
          
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            {['9:16', '1:1', '16:9'].map(ratio => (
              <button
                key={ratio}
                onClick={() => updateCreative('aspectRatio', ratio)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  aspectRatio === ratio
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          {/* AI Critic Audit Button */}
          <button
            onClick={() => navigateTo('critic')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>
              AI Critic Scan ({activeCreative.criticScore != null
                ? `${activeCreative.criticScore}/100`
                : 'Not scored'})
            </span>
          </button>

          {/* Copy Copywrite */}
          <button
            onClick={handleCopyCaptions}
            className="px-3 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center space-x-1"
            title="Copy Headline & Hashtags"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Text</span>
          </button>

          {/* Download Export Button */}
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export HD ({activeCreative.type === 'video' ? 'MP4' : 'PNG'})</span>
          </button>

        </div>
      </div>

      {/* Main Grid: Left Canvas Stage & Right Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side (7 cols): Interactive Visual Canvas Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative">
          
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Live Stage Preview ({aspectRatio})</span>
            </span>

            {activeCreative.type === 'video' && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1 rounded-full bg-slate-900 text-xs font-bold text-indigo-400 border border-slate-800 flex items-center space-x-1.5 hover:bg-slate-800"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Video' : 'Preview Video Motion'}</span>
              </button>
            )}
          </div>

          {/* Dynamic Aspect Ratio Canvas Container */}
          <div 
            className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border-2 border-slate-700/80 bg-slate-950 flex flex-col justify-between ${
              aspectRatio === '9:16' ? 'w-full max-w-[340px] aspect-[9/16]' :
              aspectRatio === '1:1' ? 'w-full max-w-[420px] aspect-square' :
              'w-full max-w-[560px] aspect-[16/9]'
            }`}
          >
            {/* Background Image / Video Simulation */}
            <img 
              src={imageUrl} 
              alt="Creative background" 
              className={`w-full h-full object-cover transition-all duration-500 ${
                isPlaying ? 'scale-105 brightness-105' : ''
              } ${
                filterStyle === 'vibrant' ? 'saturate-150 contrast-105' :
                filterStyle === 'festive' ? 'hue-rotate-15 contrast-110' :
                filterStyle === 'dark' ? 'brightness-75 contrast-125' : ''
              }`}
            />

            {/* Gradient Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 pointer-events-none" />

            {/* Top Overlay (Logo & Brand Name) */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
              {showLogo && (
                <div className="flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <img src={logoUrl} alt="Logo" className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-[11px] font-extrabold text-white tracking-wide">{brandName}</span>
                </div>
              )}

              <span className="px-2 py-0.5 rounded-md bg-amber-500/80 backdrop-blur-md text-slate-950 text-[9px] font-black uppercase tracking-wider">
                {activeCreative.region} Special
              </span>
            </div>

            {/* Middle Waveform / Audio Indicator (if video playing) */}
            {isPlaying && activeCreative.type === 'video' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-indigo-500/40 flex items-center space-x-2 animate-pulse">
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">{audioTrack}</span>
              </div>
            )}

            {/* Bottom Overlay (Headline, Subtext & CTA Button) */}
            <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2 pointer-events-none text-left">
              <h2 className="text-base sm:text-lg font-extrabold text-white leading-tight drop-shadow-md">
                {headline}
              </h2>
              <p className="text-xs text-slate-200 line-clamp-2 drop-shadow-sm font-medium">
                {subtext}
              </p>

              <div className="pt-1 flex items-center justify-between">
                <button 
                  style={{ backgroundColor: secondaryColor || '#f59e0b' }}
                  className="px-4 py-2 rounded-xl text-slate-950 font-black text-xs shadow-lg uppercase tracking-wider flex items-center space-x-1"
                >
                  <span>{cta}</span>
                </button>

                <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[9px] text-slate-300 font-semibold border border-white/10">
                  AdVantage AI Verified
                </div>
              </div>
            </div>

          </div>

          <p className="text-[11px] text-slate-400 mt-4 text-center">
            💡 Live preview syncs in real-time as you tweak text, colors, logo placement, and voiceovers.
          </p>

        </div>

        {/* Right Side (5 cols): Studio Control Panel */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Navigation Control Tabs */}
          <div className="flex items-center justify-around bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveStudioTab('text')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeStudioTab === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              onClick={() => setActiveStudioTab('visuals')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeStudioTab === 'visuals' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Visuals</span>
            </button>

            <button
              onClick={() => setActiveStudioTab('colors')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeStudioTab === 'colors' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colors</span>
            </button>

            <button
              onClick={() => setActiveStudioTab('audio')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeStudioTab === 'audio' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Audio</span>
            </button>
          </div>

          {/* TAB 1: Text & Copy Controls */}
          {activeStudioTab === 'text' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Ad Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => updateCreative('headline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subtext / Offer Details</label>
                <textarea
                  rows={3}
                  value={subtext}
                  onChange={(e) => updateCreative('subtext', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => updateCreative('cta', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* AI Headline Generator Button */}
              <button
                onClick={() => {
                  const options = [
                    '✨ Festive Special: Flat 40% Off Glowing Skincare!',
                    '🔥 Limited Diwali Stock: Get Free Gold Foil Serum!',
                    '🌟 Unlock Radiance This Diwali with 24K Pure Care!'
                  ];
                  const pick = options[Math.floor(Math.random() * options.length)];
                  updateCreative('headline', pick);
                  addToast('✨ AI suggested new headline variant!');
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Re-generate AI Headline Variant</span>
              </button>
            </div>
          )}

          {/* TAB 2: Visual Assets & Logo Filters */}
          {activeStudioTab === 'visuals' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Show Brand Logo Watermark</span>
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => updateCreative('showLogo', e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Photo Filter Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {['vibrant', 'festive', 'dark'].map(style => (
                    <button
                      key={style}
                      onClick={() => updateCreative('filterStyle', style)}
                      className={`p-2 rounded-xl text-xs font-semibold capitalize border ${
                        filterStyle === style
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Alternate Background Images</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80'
                  ].map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Sample"
                      onClick={() => updateCreative('imageUrl', url)}
                      className="w-full h-16 rounded-xl object-cover cursor-pointer hover:opacity-80 border-2 border-transparent hover:border-indigo-500"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Colors & Branding */}
          {activeStudioTab === 'colors' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">CTA Button Accent Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => updateCreative('secondaryColor', e.target.value)}
                    className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => updateCreative('secondaryColor', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Color Palette Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Diwali Royal Gold', color: '#f59e0b' },
                    { name: 'Neon Cyber Blue', color: '#3b82f6' },
                    { name: 'Vibrant Magenta', color: '#ec4899' },
                    { name: 'Emerald Organic', color: '#10b981' }
                  ].map(p => (
                    <button
                      key={p.name}
                      onClick={() => updateCreative('secondaryColor', p.color)}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center space-x-2 text-left"
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-[11px] font-semibold text-slate-300">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Audio & Voiceovers */}
          {activeStudioTab === 'audio' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">AI Voiceover Narrator</label>
                <select
                  value={voiceover}
                  onChange={(e) => updateCreative('voiceover', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  {VOICE_NARRATORS.map(v => (
                    <option key={v.id} value={v.name}>{v.name} ({v.language})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Background Audio Beat</label>
                <select
                  value={audioTrack}
                  onChange={(e) => updateCreative('audioTrack', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  {AUDIO_TRACKS.map(a => (
                    <option key={a.id} value={a.name}>{a.name} ({a.category})</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 text-xs font-bold flex items-center justify-center space-x-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlaying ? 'Stop Audio Sample' : 'Play Voiceover & Beat Sample'}</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
