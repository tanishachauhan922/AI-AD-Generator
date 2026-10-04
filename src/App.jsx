import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { CreateAdHub } from './components/CreateAdHub';
import { TemplateGallery } from './components/TemplateGallery';
import { TemplateCustomization } from './components/TemplateCustomization';
import { StudioEditor } from './components/StudioEditor';
import { CreativeCriticPanel } from './components/CreativeCriticPanel';
import { ProjectsLibrary } from './components/ProjectsLibrary';
import { SettingsPage } from './components/SettingsPage';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

const MainContent = () => {
  const { activeTab, toasts } = useApp();

  const renderView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'create':
        return <CreateAdHub />;
      case 'templates':
        return <TemplateGallery />;
      case 'template-customization':
        return <TemplateCustomization />;
      case 'studio':
        return <StudioEditor />;
      case 'critic':
        return <CreativeCriticPanel />;
      case 'projects':
        return <ProjectsLibrary />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900 transition-colors duration-300">
      <div>
        <Navbar />
        <main className="animate-in fade-in duration-200">
          {renderView()}
        </main>
      </div>

      <Footer />

      {/* Global Toast Notifications Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl glass-panel shadow-2xl border text-xs font-bold flex items-center justify-between animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success' ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/80' :
              toast.type === 'info' ? 'border-indigo-500/40 text-indigo-300 bg-indigo-950/80' :
              'border-amber-500/40 text-amber-300 bg-amber-950/80'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
