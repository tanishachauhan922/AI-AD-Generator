import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { API_BASE_URL } from '../api';
import { AUDIO_TRACKS, VOICE_NARRATORS } from '../mockData';
import {
  Palette,
  Sparkles,
  ArrowLeft,
  Download,
  Sliders,
  Volume2,
  Type,
  CheckCircle2,
  Play,
  Pause,
  Eye,
  Save,
  Languages,
  Zap,
  Wand2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export const TemplateCustomization = () => {
  const { activeCreative, setActiveCreative, navigateTo, saveNewCreative, addToast } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'language' | 'style' | 'audio'
 
  const {
    title,
    headline,
    subtext,
    cta,
    brandName,
    aspectRatio,
    dimensions,
    imageUrl,
    logoUrl,
   
    primaryColor,
secondaryColor,
backgroundColor,
    language,
    region,
    audioTrack,
    voiceover,
    showLogo,
  } = activeCreative;
  
  
  const [productImage, setProductImage] = useState(imageUrl || '');
  const canvasWidth = dimensions?.width || 1080;
  const canvasHeight = dimensions?.height || 1080;
  const canvasAspectRatio = `${canvasWidth} / ${canvasHeight}`;
  const updateField = (field, val) => {
    setActiveCreative(prev => ({ ...prev, [field]: val }));
  };
  
  const handleSaveAndExport = () => {
  saveNewCreative({
    ...activeCreative,

    // Customized project title
    title: `${title} (Customized)`,

    // Save the permanent Cloudinary image URL
    imageUrl: productImage || imageUrl,
  });

  addToast(
    '🎉 Template customized & saved to project library!',
    'success'
  );

  navigateTo('projects');
};
//handle image chane
 const handleImageChange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `${API_BASE_URL}/api/upload/image`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    console.log("Cloudinary Image URL:", data.imageUrl);

    setProductImage(data.imageUrl);

  } catch (error) {
    console.error("Image upload failed:", error);
  }
};
//handle logo change in same cloudinary way
const handleLogoChange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  console.log("1. Selected logo file:", file);

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `${API_BASE_URL}/api/upload/image`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log("2. Logo upload response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Logo upload failed");
    }

    if (!data.imageUrl) {
      throw new Error("Logo upload response did not include an image URL");
    }

    console.log("3. Cloudinary Logo URL:", data.imageUrl);

    updateField("logoUrl", data.imageUrl);
    addToast("Brand logo uploaded successfully", "success");
  } catch (error) {
    console.error("Logo upload failed:", error);
    addToast(error.message || "Logo upload failed", "error");
  }
};
  const handleAuditInCritic = () => {
    addToast('🔍 Loading customized template into AI Critic Audit...', 'info');
    navigateTo('critic', activeCreative);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Top Header Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateTo('templates')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Back to Template Gallery"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Template Mode
              </span>
              <h1 className="text-base font-extrabold text-white truncate">{title}</h1>
            </div>
            <p className="text-xs text-slate-400">
              Region: <strong className="text-slate-200">{region}</strong> • Default Dialect: <strong className="text-slate-200">{language}</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">

          <button
            onClick={handleAuditInCritic}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Audit in AI Critic</span>
          </button>

          <button
            onClick={handleSaveAndExport}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save to Projects</span>
          </button>

        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Side (7 cols): Live Template Stage Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative">

          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Live Stage Preview ({aspectRatio || '1:1'})</span>
            </span>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-full bg-slate-900 text-xs font-bold text-indigo-300 border border-slate-800 flex items-center space-x-1.5 hover:bg-slate-800"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Motion' : 'Preview Video Motion'}</span>
            </button>
          </div>

          {/* Canvas Container */}
          <div
            className="relative w-full max-w-[520px] rounded-[1.35rem] overflow-hidden shadow-2xl border border-slate-700 bg-slate-950"
            style={{ aspectRatio: canvasAspectRatio, backgroundColor }}
          >
            {(productImage || imageUrl) && (
              <img
                src={productImage || imageUrl}
                alt={title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-[1.03] saturate-110' : ''}`}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/95 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 p-[4%]">
              {showLogo && (
                <div className="flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-slate-950/75 px-2.5 py-1.5 backdrop-blur-md">
                  {logoUrl ? (
                    <img src={logoUrl} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </span>
                  )}
                  <span className="truncate text-xs font-extrabold text-white">{brandName}</span>
                </div>
              )}
              <span className="shrink-0 rounded-md px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-slate-950" style={{ backgroundColor: secondaryColor || '#f59e0b' }}>
                {region} Special
              </span>
            </div>

            {isPlaying && (
              <div className="absolute left-1/2 top-1/2 z-10 flex max-w-[85%] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl border border-white/20 bg-slate-950/75 px-3 py-2 text-center text-xs font-semibold text-white backdrop-blur-md">
                <Volume2 className="h-4 w-4 shrink-0 text-amber-400" />
                <span className="truncate">{audioTrack || 'Previewing motion'}</span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 z-10 space-y-2.5 p-[4%] sm:space-y-3">
              <h2 className="max-w-[95%] text-lg font-black leading-tight text-white drop-shadow-md sm:text-2xl">
                {headline}
              </h2>
              <p className="max-w-[95%] text-xs font-medium leading-relaxed text-slate-100 drop-shadow sm:text-sm">
                {subtext}
              </p>
              <div className="flex items-end justify-between gap-3 pt-1">
                <button
                  type="button"
                  className="max-w-[80%] rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-950 shadow-lg transition-transform hover:scale-[1.02] sm:px-5 sm:py-3 sm:text-sm"
                  style={{ backgroundColor: secondaryColor || '#f59e0b' }}
                >
                  <span className="line-clamp-1">{cta}</span>
                </button>
                <span className="shrink-0 rounded bg-slate-950/70 px-2 py-1 text-[8px] font-semibold text-slate-300 backdrop-blur">
                  AdVantage AI Verified
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side (5 cols): Template Customization Panel */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">

          {/* Customization Tabs */}
          <div className="flex items-center justify-around bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'content' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>

            <button
              onClick={() => setActiveTab('language')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'language' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Dialect</span>
            </button>

            <button
              onClick={() => setActiveTab('style')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'style' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'audio' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Audio</span>
            </button>
          </div>

          {/* TAB 1: Content */}
          {activeTab === 'content' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Headline Text</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => updateField('headline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subtext / Offer Details</label>
                <textarea
                  rows={3}
                  value={subtext}
                  onChange={(e) => updateField('subtext', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">CTA Button</label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => updateField('cta', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-3 pt-2">
                <div>
                  <p className="block text-xs font-bold text-slate-300 mb-1">Product Image</p>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 transition-colors hover:border-amber-500/40">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
                      {productImage || imageUrl ? (
                        <img src={productImage || imageUrl} alt="Current product" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-500">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white">{productImage && productImage !== imageUrl ? 'Custom image selected' : 'Template image'}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">Upload a product photo</p>
                    </div>
                    <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] font-bold text-amber-300 transition-colors hover:border-amber-400/60 hover:bg-amber-500/20">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Choose</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" aria-label="Choose product image" />
                    </label>
                  </div>
                </div>

                <div>
                  <p className="block text-xs font-bold text-slate-300 mb-1">Brand Logo</p>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 transition-colors hover:border-amber-500/40">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Current brand logo" className="h-full w-full object-contain p-1" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white">{logoUrl ? 'Logo ready' : 'No logo selected'}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">Add your brand mark</p>
                    </div>
                    <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] font-bold text-amber-300 transition-colors hover:border-amber-400/60 hover:bg-amber-500/20">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Choose</span>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" aria-label="Choose brand logo" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Language & Dialect */}
          {activeTab === 'language' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Template Language</label>
                <select
                  value={language}
                  onChange={(e) => {
                    const lang = e.target.value;
                    updateField('language', lang);
                    if (lang === 'Hindi') updateField('headline', '✨ इस दिवाली पाएं 24K सोने जैसी निखरी त्वचा!');
                    else if (lang === 'Tamil') updateField('headline', '✨ தீபாவளி சிறப்பு சலுகை! 40% தள்ளுபடி!');
                    else if (lang === 'Hinglish') updateField('headline', '✨ Iss Diwali, Paye Glowing Sone Jaisi Rangat!');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="Hinglish">Hinglish (Conversational)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="English">English (Global)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                💡 Language selector automatically adapts headline scripts to regional Indian typography styles.
              </div>
            </div>
          )}

         {/* TAB 3: Style & Accent Colors */}
{activeTab === 'style' && (
  <div className="space-y-4 animate-in fade-in duration-200">

    {/* Primary Color */}
    <div>
      <label className="block text-xs font-bold text-slate-300 mb-1">
        Primary Color
      </label>

      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={primaryColor || '#6366f1'}
          onChange={(e) =>
            updateField('primaryColor', e.target.value)
          }
          className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
        />

        <input
          type="text"
          value={primaryColor || '#6366f1'}
          onChange={(e) =>
            updateField('primaryColor', e.target.value)
          }
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
        />
      </div>
    </div>

    {/* Button Accent Color */}
    <div>
      <label className="block text-xs font-bold text-slate-300 mb-1">
        Button Accent Color
      </label>

      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={secondaryColor || '#f59e0b'}
          onChange={(e) =>
            updateField('secondaryColor', e.target.value)
          }
          className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
        />

        <input
          type="text"
          value={secondaryColor || '#f59e0b'}
          onChange={(e) =>
            updateField('secondaryColor', e.target.value)
          }
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
        />
      </div>
    </div>

    {/* Festive Color Palettes */}
    <div>
      <label className="block text-xs font-bold text-slate-300 mb-1">
        Festive Color Palettes
      </label>

      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'Royal Diwali Gold', color: '#f59e0b' },
          { name: 'Festive Crimson Ruby', color: '#ef4444' },
          { name: 'Emerald Temple Green', color: '#10b981' },
          { name: 'Sapphire Royal Blue', color: '#3b82f6' }
        ].map(p => (
          <button
            key={p.name}
            onClick={() =>
              updateField('secondaryColor', p.color)
            }
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center space-x-2 text-left"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: p.color }}
            />

            <span className="text-[11px] font-semibold text-slate-300">
              {p.name}
            </span>
          </button>
        ))}
      </div>
    </div>

  </div>
)}

          {/* TAB 4: Audio */}
          {activeTab === 'audio' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Voiceover Narrator</label>
                <select
                  value={voiceover}
                  onChange={(e) => updateField('voiceover', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  {VOICE_NARRATORS.map(v => (
                    <option key={v.id} value={v.name}>{v.name} ({v.language})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Background Audio Beats</label>
                <select
                  value={audioTrack}
                  onChange={(e) => updateField('audioTrack', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  {AUDIO_TRACKS.map(a => (
                    <option key={a.id} value={a.name}>{a.name} ({a.category})</option>
                  ))}
                </select>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
