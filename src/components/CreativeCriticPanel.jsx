import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { API_BASE_URL } from '../api';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Copy,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  MousePointerClick,
  Loader2,
  Play
} from 'lucide-react';

export const CreativeCriticPanel = () => {
  const {
    userProjects,
    activeCreative,
    updateProjectCriticScore,
    navigateTo,
    addToast
  } = useApp();

  // Selected creative
  const [selectedItem, setSelectedItem] = useState(() => {
    return userProjects?.[0] || (activeCreative?._id ? activeCreative : null);
  });

  // Real AI result
  const [criticResult, setCriticResult] = useState(null);

  // Loading state
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Select creative
  const selectCreative = (item) => {
    setSelectedItem(item);
    setCriticResult(null);

    addToast(`🔍 Selected creative: "${item.title}"`, 'info');
  };

  // Run actual AI Critic
  const handleRunCritic = async () => {
    if (!selectedItem?.imageUrl) {
      addToast('❌ No image available for this creative.', 'error');
      return;
    }

    try {
      setIsAnalyzing(true);
      setCriticResult(null);

      const token = localStorage.getItem('token');

      if (!token) {
        addToast('❌ Please login first.', 'error');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/critic/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            imageUrl: selectedItem.imageUrl
          })
        }
      );

      const data = await response.json();

      console.log('AI CRITIC RESPONSE:', data);

      if (!response.ok) {
        throw new Error(
          data.message || 'AI Critic analysis failed'
        );
      }

      setCriticResult(data.critic);
      const criticScore = getScore(data.critic.overallScore);
      const updatedProject = await updateProjectCriticScore(selectedItem, criticScore);
      setSelectedItem(updatedProject || { ...selectedItem, criticScore });

      addToast(
        '✨ AI Critic analysis completed successfully!',
        'success'
      );

    } catch (error) {
      console.error('AI Critic Error:', error);

      addToast(
        `❌ ${error.message || 'AI Critic analysis failed'}`,
        'error'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper to safely get scores
  const getScore = (value) => {
    const score = Number(value);

    if (Number.isNaN(score)) return 0;

    return Math.min(100, Math.max(0, score));
  };

  // Score status
  const getStatus = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Needs Tweaking';

    return 'Needs Improvement';
  };

  // Score color
  const getScoreColor = (score) => {
    if (score >= 90) {
      return 'bg-emerald-500/20 text-emerald-400';
    }

    if (score >= 80) {
      return 'bg-amber-500/20 text-amber-400';
    }

    return 'bg-rose-500/20 text-rose-400';
  };

  // No projects
  if (!selectedItem) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-panel p-10 rounded-3xl border border-slate-800 text-center">
          <ShieldCheck className="w-12 h-12 mx-auto text-indigo-400 mb-4" />

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            No Creative Available
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Create a creative first, then come back here to run AI Critic.
          </p>
        </div>
      </div>
    );
  }

  // Actual score from AI
  const currentScore = criticResult
    ? getScore(criticResult.overallScore)
    : null;

  // Actual AI sub-scores
  const subScores = criticResult
    ? [
        {
          label: 'Visual Appeal',
          score: getScore(criticResult.visualAppeal),
          detail:
            criticResult.visualAppealFeedback ||
            'AI analysis of the visual appeal of the advertisement.'
        },
        {
          label: 'Text Readability',
          score: getScore(criticResult.readability),
          detail:
            criticResult.readabilityFeedback ||
            'AI analysis of text size, contrast and readability.'
        },
        {
          label: 'Layout & Composition',
          score: getScore(criticResult.layoutComposition),
          detail:
            criticResult.layoutCompositionFeedback ||
            'AI analysis of spacing, hierarchy and composition.'
        },
        {
          label: 'Brand Consistency',
          score: getScore(criticResult.brandConsistency),
          detail:
            criticResult.brandConsistencyFeedback ||
            'AI analysis of branding and visual consistency.'
        },
        {
          label: 'CTA Effectiveness',
          score: getScore(criticResult.ctaEffectiveness),
          detail:
            criticResult.ctaEffectivenessFeedback ||
            'AI analysis of CTA visibility and clarity.'
        }
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* HEADER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />

            <span>
              AI Creative Critic Diagnostic Engine
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Single Creative Audit & CTR Optimizer
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Select a creative and run the AI Critic to analyze its visual
            quality, readability, composition, branding and CTA.
          </p>
        </div>

      </div>


      {/* SELECT CREATIVE */}
      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <MousePointerClick className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />

            <span>
              Select Creative to Audit
            </span>
          </h2>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            {userProjects?.length || 0} Assets Available
          </span>

        </div>


        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">

          {userProjects?.map(item => {

            const isSelected =
              (selectedItem?._id ?? selectedItem?.id) === (item._id ?? item.id);

            return (
              <button
                key={item._id ?? item.id}
                onClick={() => selectCreative(item)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 relative overflow-hidden group ${
                  isSelected
                    ? 'glass-panel border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-500/10'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >

                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950">

                  {item.type === 'video' && item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      aria-label={`Video preview for ${item.title || 'project'}`}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      autoPlay
                      loop
                      preload="metadata"
                    />
                  ) : item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title || 'Project creative'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center text-slate-400">
                      {item.type === 'video'
                        ? <Play className="h-8 w-8 text-indigo-400" />
                        : <ShieldCheck className="h-8 w-8 text-indigo-400" />}
                      <span className="text-[10px] font-semibold">
                        {item.type === 'video' ? 'Video preview unavailable' : 'Preview unavailable'}
                      </span>
                    </div>
                  )}

                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[9px] font-bold text-white">
                    {item.type === 'video'
                      ? 'Reel'
                      : 'Image'}
                  </span>

                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black">
                    {item.criticScore != null ? item.criticScore : 'Not scored'}
                  </span>

                </div>

                <div className="min-w-0">

                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </p>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {item.platform} • {item.language}
                  </p>

                </div>

              </button>
            );
          })}

        </div>
      </div>


      {/* SELECTED CREATIVE */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8">

        {/* CREATIVE INFO + RUN BUTTON */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-800 pb-6">

          <div className="flex items-center space-x-4">

            {selectedItem.type === 'video' && selectedItem.videoUrl ? (
              <video
                src={selectedItem.videoUrl}
                aria-label={`Video preview for ${selectedItem.title || 'project'}`}
                controls
                playsInline
                preload="metadata"
                className="w-24 h-20 rounded-xl object-cover border border-slate-700 bg-slate-950 shadow-md flex-shrink-0"
              />
            ) : selectedItem.imageUrl ? (
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title || 'Project creative'}
                className="w-16 h-20 rounded-xl object-cover border border-slate-700 shadow-md flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-20 rounded-xl border border-slate-700 bg-slate-950 flex items-center justify-center flex-shrink-0">
                <Play className="h-6 w-6 text-indigo-400" />
              </div>
            )}

            <div>

              <div className="flex items-center space-x-2 mb-1">

                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                  {selectedItem.platform || 'Instagram'}
                  {' '}
                  ({selectedItem.aspectRatio || '9:16'})
                </span>

                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                  {selectedItem.language || 'Hinglish'}
                </span>

              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedItem.headline || selectedItem.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedItem.brandName || 'Brand'}
                {' • '}
                {selectedItem.subtext || ''}
              </p>

            </div>

          </div>


          {/* RUN AI CRITIC BUTTON */}
          <button
            onClick={handleRunCritic}
            disabled={isAnalyzing}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-sm font-extrabold flex items-center justify-center space-x-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >

            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>
                  {criticResult
                    ? 'Run Again'
                    : 'Run AI Critic'}
                </span>
              </>
            )}

          </button>

        </div>


        {/* BEFORE ANALYSIS */}
        {!criticResult && !isAnalyzing && (

          <div className="text-center py-10">

            <ShieldCheck className="w-12 h-12 mx-auto text-indigo-400 mb-4" />

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Ready for AI Analysis
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
              Click <b>Run AI Critic</b> to send this creative to the
              AI vision model and receive the actual diagnostic score.
            </p>

          </div>
        )}


        {/* LOADING */}
        {isAnalyzing && (

          <div className="text-center py-10">

            <Loader2 className="w-12 h-12 mx-auto text-emerald-400 animate-spin mb-4" />

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              AI is analyzing your creative...
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Checking visual appeal, readability, layout, branding and CTA.
            </p>

          </div>
        )}


        {/* ACTUAL AI RESULTS */}
        {criticResult && !isAnalyzing && (

          <>

            {/* SUB SCORES */}
            <div className="space-y-4">

              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">

                <TrendingUp className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />

                <span>
                  AI Diagnostic Metrics
                </span>

              </h3>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {subScores.map((item, i) => {

                  const score = item.score;

                  return (
                    <div
                      key={i}
                      className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2"
                    >

                      <div className="flex items-center justify-between gap-3">

                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.label}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold whitespace-nowrap ${getScoreColor(score)}`}
                        >
                          {score} / 100 ({getStatus(score)})
                        </span>

                      </div>


                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">

                        <div
                          className="h-full rounded-full transition-all duration-700 bg-emerald-500"
                          style={{
                            width: `${score}%`
                          }}
                        />

                      </div>


                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.detail}
                      </p>

                    </div>
                  );
                })}

              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 p-0.5 shadow-lg shadow-emerald-500/20">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <span className="text-2xl font-black text-emerald-400">
                        {currentScore}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-500 dark:text-emerald-400">
                      Overall Score
                    </p>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {currentScore >= 90
                        ? 'High Performance'
                        : currentScore >= 80
                          ? 'Good Performance'
                          : 'Needs Improvement'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm">
                      {selectedItem.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveCreative(selectedItem);
                    navigateTo('studio', selectedItem);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500"
                >
                  <span>Edit in Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>


            {/* STRENGTHS */}
            {criticResult.strengths &&
              criticResult.strengths.length > 0 && (

              <div className="space-y-3 pt-4 border-t border-slate-800">

                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">

                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />

                  <span>
                    Strengths
                  </span>

                </h3>

                <div className="space-y-2">

                  {criticResult.strengths.map(
                    (strength, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />

                      <span>
                        {strength}
                      </span>
                    </div>

                  ))}

                </div>

              </div>
            )}


            {/* IMPROVEMENTS */}
            {criticResult.improvements &&
              criticResult.improvements.length > 0 && (

              <div className="space-y-3 pt-4 border-t border-slate-800">

                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">

                  <AlertTriangle className="w-4 h-4 text-amber-400" />

                  <span>
                    Recommended Improvements
                  </span>

                </h3>

                <div className="space-y-2">

                  {criticResult.improvements.map(
                    (improvement, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                    >

                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />

                      <span>
                        {improvement}
                      </span>

                    </div>

                  ))}

                </div>

              </div>
            )}


            {/* RECOMMENDATION */}
            {criticResult.recommendation && (

              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">

                <div className="flex items-start gap-3">

                  <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5" />

                  <div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      AI Recommendation
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {criticResult.recommendation}
                    </p>

                  </div>

                </div>

              </div>
            )}

          </>
        )}


        {/* COPY / CAPTION */}
        <div className="space-y-4 pt-4 border-t border-slate-800">

          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">

            <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400" />

            <span>
              Creative Copy
            </span>

          </h3>


          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">

            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">

              "{selectedItem.headline || selectedItem.title}"

              {selectedItem.subtext
                ? ` — ${selectedItem.subtext}`
                : ''}

              {selectedItem.cta
                ? ` 👉 ${selectedItem.cta}`
                : ''}

            </p>


            <p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-bold">

              #{selectedItem.brandName
                ? selectedItem.brandName.replace(/\s+/g, '')
                : 'Brand'}

              {' '}

              #{selectedItem.language || 'Ads'}

              {' #AdVantageAI'}

            </p>


            <div className="pt-2 flex justify-end">

              <button
                onClick={() => {

                  const caption = `${selectedItem.headline || selectedItem.title}

${selectedItem.subtext || ''}

👉 ${selectedItem.cta || 'Shop Now'}`;

                  navigator.clipboard.writeText(caption);

                  addToast(
                    '📋 Caption copied to clipboard!'
                  );
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center space-x-1.5"
              >

                <Copy className="w-3.5 h-3.5" />

                <span>
                  Copy Caption
                </span>

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};