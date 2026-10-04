import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('adv_theme') || 'dark';
  });

  const [activeTab, setActiveTab] = useState('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState({
    name: '',
    email: '',
    company: '',
    tier: '',
    creditsRemaining: 0,
    creditsTotal: 0,
    avatar: ''
  });

  const [userProjects, setUserProjects] = useState([]);

  // authentication useEffect yahan aayega


  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setIsLoggedIn(false);
    return;
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid token");
      }

      
      setUser(data);
setIsLoggedIn(true);
setBrandKit(data.brandKit || {
  name: '',
  tagline: '',
  primaryColor: '',
  secondaryColor: '',
  accentColor: '',
  fontFamily: '',
  logoUrl: ''
});

try {
  const projectsResponse = await fetch(
    "http://localhost:5000/api/projects",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // const projectsData = await projectsResponse.json();
   const projectsData = await projectsResponse.json();

  if (!projectsResponse.ok) {
    throw new Error(
      projectsData.message || "Failed to fetch projects"
    );
  }

  setUserProjects(projectsData);

} catch (error) {
  console.log("Projects fetch failed:", error);
}

     
    } catch (error) {
      console.log("Authentication failed:", error);

      localStorage.removeItem("token");
      setUser({
        name: '',
        email: '',
        company: '',
        tier: '',
        creditsRemaining: 0,
        creditsTotal: 0,
        avatar: ''
      });
      setIsLoggedIn(false);
    }
  };

  fetchProfile();
}, []);



const [brandKit, setBrandKit] = useState({
  name: '',
  tagline: '',
  primaryColor: '',
  secondaryColor: '',
  accentColor: '',
  fontFamily: '',
  logoUrl: ''
});

  const loadAuthenticatedUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please log in first");
    }

    const profileResponse = await fetch(
      "http://localhost:5000/api/auth/profile",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const profile = await profileResponse.json();
    if (!profileResponse.ok) {
      localStorage.removeItem("token");
      throw new Error(profile.message || "Invalid token");
    }

    const projectsResponse = await fetch(
      "http://localhost:5000/api/projects",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const projects = await projectsResponse.json();
    if (!projectsResponse.ok) {
      throw new Error(projects.message || "Failed to fetch projects");
    }

    setUser(profile);
    setBrandKit(profile.brandKit || {
      name: '',
      tagline: '',
      primaryColor: '',
      secondaryColor: '',
      accentColor: '',
      fontFamily: '',
      logoUrl: ''
    });
    setUserProjects(projects);
    setIsLoggedIn(true);
    return profile;
  };

  // Current Active Creative loaded into Studio Editor
  const [activeCreative, setActiveCreative] = useState({
    id: 'gen-active-1',
    title: 'Diwali Glow Skincare Flash Sale',
    type: 'video',
    headline: '✨ Iss Diwali, Paye Glowing Sone Jaisi Rangat!',
    subtext: 'Get 40% Off + Free Gold Foil Serum on orders above ₹999',
    cta: 'Shop Diwali Glow',
    brandName: 'Aura Organics',
    aspectRatio: '9:16',
    platform: 'Instagram Reels',
    language: 'Hinglish',
    region: 'Pan-India',
    style: 'Festive Gold Glow',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    primaryColor: '#6366f1',
    secondaryColor: '#f59e0b',
    fontFamily: 'Plus Jakarta Sans',
    audioTrack: 'Energetic Diwali Dhol Beats',
    voiceover: 'Priya (Indian Female - Energetic)',
    showLogo: true,
    textPosition: 'bottom',
    filterStyle: 'vibrant'
  });

  
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('adv_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };



const navigateTo = (tab, payload = null) => {
  setActiveTab(tab);

  if (payload) {
    setActiveCreative(prev => {
      const updated = { ...prev, ...payload };
      return updated;
    });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

 const saveNewCreative = async (creativeData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      addToast("Please login first", "error");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/projects",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(creativeData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save project");
    }

    console.log("Project saved to MongoDB:", data);

    setUserProjects(prev => [data, ...prev]);

    setActiveCreative(data);

    setUser(prev => ({
      ...prev,
      creditsRemaining: Math.max(
        0,
        prev.creditsRemaining - 5
      ),
    }));

    addToast(
      "🎉 Creative saved to your projects!",
      "success"
    );

  } catch (error) {
    console.error("Save project error:", error);

    addToast(
      "❌ Failed to save project",
      "error"
    );
  }
};

  const updateProjectStatus = async (projectId, status) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update project status");
      }

      setUserProjects(prev =>
        prev.map(project =>
          (project._id ?? project.id) === projectId ? data : project
        )
      );
      setActiveCreative(prev =>
        (prev._id ?? prev.id) === projectId ? { ...prev, ...data } : prev
      );

      addToast(
        status === "Completed" ? "Project marked as completed" : "Project reopened",
        "success"
      );

      return data;
    } catch (error) {
      console.error("Update project status error:", error);
      addToast(error.message || "Failed to update project status", "error");
      return null;
    }
  };

  const updateProjectCriticScore = async (project, criticScore) => {
    if (!project?._id) {
      const updatedProject = { ...project, criticScore };
      setActiveCreative(prev =>
        (prev?._id ?? prev?.id) === (project?._id ?? project?.id)
          ? { ...prev, criticScore }
          : prev
      );
      return updatedProject;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        `http://localhost:5000/api/projects/${project._id}/critic-score`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ criticScore }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save critic score");
      }

      const updatedProject = { ...project, ...data };
      setUserProjects(prev =>
        prev.map(item =>
          (item._id ?? item.id) === project._id ? updatedProject : item
        )
      );
      setActiveCreative(prev =>
        (prev?._id ?? prev?.id) === project._id ? { ...prev, ...updatedProject } : prev
      );

      return updatedProject;
    } catch (error) {
      console.error("Save critic score error:", error);
      addToast(error.message || "Failed to save critic score", "error");
      return null;
    }
  };

  const deleteProject = async (project) => {
    const projectId = project?._id;

    if (!projectId) {
      setUserProjects(prev =>
        prev.filter(item => (item._id ?? item.id) !== (project?.id ?? projectId))
      );
      return true;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          method: "DELETE",
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
        if (!response.ok && response.status === 404) {
          throw new Error(
            "The backend does not have the project delete route loaded. Restart the backend server and try again."
          );
        }
        throw new Error("The server returned an invalid response while deleting the project.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      setUserProjects(prev =>
        prev.filter(item => (item._id ?? item.id) !== projectId)
      );
      setActiveCreative(prev =>
        (prev?._id ?? prev?.id) === projectId ? {} : prev
      );
      addToast("Asset deleted from library", "success");
      return true;
    } catch (error) {
      console.error("Delete project error:", error);
      addToast(error.message || "Failed to delete project", "error");
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      activeTab,
      setActiveTab,
      navigateTo,
      authModalOpen,
      setAuthModalOpen,
      isLoggedIn,
      setIsLoggedIn,
      loadAuthenticatedUser,
      user,
      setUser,
      brandKit,
      setBrandKit,
      activeCreative,
      setActiveCreative,
      userProjects,
      setUserProjects,
      saveNewCreative,
      updateProjectStatus,
      updateProjectCriticScore,
      deleteProject,
      toasts,
      addToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
