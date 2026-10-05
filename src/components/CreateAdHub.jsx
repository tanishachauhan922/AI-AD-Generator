import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { API_BASE_URL } from '../api';
import { 
  Wand2, 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Languages, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';

export const CreateAdHub = () => {
  const { navigateTo, addToast, setUserProjects } = useApp();

  const [creativeType, setCreativeType] = useState('video');
  const [productName, setProductName] = useState('Aura Organics Glow Serum');
  const [productDescription, setProductDescription] = useState('Pure 24K gold foil skincare serum for radiant festive Diwali skin. 40% OFF discount.');
  const [region, setRegion] = useState('Pan-India');
  const [language, setLanguage] = useState('Hinglish');
  const [adStyle, setAdStyle] = useState('Festive Gold Glow');
  const [platform, setPlatform] = useState('Instagram Reels');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [ctaText, setCtaText] = useState('Shop Diwali Glow');
  const [voiceover, setVoiceover] = useState('Priya (Indian Female - Energetic)');
  const [audioTrack, setAudioTrack] = useState('Energetic Diwali Dhol Beats');
  const [duration, setDuration] = useState(3);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState("");

  // Loading animation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const stepsList = creativeType === 'video'
    ? [
        'Submitting your video request...',
        'Waiting for Magic Hour to start rendering...',
        'Rendering your video...',
        'Saving your completed video...',
      ]
    : [
    'Analyzing Product Selling Points & Audience Hook...',
    'Generating High-CTR Headline Variations...',
    'Rendering HD Visual Frames & Color Grading...',
    'Synthesizing Regional Voiceover & Audio Tracks...',
    'Performing AI Critic Quality & Policy Audit...'
    ];

const handleGenerate = async (e) => {
  e.preventDefault();

  const videoDuration = Number(duration);
  if (creativeType === "video") {
    if (!Number.isFinite(videoDuration) || videoDuration < 1 || videoDuration > 8) {
      addToast("Cannot generate a video longer than 8 seconds.", "error");
      return;
    }
  }

  setIsGenerating(true);
  setGenStep(0);
  setGeneratedVideoUrl("");

  const token = localStorage.getItem("token");
  if (!token) {
    addToast("Please log in before generating an ad.", "error");
    setIsGenerating(false);
    return;
  }

  try {
    console.log("🚀 Starting ad generation...");

    // Decide endpoint based on creative type
    const endpoint =
      creativeType === "video"
        ? `${API_BASE_URL}/api/generate-ad/generate-video`
        : `${API_BASE_URL}/api/generate-ad/generate`;

    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        productName,
        productDescription,
        adStyle,
        platform,
        language,
        region,
        ctaText,
        aspectRatio,

        // Video-specific
        ...(creativeType === "video" && {
          duration: videoDuration,
          voiceover,
          audioTrack,
        }),
      }),
    });

    const responseText = await response.text();
    let data = {};
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(
        data.message || "Ad generation failed"
      );
    }

    // =========================
    // VIDEO
    // =========================

    if (creativeType === "video") {
      const project = data.project;
      const magicHourProjectId = data.magicHourProjectId || project?.magicHourProjectId;
      if (!project?._id || !magicHourProjectId) {
        throw new Error("The server did not return the video project details.");
      }

      setUserProjects((currentProjects) => [
        project,
        ...currentProjects.filter((item) => item._id !== project._id),
      ]);

      setGenStep(1);
      const completedProject = await pollVideoStatus(magicHourProjectId, token);
      setGenStep(3);
      setGeneratedVideoUrl(completedProject.videoUrl);
      setUserProjects((currentProjects) =>
        currentProjects.map((item) =>
          item._id === completedProject._id ? completedProject : item
        )
      );
      addToast("Your video has been generated and saved to your projects.", "success");
    }

    // =========================
    // IMAGE
    // =========================

    else {
      if (typeof data.imageUrl !== "string" || !data.imageUrl.trim()) {
        throw new Error("The server did not return a generated image URL.");
      }

      console.log("✅ Advertisement generated successfully");

      console.log("Headline:", data.headline);
      console.log("Subtext:", data.subtext);
      console.log("Image Prompt:", data.imagePrompt);
      console.log("Image URL:", data.imageUrl);

      navigateTo("studio", {
        title: productName,
        type: "image",
        headline: data.headline,
        subtext: data.subtext,
        cta: ctaText,
        brandName: productName,
        imageUrl: data.imageUrl,
        aspectRatio: data.aspectRatio || aspectRatio,
        platform,
        region,
        language,
        style: adStyle,
      });
    }

  } catch (error) {
    console.error("❌ Generation error:", error);
    addToast(
      error instanceof Error
        ? error.message
        : creativeType === "video"
          ? "Video generation failed."
          : "Image generation failed.",
      "error"
    );
  } finally {
    setIsGenerating(false);
  }
};
const pollVideoStatus = async (magicHourProjectId, token) => {
  const checkStatus = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/generate-ad/video-status/${encodeURIComponent(magicHourProjectId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseText = await response.text();
    let data = {};
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      throw new Error("The server returned an invalid video status response.");
    }

    console.log("🎬 Video status:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to check video status");
    }

    // Video ready
    if (data.status === "complete") {
      if (!data.videoUrl || !data.project) {
        throw new Error("Video completed, but the server did not return its saved video.");
      }
      return data.project;
    }

    // Still processing
    setGenStep(data.status === "rendering" ? 2 : 1);
    return null;
  };

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const videoUrl = await checkStatus();
    if (videoUrl) {
      return videoUrl;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  throw new Error(
    "Video generation is taking longer than expected. Check My Projects for its latest status."
  );
};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-3 border border-indigo-500/20">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Multimodal Ad Generator Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Create New <span className="gradient-text">AI Ad Creative</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Select creative format, target audience, regional language, and let AI build high-converting ads.
        </p>
      </div>

      {/* Creative Type Selector */}
      <div
        role="group"
        aria-label="Select creative format"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        <button
          type="button"
          aria-pressed={creativeType === 'video'}
          onClick={() => { setCreativeType('video'); setAspectRatio('9:16'); setPlatform('Instagram Reels'); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
            creativeType === 'video'
              ? 'glass-panel border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-500/10'
              : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              {creativeType === 'video' && <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-indigo-400" />}
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300">
                9:16 Reel
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Video Reel / Short</h3>
            <p className="text-xs text-slate-400 mt-1">Animated frames, voiceover, subtitles & music</p>
          </div>
        </button>

        <button
          type="button"
          aria-pressed={creativeType === 'image'}
          onClick={() => { setCreativeType('image'); setAspectRatio('1:1'); setPlatform('Meta Feed'); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
            creativeType === 'image'
              ? 'glass-panel border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-500/10'
              : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              {creativeType === 'image' && <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-indigo-400" />}
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                1:1 Square
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Image Ad</h3>
            <p className="text-xs text-slate-400 mt-1">Ultra HD product photos with CTA overlays</p>
          </div>
        </button>

      </div>

      {/* Main Generation Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
        
        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Wand2 className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
                STEP {genStep + 1} OF {stepsList.length}
              </p>
              <h3 className="text-lg font-bold text-white max-w-md">
                {stepsList[genStep]}
              </h3>
            </div>

            {/* Progress dots */}
            <div className="flex space-x-2">
              {stepsList.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx <= genStep ? 'bg-indigo-500 scale-110' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Section 1: Product & Selling Proposition */}
          <div>
            <h3 className="text-sm font-extrabold text-white mb-3 flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>1. Product & Offer Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Product / Brand Name</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Aura Organics Glow Serum"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Call To Action (CTA)</label>
                <select
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Shop Diwali Glow">Shop Diwali Glow</option>
                  <option value="Get 40% Off Today">Get 40% Off Today</option>
                  <option value="Order on WhatsApp">Order on WhatsApp</option>
                  <option value="Book Free Site Visit">Book Free Site Visit</option>
                  <option value="Start Free Trial">Start Free Trial</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Key Selling Points & Discounts</label>
                <textarea
                  rows={2}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="e.g. Pure 24K gold foil skincare serum for radiant festive skin..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Regional Targeting & Language */}
          <div>
            <h3 className="text-sm font-extrabold text-white mb-3 flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Languages className="w-4 h-4 text-amber-400" />
              <span>2. Regional Market & Language</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Pan-India">Pan-India</option>
                  <option value="North India (Delhi/NCR, UP, Punjab)">North India</option>
                  <option value="South India (TN, KA, TS, KL)">South India</option>
                  <option value="West India (Maharashtra, Gujarat)">West India</option>
                  <option value="Global (US/UK/UAE)">Global (US/UK/UAE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Ad Copy Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Hinglish">Hinglish (Conversational)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                  <option value="English">English (Global)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Ad Creative Style</label>
                <select
                  value={adStyle}
                  onChange={(e) => setAdStyle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Festive Gold Glow">Festive Gold Glow (Diwali/Holi)</option>
                  <option value="High Energy UGC Reel">High Energy UGC Reel</option>
                  <option value="Luxury Minimalist">Luxury Minimalist</option>
                  <option value="Flash Sale & Urgency">Flash Sale & Urgency</option>
                  <option value="B2B Professional">B2B Professional</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Platform Format & Video Options */}
          <div>
            <h3 className="text-sm font-extrabold text-white mb-3 flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-pink-400" />
              <span>3. Format, Aspect Ratio & Audio Settings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Platform & Ratio</label>
                <select
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value);
                    if (e.target.value.includes('Reels') || e.target.value.includes('Shorts')) setAspectRatio('9:16');
                    else if (e.target.value.includes('Feed')) setAspectRatio('1:1');
                    else setAspectRatio('16:9');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Instagram Reels">Instagram Reels (9:16)</option>
                  <option value="Meta Feed">Meta Feed (1:1)</option>
                  <option value="YouTube Shorts">YouTube Shorts (9:16)</option>
                  <option value="LinkedIn Landscape">LinkedIn Landscape (16:9)</option>
                </select>
              </div>

              {creativeType === 'video' && (
                <>
                  <div>
                    <label htmlFor="video-duration" className="block text-xs font-semibold text-slate-400 mb-1">Video Duration</label>
                    <select
                      id="video-duration"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value={3}>3 seconds</option>
                      <option value={5}>5 seconds</option>
                      <option value={8}>8 seconds</option>
                      <option value={10}>10 seconds</option>
                    </select>
                    {Number(duration) > 8 && (
                      <p role="alert" className="mt-1 text-xs text-red-400">
                        Cannot generate a video longer than 8 seconds.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">AI Voiceover Narrator</label>
                    <select
                      value={voiceover}
                      onChange={(e) => setVoiceover(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Priya (Indian Female - Energetic)">Priya (Hindi / Energetic)</option>
                      <option value="Rahul (Indian Male - Conversational)">Rahul (Hinglish / Male)</option>
                      <option value="Kavya (South Indian Female)">Kavya (Tamil / South)</option>
                      <option value="Sarah (US Commercial Female)">Sarah (US Commercial)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Background Audio Beat</label>
                    <select
                      value={audioTrack}
                      onChange={(e) => setAudioTrack(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Energetic Diwali Dhol Beats">Energetic Diwali Dhol Beats</option>
                      <option value="Trendy Commercial Synth Pop">Trendy Commercial Synth Pop</option>
                      <option value="Deep Bass Tech Product Reveal">Deep Bass Tech Product Reveal</option>
                      <option value="Acoustic Guitar Chill Vibe">Acoustic Guitar Chill Vibe</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>
                {creativeType === 'video'
                  ? 'Video generation uses Magic Hour credits based on the selected settings.'
                  : 'Generate an AI creative for your selected format.'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>Generate AI Creative Now</span>
            </button>
          </div>

        </form>

        {generatedVideoUrl && (
          <section aria-label="Generated video" className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-white">Your generated video</h2>
            <video
              controls
              playsInline
              src={generatedVideoUrl}
              className="w-full max-h-[640px] rounded-2xl bg-black"
            >
              Your browser does not support video playback.
            </video>
            <a
              href={generatedVideoUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200"
            >
              <ArrowRight className="w-4 h-4" />
              Open or download generated video
            </a>
          </section>
        )}

      </div>

    </div>
  );
};
