import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { API_BASE_URL } from '../api';
import { 
  Wand2, 
  Sparkles, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Globe2, 
  Eye, 
  ShieldCheck, 
  Sliders, 
  Flame, 
  Star,
  Layers,
  Video,
  Image as ImageIcon,
  Languages
} from 'lucide-react';

export const LandingPage = () => {
  const { navigateTo, addToast, userProjects } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [promptInput, setPromptInput] = useState('Diwali special flash sale ad for organic glowing skincare serum with 40% OFF discount');
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/templates`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load templates');
        }

        setTemplates(data);
      } catch (error) {
        setTemplatesError(error.message || 'Failed to load templates');
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const categories = [
    'All',
    ...new Set(templates.map(template => template.category).filter(Boolean))
  ];

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(template => template.category === selectedCategory);

  const handleQuickGenerate = (e) => {
    e.preventDefault();
    navigateTo('create', { prompt: promptInput });
  };

  const handleUseTemplate = async (templateCard) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/templates/${templateCard._id}`
      );
      const template = await response.json();

      if (!response.ok) {
        throw new Error(template.error || 'Failed to load template');
      }

      navigateTo('template-customization', {
        templateId: template._id,
        title: template.name,
        type: 'image',
        headline: 'Your Headline Here',
        subtext: 'Your subheadline here',
        cta: 'Shop Now',
        brandName: 'Aura Organics',
        aspectRatio: '1:1',
        platform: 'Instagram',
        style: template.category,
        imageUrl: template.thumbnail,
        primaryColor: template.colors?.primary || '#6366f1',
        secondaryColor: template.colors?.secondary || '#f59e0b',
        backgroundColor: template.colors?.background || '#ffffff',
        elements: template.elements,
        showLogo: true,
        textPosition: 'bottom'
      });
    } catch (error) {
      addToast(error.message || 'Failed to load template', 'error');
    }
  };

  return (
    <div className="relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-pink-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Animated Feature Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-8 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Next-Gen AI Ad Creative Studio 4.0</span>
          <span className="bg-indigo-500/20 px-2 py-0.5 rounded-full text-[10px] text-indigo-400 font-bold">NEW</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
          Turn Simple Product Links Into <br className="hidden sm:inline" />
          <span className="gradient-text">High-Converting AI Video & Image Ads</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-10">
          Generate viral Instagram Reels, Meta Feed ads, and Regional Indian festival campaigns in 30 seconds. Powered by real-time AI Creative Critic scoring and multi-language storytelling.
        </p>

        {/* Interactive Prompt Bar Simulator */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleQuickGenerate} className="glass-panel p-2.5 rounded-2xl border border-indigo-500/30 shadow-2xl flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-3 px-3 w-full">
              <Wand2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Describe your product or paste website link..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2 whitespace-nowrap transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Ad Now</span>
            </button>
          </form>

          {/* Quick Prompt Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Try prompts:</span>
            <button 
              onClick={() => setPromptInput('Diwali gold necklace flash sale in Hindi with 50% discount')}
              className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors border border-slate-700/50"
            >
              🪔 Diwali Gold Special
            </button>
            <button 
              onClick={() => setPromptInput('Wireless ANC Noise Cancelling Earbuds product video for Reels')}
              className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors border border-slate-700/50"
            >
              🎧 Wireless Earbuds Reel
            </button>
            <button 
              onClick={() => setPromptInput('Luxury 3BHK Apartment Tour in Gurgaon with WhatsApp booking CTA')}
              className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors border border-slate-700/50"
            >
              🏰 Real Estate Tour
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/60 dark:border-slate-800/60">
          <div className="p-4 rounded-xl glass-card text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">+340%</p>
            <p className="text-xs text-slate-400 mt-1">Average CTR Boost</p>
          </div>
          <div className="p-4 rounded-xl glass-card text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{userProjects.length}</p>
            <p className="text-xs text-slate-400 mt-1">Total Creatives</p>
          </div>
          <div className="p-4 rounded-xl glass-card text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">12+ Languages</p>
            <p className="text-xs text-slate-400 mt-1">Hindi, Hinglish, Tamil, etc.</p>
          </div>
          <div className="p-4 rounded-xl glass-card text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-pink-400">&lt; 8 Sec</p>
            <p className="text-xs text-slate-400 mt-1">Generation Time</p>
          </div>
        </div>

      </section>

      {/* Template Showcase Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Template Library</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Create with <span className="gradient-text">Ready-to-use Templates</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Choose a template from the library and customize it for your brand.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {templatesError && (
          <p role="alert" className="mb-5 text-sm text-rose-300">
            {templatesError}. Make sure the backend is running and try again.
          </p>
        )}

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div 
              key={template._id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Template Preview */}
              <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
                {template.thumbnail ? (
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Template Details */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700/60 flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3 text-pink-400" />
                    <span>{template.category}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700/60">
                    {template.isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>

                {/* Template Name */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm font-bold text-white leading-tight mt-1 line-clamp-2">
                    {template.name}
                  </h3>
                  <p className="text-[10px] text-slate-300 mt-1">
                    {template.dimensions?.width && template.dimensions?.height
                      ? `${template.dimensions.width} × ${template.dimensions.height}`
                      : 'Custom dimensions'}
                  </p>
                </div>
              </div>

              {/* Template Action */}
              <div className="p-4 bg-slate-900/60 flex items-center justify-between border-t border-slate-800/80">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{template.category} template</span>
                </div>
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition-all flex items-center space-x-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Use template</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {templatesLoading && (
          <p className="py-10 text-center text-sm text-slate-400">Loading templates...</p>
        )}
        {!templatesLoading && !templatesError && filteredTemplates.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            No templates found{selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}.
          </p>
        )}
      </section>

      {/* Key Feature Highlights */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Everything You Need to <span className="gradient-text">Dominate Paid Ads</span>
            </h2>
            <p className="text-base text-slate-400 mt-4">
              Built specifically for modern performance marketers, direct-to-consumer brands, and agency creative teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <button
              type="button"
              onClick={() => navigateTo('create')}
              className="glass-card w-full p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-6">
                <Video className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Video Reels & Shorts</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Auto-generate 9:16 viral short videos with natural AI voiceovers, dynamic caption animations, and background audio tracks tailored for Instagram Reels and TikTok.
              </p>
              <span className="text-xs font-bold text-indigo-400 inline-flex items-center space-x-1">
                <span>Multi-platform aspect ratios</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Feature 2 */}
            <button
              type="button"
              onClick={() => navigateTo('templates')}
              className="glass-card w-full p-8 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-6">
                <Languages className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Regional & Festival Indian Ads</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Tap into Diwali, Dhanteras, Holi, IPL, and regional Indian shopping seasons. Create ad copy in Hindi, Hinglish, Tamil, Telugu, Marathi, and Gujarati with one click.
              </p>
              <span className="text-xs font-bold text-amber-400 inline-flex items-center space-x-1">
                <span>12+ Regional Indian Dialects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Feature 3 */}
            <button
              type="button"
              onClick={() => navigateTo('critic')}
              className="glass-card w-full p-8 rounded-2xl border border-slate-800 hover:border-pink-500/40 transition-all text-left focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time AI Creative Critic</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Diagnostic score out of 100 before spending a single dollar. Detect contrast issues, mobile text safe-zones, policy flags, and apply instant one-click fixes.
              </p>
              <span className="text-xs font-bold text-pink-400 inline-flex items-center space-x-1">
                <span>Automated CTR Pre-audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-indigo-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Ready to Multiply Your Ad ROAS?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Join 10,000+ top marketers using AI to generate high-performing ad creatives in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigateTo('create')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-extrabold text-base shadow-xl shadow-indigo-500/40 transition-all flex items-center justify-center space-x-2"
            >
              <Wand2 className="w-5 h-5" />
              <span>Start  for Free </span>
            </button>
            <button
              onClick={() => navigateTo('templates')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-white font-bold text-base hover:bg-slate-800 transition-all"
            >
              Explore Template Gallery
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
