import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [footerPad, setFooterPad] = useState(0);

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!user || user.user_type !== "user") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const update = () => setFooterPad(Math.ceil(footer.getBoundingClientRect().height));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "settings", label: "Account Settings", icon: "settings" }
  ];
  const clubs = [
    {
      id: "braunau",
      title: "Pascha Braunau am Inn",
      desc: "Our exclusive Laufhaus location in Braunau featuring luxury rooms and premium amenities.",
      img: "/wp-content/uploads/2026/05/gallery-07-scaled.webp",
      status: "Active & Live",
      path: "/girls/braunau"
    },
    {
      id: "salzburg",
      title: "Pasha Salzburg",
      desc: "Experience high-end companion services and premium lounge facilities in Salzburg.",
      img: "/wp-content/uploads/2026/05/gallery-03-scaled.webp",
      status: "Active & Live",
      path: "/girls/salzburg"
    },
    {
      id: "nightclub",
      title: "Pasha Nightclub",
      desc: "The ultimate club experience. Exquisite drinks, gorgeous atmosphere and live entertainment.",
      img: "/wp-content/uploads/2026/05/gallery-01-scaled.webp",
      status: "Active & Live",
      path: "/girls/nightclub"
    }
  ];
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] focus:ring-1 focus:ring-[#E3087E] transition-all duration-300";
  const labelClass = "block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1";

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0c0f0f] selection:bg-[#E3087E] selection:text-white" style={{ paddingBottom: footerPad }}>
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Serif',serif] text-4xl font-bold text-white mb-2">Welcome, {user.name}</h1>
          <p className="text-white/40 text-sm font-['Be_Vietnam_Pro']">Member Since: January 2026 | Status: <span className="text-[#E3087E] font-bold tracking-widest uppercase">Platinum</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-300
                  ${activeTab === tab.id 
                    ? 'bg-[#E3087E] text-white shadow-[0_10px_30px_rgba(227,8,126,0.3)]' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="glass-card p-6 md:p-10 rounded-[40px] border border-white/10 min-h-[500px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E3087E]/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

              {/* Dashboard Tab with Club Cards */}
              {activeTab === "dashboard" && (
                <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="font-['Serif',serif] text-2xl font-bold text-white mb-2">Pascha Locations</h2>
                    <p className="text-white/40 text-sm">Select any location to view real-time suite and room availability calendar.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {clubs.map((club) => (
                      <div key={club.id} className="group relative bg-white/5 border border-white/10 rounded-[30px] overflow-hidden flex flex-col justify-between hover:border-[#E3087E]/50 transition-all duration-500 shadow-xl">
                        <div>
                          {/* Image */}
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img 
                              src={club.img} 
                              alt={club.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f0f] via-transparent to-transparent" />
                            <span className="absolute top-4 left-4 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1 h-1 bg-[#00ff88] rounded-full animate-pulse" />
                              {club.status}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="font-['Serif',serif] text-xl font-bold text-white mb-2">{club.title}</h3>
                            <p className="text-white/40 text-xs leading-relaxed font-['Be_Vietnam_Pro']">{club.desc}</p>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="p-6 pt-0">
                          <button
                            onClick={() => navigate(club.path)}
                            className="w-full py-3.5 bg-white/5 group-hover:bg-[#E3087E] text-white font-bold uppercase tracking-widest text-[10px] rounded-xl border border-white/10 group-hover:border-[#E3087E] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px]">explore</span>
                            See Ladies
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                  <h2 className="font-['Serif',serif] text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Account Settings</h2>
                  
                  <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={labelClass}>Full Name</label>
                        <input type="text" defaultValue={user.name} className={inputClass} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Phone Number</label>
                        <input type="tel" defaultValue="+43 664 123 4567" className={inputClass} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className={labelClass}>Email Address</label>
                        <input type="email" defaultValue={user.email} className={inputClass} />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/10">
                      <h3 className="text-white font-bold mb-6">Change Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className={labelClass}>New Password</label>
                          <input type="password" placeholder="••••••••" className={inputClass} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>Confirm Password</label>
                          <input type="password" placeholder="••••••••" className={inputClass} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex flex-wrap gap-4">
                      <button className="px-8 py-4 bg-[#E3087E] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#c0066a] transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] text-xs">
                        Save Changes
                      </button>
                      <button 
                        type="button"
                        onClick={handleSignOut}
                        className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-white/60 font-bold uppercase tracking-widest rounded-xl transition-all text-xs"
                      >
                        Sign Out
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
