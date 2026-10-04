import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

import {
  Palette,
  Search,
  Star,
  Download,
  Sliders
} from 'lucide-react';

const getAspectRatio = (dimensions) => {
  const width = dimensions?.width || 1080;
  const height = dimensions?.height || 1080;
  let a = width;
  let b = height;

  while (b) {
    [a, b] = [b, a % b];
  }

  return `${width / a}:${height / a}`;
};

export const TemplateGallery = () => {
  const { navigateTo, addToast } = useApp();

  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState([]);

  // Fetch templates from MongoDB
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/templates"
        );

        const data = await response.json();

        console.log("Templates from MongoDB:", data);

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to fetch templates"
          );
        }

        setTemplates(data);
      } catch (error) {
        console.error("Templates fetch failed:", error);
      }
    };

    fetchTemplates();
  }, []);

  // Categories available in MongoDB
 const categories = [
  'All',
  ...new Set(templates.map(tpl => tpl.category))
];

  // Search + category filtering
  const filteredTemplates = templates.filter(tpl => {
    const matchesCat =
      selectedCat === 'All' ||
      tpl.category === selectedCat;

    const matchesSearch =
      tpl.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      tpl.category
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

 const handleUseTemplate = async (tpl) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/templates/${tpl._id}`
    );

    const template = await response.json();

    if (!response.ok) {
      throw new Error(
        template.error || "Failed to fetch template"
      );
    }

   
    const templatePayload = {
      templateId: template._id,
      title: template.name,
      type: 'image',

      headline: 'Your Headline Here',
      subtext: 'Your subheadline here',
      cta: 'Shop Now',

      brandName: 'Aura Organics',

      dimensions: template.dimensions || { width: 1080, height: 1080 },
      aspectRatio: getAspectRatio(template.dimensions),
      platform: 'Instagram',

      style: template.category,

      imageUrl: template.thumbnail,

      primaryColor:
        template.colors?.primary || '#6366f1',

      secondaryColor:
        template.colors?.secondary || '#f59e0b',

      backgroundColor:
        template.colors?.background || '#ffffff',

      elements: template.elements,

      showLogo: true,
      textPosition: 'bottom'
    };

    addToast(
      `✨ Opening Template Customization for "${template.name}"`
    );

    navigateTo(
      'template-customization',
      templatePayload
    );

  } catch (error) {
    console.error(
      "Template selection failed:",
      error
    );

    addToast(
      "❌ Failed to load template"
    );
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
          <Palette className="w-4 h-4" />
          <span>General & Regional Indian Template Gallery</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Pre-Tested High-CTR{' '}
          <span className="gradient-text-gold">
            Ad Templates
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400">
          Select any template to open dedicated customization mode.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto pt-3">

          <div className="relative">

            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search templates..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />

          </div>

        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">

        {categories.map(cat => (

          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCat === cat
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'glass-card text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>

        ))}

      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {filteredTemplates.map(tpl => (

          <div
            key={tpl._id}
            className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 group flex flex-col justify-between"
          >

            {/* Image Preview */}
            <div
              onClick={() => handleUseTemplate(tpl)}
              className="relative aspect-[4/5] bg-slate-950 overflow-hidden cursor-pointer"
            >

              <img
                src={tpl.thumbnail}
                alt={tpl.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">

                <span className="px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  {tpl.category}
                </span>

                <span className="px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-extrabold text-white flex items-center space-x-1">

                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />

                  <span>
                    {tpl.isPremium ? 'Premium' : 'Free'}
                  </span>

                </span>

              </div>

              {/* Template Name */}
              <div className="absolute bottom-3 left-3 right-3">

                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                  {tpl.dimensions?.width} × {tpl.dimensions?.height}
                </p>

                <h3 className="text-sm font-bold text-white leading-tight mt-0.5">
                  {tpl.name}
                </h3>

              </div>

            </div>

            {/* Template Info & Action */}
            <div className="p-4 bg-slate-900/60 space-y-3 border-t border-slate-800">

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {tpl.category} template
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">

                <span className="flex items-center space-x-1">

                  <Download className="w-3 h-3 text-indigo-400" />

                  <span>
                    {tpl.dimensions?.width} × {tpl.dimensions?.height}
                  </span>

                </span>

                <button
                  onClick={() => handleUseTemplate(tpl)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-colors flex items-center space-x-1 shadow-md shadow-amber-500/20"
                >

                  <Sliders className="w-3.5 h-3.5" />

                  <span>
                    Customize Template
                  </span>

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};