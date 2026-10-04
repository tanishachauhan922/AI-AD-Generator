import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderKanban, 
  Sparkles, 
  Search, 
  Video, 
  Image as ImageIcon, 
  Download, 
  Sliders, 
  CheckCircle2, 
  Trash2, 
  Copy, 
  Plus,
  FolderPlus,
  X,
  CalendarDays,
  Clock3
} from 'lucide-react';

const getProjectId = (project) => project._id ?? project.id;

const formatProjectDate = (value) => {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Not available'
    : date.toLocaleString();
};

export const ProjectsLibrary = () => {
  const { userProjects, setUserProjects, updateProjectStatus, deleteProject, navigateTo, addToast } = useApp();
  const [activeAssetType, setActiveAssetType] = useState('All'); // 'All' | 'video' | 'image'
  const [activeProjectStatus, setActiveProjectStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const orderedProjects = [...userProjects].sort((first, second) => {
    const statusOrder = (first.status === 'Completed' ? 1 : 0) - (second.status === 'Completed' ? 1 : 0);
    if (statusOrder !== 0) {
      return statusOrder;
    }

    return new Date(second.createdAt || 0).getTime() - new Date(first.createdAt || 0).getTime();
  });
  const activeProjects = orderedProjects.filter(project => project.status !== 'Completed');

  const filteredProjects = orderedProjects.filter(p => {
    const matchesType = activeAssetType === 'All' || p.type === activeAssetType;
    const matchesStatus = activeProjectStatus === 'All' || p.status === activeProjectStatus;
    const searchTerm = search.toLowerCase();
    const matchesSearch = [p.title, p.headline, p.brandName]
      .some(value => value?.toLowerCase().includes(searchTerm));
    return matchesType && matchesStatus && matchesSearch;
  });

  useEffect(() => {
    if (!selectedProject) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  const handleDelete = async (project) => {
    const deleted = await deleteProject(project);
    if (!deleted) {
      return;
    }

    if (selectedProject && getProjectId(selectedProject) === getProjectId(project)) {
      setSelectedProject(null);
    }
  };

  const handleDuplicate = (item) => {
    const copyItem = {
      ...item,
      id: 'gen-' + Date.now(),
      title: `${item.title} (Copy)`
    };
    setUserProjects(prev => [copyItem, ...prev]);
    addToast('📋 Duplicate creative created!', 'success');
  };

  const handleStatusChange = async (project) => {
    const nextStatus = project.status === 'Completed' ? 'Active' : 'Completed';
    const updatedProject = await updateProjectStatus(getProjectId(project), nextStatus);

    if (updatedProject && selectedProject && getProjectId(selectedProject) === getProjectId(project)) {
      setSelectedProject(updatedProject);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>Campaign & Asset Library</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">My Projects & Creative Assets</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize past generated image ads, video reels, brand kits, and copy presets.
          </p>
        </div>

        <button
          onClick={() => navigateTo('create')}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Creative</span>
        </button>
      </div>

      {/* Projects from the user's saved library */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeProjects.map(project => (
            <div key={getProjectId(project)} className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[140px]">{project.title || 'Untitled project'}</h4>
                  <p className="text-[10px] text-slate-400">
                    {project.type || 'Asset'}{project.createdAt ? ` • ${formatProjectDate(project.createdAt)}` : ''}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                project.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {project.status}
              </span>
            </div>
          ))}
          {activeProjects.length === 0 && (
            <p className="text-xs text-slate-400">No active projects. Completed projects remain in the asset list below.</p>
          )}
        </div>
      </div>

      {/* Assets Filtering Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved assets..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Active', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setActiveProjectStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeProjectStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              {status === 'All' ? 'All Projects' : status}
            </button>
          ))}
          <span className="h-5 border-l border-slate-700 mx-1" />
          {['All', 'video', 'image'].map(type => (
            <button
              key={type}
              onClick={() => setActiveAssetType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeAssetType === type
                  ? 'bg-indigo-600 text-white'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              {type === 'All' ? 'All Assets' : type === 'video' ? 'Video Reels' : 'Image Ads'}
            </button>
          ))}
        </div>

      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(item => (
          <div
            key={getProjectId(item)}
            className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
          >
            <button
              type="button"
             onClick={() => {
  console.log("Selected Project ID:", getProjectId(item));
  setSelectedProject(item);
}}

              aria-label={`View details for ${item.title || item.headline || 'project'}`}
              className="relative block w-full aspect-[4/5] bg-slate-950 overflow-hidden text-left"
            >
             {item.type === 'video' && item.videoUrl ? (
  <video
    src={item.videoUrl}
    className="w-full h-full object-cover"
    muted
    autoPlay
    loop
    playsInline
  />
) : item.imageUrl ? (
  <img
    src={item.imageUrl}
    alt={item.title || 'Project creative'}
    className="w-full h-full object-cover"
  />
) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700">
                    {item.type === 'video' ? <Video className="w-3 h-3 text-indigo-400 inline mr-1" /> : <ImageIcon className="w-3 h-3 text-pink-400 inline mr-1" />}
                    {item.platform || (item.type === 'video' ? 'Video' : 'Image')} {item.aspectRatio ? `(${item.aspectRatio})` : ''}
                  </span>
                  <span className={`px-2 py-1 rounded backdrop-blur-md text-[10px] font-bold border ${
                    item.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <span className="px-2 py-1 rounded bg-amber-500/20 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30">
                  {item.criticScore != null
                    ? `Critic ${item.criticScore}/100`
                    : 'Not scored'}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[10px] font-bold text-indigo-400 uppercase">{item.brandName || item.title || 'Project'}{item.language ? ` • ${item.language}` : ''}</p>
                <h3 className="text-xs font-bold text-white truncate mt-0.5">{item.headline || item.title || 'Untitled project'}</h3>
                <p className="text-[10px] text-slate-300 mt-2">Click to view details</p>
              </div>
            </button>

            <div className="p-3 bg-slate-900/80 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => navigateTo('studio', item)}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDuplicate(item)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleStatusChange(item)}
                  disabled={!item._id}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    item.status === 'Completed'
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={!item._id ? 'Only saved projects can have their status changed' : undefined}
                  aria-label={`${item.status === 'Completed' ? 'Reopen' : 'Mark'} ${item.title || 'project'} ${item.status === 'Completed' ? 'as active' : 'as completed'}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.status === 'Completed' ? 'Reopen' : 'Mark as Completed'}</span>
                </button>
              </div>

              <button
                onClick={() => handleDelete(item)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
        {filteredProjects.length === 0 && (
          <p className="text-xs text-slate-400">
            {userProjects.length === 0
              ? 'Your saved assets will appear here.'
              : 'No projects match the selected filters.'}
          </p>
        )}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-details-title"
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="Close project details"
              className="absolute right-3 top-3 z-10 rounded-lg bg-slate-950/80 p-2 text-slate-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

           {selectedProject.type === 'video' && selectedProject.videoUrl ? (
  <video
    src={selectedProject.videoUrl}
    controls
    playsInline
    className="max-h-72 w-full bg-slate-950 object-contain"
  />
) : selectedProject.imageUrl ? (
  <img
    src={selectedProject.imageUrl}
    alt={selectedProject.title || 'Project creative'}
    className="max-h-72 w-full bg-slate-950 object-contain"
  />
) : null}

            <div className="space-y-5 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-400">
                  {selectedProject.title || 'Project details'}
                </p>
                <h2 id="project-details-title" className="mt-1 text-xl font-bold text-white">
                  {selectedProject.headline || 'No headline available'}
                </h2>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Subtext</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-200">
                  {selectedProject.subtext || 'No subtext available'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Call to action</h3>
                <p className="mt-1 text-sm text-slate-200">{selectedProject.cta || 'No call to action available'}</p>
              </div>

              <div className="grid gap-4 border-t border-slate-700 pt-4 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 h-4 w-4 text-indigo-400" />
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400">Created</h3>
                    <p className="mt-1 text-xs text-slate-200">{formatProjectDate(selectedProject.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock3 className="mt-0.5 h-4 w-4 text-pink-400" />
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400">Last updated</h3>
                    <p className="mt-1 text-xs text-slate-200">{formatProjectDate(selectedProject.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

    </div>
  );
};
