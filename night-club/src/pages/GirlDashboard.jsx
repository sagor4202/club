import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReservationCalendar from "../components/ReservationCalendar";

const DEFAULT_RATES = [
  { time: "20 MIN", price: "80 EURO" },
  { time: "30 MIN", price: "120 EURO" },
  { time: "1 Hours", price: "170 EURO" },
];

export default function GirlDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [footerPad, setFooterPad] = useState(0);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // Profile state
  const [profile, setProfile] = useState({
    name: "", age: "", height: "", weight: "",
    measurements: "", languages: "", desc: "", whatsapp: "",
    nightclub_from_datetime: "", nightclub_to_datetime: "",
    images: [], services: [], prices: []
  });
  const [thumbnailId, setThumbnailId] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);

  // Services state
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [prices, setPrices] = useState([]);
  const [newPriceTime, setNewPriceTime] = useState("");
  const [newPriceRate, setNewPriceRate] = useState("");
  const [servicesSaving, setServicesSaving] = useState(false);
  const [servicesMsg, setServicesMsg] = useState(null);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  // Reservations
  const [reservations, setReservations] = useState([]);
  const [ncReqFrom, setNcReqFrom] = useState("");
  const [ncReqTo, setNcReqTo] = useState("");
  const [ncReqLoading, setNcReqLoading] = useState(false);
  const [ncReqMsg, setNcReqMsg] = useState(null);

  // Reservation request state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedAvailDates, setSelectedAvailDates] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqMsg, setReqMsg] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showNcModal, setShowNcModal] = useState(false);

  const PRICES = {
    "EU Ladies/Non Asian Ladies": { braunau: 700, salzburg: 850 },
    "Chinese/Asian Ladies":       { braunau: 750, salzburg: 1000 },
    "Trans Ladies":               { braunau: 750, salzburg: 1000 },
  };

  const CATEGORIES = ["EU Ladies/Non Asian Ladies", "Chinese/Asian Ladies", "Trans Ladies"];
  const LOCATIONS = [
    { id: "braunau", label: "Pascha Laufhaus - Braunau am Inn" },
    { id: "salzburg", label: "Pascha Laufhaus - Salzburg" },
  ];

  useEffect(() => {
    if (!user || user.user_type !== "girl") navigate("/login");
  }, [user, navigate]);

  // Fetch girl's own profile data
  useEffect(() => {
    if (!user?.email) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/wp-json/pascha/v1/girls?t=${Date.now()}`);
        if (res.ok) {
          const girls = await res.json();
          const me = girls.find(g => g.email === user.email);
          if (me) {
            // Normalize images to {id, url, type, isNew} format
            const normalizedImages = (me.images || []).map((item, idx) => {
              const url = typeof item === "string" ? item : item.url;
              const type = typeof item === "string" ? "image" : item.type;
              return {
                id: `existing-${idx}-${Date.now()}-${Math.random()}`,
                url,
                type,
                isNew: false
              };
            });
            setProfile({
              name: me.name || "",
              age: me.age || "",
              height: me.height || "",
              weight: me.weight || "",
              measurements: me.measurements || "",
              languages: me.languages || "",
              whatsapp: me.whatsapp || "",
              nightclub_from_datetime: me.nightclub_from_datetime || me.nightclub_from_time || "",
              nightclub_to_datetime: me.nightclub_to_datetime || me.nightclub_to_time || "",
              desc: me.desc || "",
              images: normalizedImages,
              services: me.services || [],
              prices: me.prices?.length ? me.prices : DEFAULT_RATES
            });
            setServices(me.services || []);
            setPrices(me.prices?.length ? me.prices : DEFAULT_RATES);
            
            // Find current thumbnail and set thumbnailId
            if (me.img && normalizedImages.length) {
              const thumbItem = normalizedImages.find(m => m.url === me.img);
              if (thumbItem) {
                setThumbnailId(thumbItem.id);
              } else {
                setThumbnailId(normalizedImages[0].id);
              }
            } else if (normalizedImages.length) {
              setThumbnailId(normalizedImages[0].id);
            }
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, [user]);

  // Fetch reservations
  const fetchReservations = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/wp-json/pascha/v1/reservations?t=${Date.now()}`);
      if (res.ok) setReservations(await res.json());
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchReservations(); }, [user]);

  // Inbox state
  const [inboxMessages, setInboxMessages] = useState([]);

  // Fetch inbox
  useEffect(() => {
    if (!user) return;
    const fetchInbox = async () => {
      try {
        const res = await fetch(`/wp-json/pascha/v1/inbox?email=${user.email}&t=${Date.now()}`);
        if (res.ok) setInboxMessages(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchInbox();
  }, [user]);

  const handleMarkAsRead = async (msgId) => {
    try {
      const res = await fetch("/wp-json/pascha/v1/inbox/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, message_id: msgId })
      });
      if (res.ok) {
        setInboxMessages(prev => prev.map(m => m.id === msgId ? { ...m, is_read: true } : m));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const update = () => setFooterPad(Math.ceil(footer.getBoundingClientRect().height));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const myReservations = reservations.filter(r =>
    (r.user_email && r.user_email === user?.email) || r.girl_name === user?.name
  );

  const bookedDates = (() => {
    const booked = [];
    myReservations.forEach(res => {
      const start = new Date(res.start_date);
      const end = new Date(res.end_date);
      const d = new Date(start);
      while (d <= end) { booked.push(d.toDateString()); d.setDate(d.getDate() + 1); }
    });
    return booked;
  })();

  const handleSignOut = () => { localStorage.removeItem("user"); navigate("/login"); };

  const isVideoUrl = (url) => {
    if (!url) return false;
    const videoExts = [".mp4", ".webm", ".ogg", ".mov", ".qt", ".avi", ".mkv"];
    return videoExts.some(ext => url.toLowerCase().includes(ext) || url.toLowerCase().endsWith(ext));
  };

  // File selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map((file, idx) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video/") ? "video" : "image";
      return {
        id: `new-${idx}-${Date.now()}-${Math.random()}`,
        url,
        type,
        file,
        isNew: true
      };
    });
    setProfile(prev => ({
      ...prev,
      images: [...prev.images, ...newItems]
    }));
    if (!thumbnailId && newItems.length > 0) {
      setThumbnailId(newItems[0].id);
    }
  };

  // Remove gallery item
  const removeGalleryItem = (id) => {
    setProfile(prev => {
      const updated = prev.images.filter(img => img.id !== id);
      if (thumbnailId === id) {
        if (updated.length > 0) setThumbnailId(updated[0].id);
        else setThumbnailId(null);
      }
      return { ...prev, images: updated };
    });
  };

  // Drag and Drop reordering helpers
  const reorderItems = (fromIdx, toIdx) => {
    setProfile(prev => {
      const nextImages = [...prev.images];
      const [moved] = nextImages.splice(fromIdx, 1);
      nextImages.splice(toIdx, 0, moved);
      return { ...prev, images: nextImages };
    });
  };

  const handleDragStart = (idx) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, idx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    reorderItems(draggedIdx, idx);
    setDraggedIdx(null);
  };

  const handleTouchStart = (idx) => {
    setDraggedIdx(idx);
  };

  const handleTouchEnd = (e) => {
    if (draggedIdx === null) return;
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropTarget = element?.closest("[data-drag-index]");
    if (dropTarget) {
      const targetIdx = parseInt(dropTarget.getAttribute("data-drag-index"), 10);
      if (!isNaN(targetIdx) && targetIdx !== draggedIdx) {
        reorderItems(draggedIdx, targetIdx);
      }
    }
    setDraggedIdx(null);
  };

  // Save profile (text + images)
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("name", profile.name);
      formData.append("age", profile.age);
      formData.append("height", profile.height);
      formData.append("weight", profile.weight);
      formData.append("measurements", profile.measurements);
      formData.append("languages", profile.languages);
      formData.append("whatsapp", profile.whatsapp);
      formData.append("nightclub_from_datetime", profile.nightclub_from_datetime);
      formData.append("nightclub_to_datetime", profile.nightclub_to_datetime);
      formData.append("desc", profile.desc);

      const newItems = profile.images.filter(item => item.isNew);
      const order = profile.images.map(item => {
        if (item.isNew) {
          const idx = newItems.findIndex(n => n.id === item.id);
          return { type: "new", index: idx };
        } else {
          return { type: "existing", url: item.url, mediaType: item.type };
        }
      });
      formData.append("gallery_order", JSON.stringify(order));

      newItems.forEach(item => {
        formData.append("new_images[]", item.file);
      });

      const finalThumbIdx = profile.images.findIndex(item => item.id === thumbnailId);
      formData.append("thumbnail_index", finalThumbIdx >= 0 ? finalThumbIdx : 0);

      const res = await fetch("/wp-json/pascha/v1/girls/me", { method: "POST", body: formData });
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch (e) { console.error("Non-JSON response:", text); }
      
      if (res.ok) {
        setProfileMsg({ type: "success", text: "Profile saved successfully!" });
        if (data.images) {
          const normalized = data.images.map((item, idx) => {
            const url = typeof item === "string" ? item : item.url;
            const type = typeof item === "string" ? "image" : item.type;
            return {
              id: `existing-${idx}-${Date.now()}-${Math.random()}`,
              url,
              type,
              isNew: false
            };
          });
          setProfile(prev => ({ ...prev, images: normalized }));
          
          if (data.images.length > 0) {
            const thumbUrl = data.images[finalThumbIdx >= 0 ? finalThumbIdx : 0]?.url || data.images[0]?.url || data.images[0];
            const matchingItem = normalized.find(img => img.url === (typeof thumbUrl === "string" ? thumbUrl : thumbUrl.url));
            if (matchingItem) {
              setThumbnailId(matchingItem.id);
            } else {
              setThumbnailId(normalized[0].id);
            }
          } else {
            setThumbnailId(null);
          }
        }
        const updatedUser = { ...user, name: profile.name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        setProfileMsg({ type: "error", text: data.message || `Save failed. (Status: ${res.status})` });
      }
    } catch (err) {
      console.error(err);
      setProfileMsg({ type: "error", text: "Network error or file too large." });
    } finally { setProfileSaving(false); }
  };

  // Save services & rates
  const handleSaveServices = async () => {
    setServicesSaving(true);
    setServicesMsg(null);
    try {
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("services", JSON.stringify(services));
      formData.append("prices", JSON.stringify(prices));
      const res = await fetch("/wp-json/pascha/v1/girls/me", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setServicesMsg({ type: "success", text: "Services & Rates saved!" });
      else setServicesMsg({ type: "error", text: data.message || "Save failed." });
    } catch (err) {
      setServicesMsg({ type: "error", text: "Network error." });
    } finally { setServicesSaving(false); }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    if (newPassword !== confirmPassword) {
      setPassMsg({ type: "error", text: "Passwords do not match." }); return;
    }
    if (newPassword.length < 8) {
      setPassMsg({ type: "error", text: "Password must be at least 8 characters." }); return;
    }
    setPassLoading(true);
    try {
      const res = await fetch("/wp-json/pascha/v1/girls/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, new_password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPassMsg({ type: "success", text: "Password updated! Please log in again." });
        setNewPassword(""); setConfirmPassword("");
        setTimeout(() => { handleSignOut(); }, 2500);
      } else {
        setPassMsg({ type: "error", text: data.message || "Update failed." });
      }
    } catch (err) {
      setPassMsg({ type: "error", text: "Network error." });
    } finally { setPassLoading(false); }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] focus:ring-1 focus:ring-[#E3087E] transition-all duration-300";
  const labelClass = "block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1";

  const TABS = [
    { id: "profile", label: "Profile & Gallery", icon: "person" },
    { id: "calendar", label: "Reservations", icon: "calendar_month" },
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "inbox", label: "Appointments", icon: "mail" },
    { id: "services", label: "Services & Rates", icon: "sell" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const profileLocation = () => {
    const active = reservations.find(r => {
      const isMine = (r.user_email && r.user_email === user?.email) || r.girl_name === user?.name;
      if (!isMine) return false;
      const today = new Date(); today.setHours(0,0,0,0);
      const start = new Date(r.start_date); start.setHours(0,0,0,0);
      const end = new Date(r.end_date); end.setHours(23,59,59,999);
      return today >= start && today <= end;
    });
    if (active) return active.location === "braunau" ? "Pascha Braunau am Inn" : active.location === "salzburg" ? "Pasha Salzburg" : active.location;
    return "Not Currently Active";
  };

  if (!user) return null;

  const selectedThumbItem = profile.images.find(img => img.id === thumbnailId) || profile.images[0];
  const avatarImg = selectedThumbItem?.url || "/wp-content/uploads/2026/05/gallery-01-scaled.webp";
  const avatarIsVideo = selectedThumbItem?.type === "video" || isVideoUrl(avatarImg);

  return (
    <div className="min-h-screen bg-[#0c0f0f] selection:bg-[#E3087E] selection:text-white" style={{ paddingBottom: footerPad }}>
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full border-2 border-[#E3087E] overflow-hidden p-1 shadow-[0_0_20px_rgba(227,8,126,0.3)]">
              {avatarIsVideo
                ? <video src={avatarImg} className="w-full h-full object-cover rounded-full" muted playsInline />
                : <img src={avatarImg} alt="Avatar" className="w-full h-full object-cover rounded-full" />}
            </div>
            <div>
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-1">
                <h1 className="font-['Serif',serif] text-4xl font-bold text-white">{user.name}</h1>
                <span className="bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-2 sm:mt-0">
                  <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                  Verified Active
                </span>
              </div>
              <p className="text-white/40 text-sm font-['Be_Vietnam_Pro'] mt-1 sm:mt-0">Current Location: {profileLocation()}</p>
            </div>
          </div>
          <Link to={`/profile/${user.name}`}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 text-xs font-bold uppercase tracking-widest hover:text-[#E3087E] hover:border-[#E3087E]/30 transition-all">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            View Public Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-none lg:w-full flex items-center gap-2 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold uppercase tracking-widest text-[10px] lg:text-xs transition-all duration-300
                  ${activeTab === tab.id ? 'bg-[#E3087E] text-white shadow-[0_10px_30px_rgba(227,8,126,0.3)]' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}>
                <span className="material-symbols-outlined text-sm lg:text-base">{tab.icon}</span>
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="glass-card p-6 md:p-10 rounded-[40px] border border-white/10 min-h-[500px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E3087E]/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <h2 className="font-['Serif',serif] text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Dashboard Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#E3087E]/10 blur-[40px] rounded-full -mr-12 -mt-12" />
                      <span className="material-symbols-outlined text-[#E3087E] text-3xl mb-3">book_online</span>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Total Reservations</p>
                      <h3 className="text-3xl font-bold text-white mt-1">{myReservations.length}</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff88]/10 blur-[40px] rounded-full -mr-12 -mt-12" />
                      <span className="material-symbols-outlined text-[#00ff88] text-3xl mb-3">photo_library</span>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Gallery Images</p>
                      <h3 className="text-3xl font-bold text-white mt-1">{profile.images.length}</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[40px] rounded-full -mr-12 -mt-12" />
                      <span className="material-symbols-outlined text-blue-400 text-3xl mb-3">sell</span>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Services Listed</p>
                      <h3 className="text-3xl font-bold text-white mt-1">{services.length}</h3>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      {[{tab:"profile", icon:"person", label:"Edit Profile"},{tab:"services", icon:"sell", label:"Update Services"},{tab:"calendar", icon:"calendar_month", label:"View Calendar"},{tab:"settings", icon:"settings", label:"Settings"}].map(a => (
                        <button key={a.tab} onClick={() => setActiveTab(a.tab)}
                          className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 text-xs font-bold uppercase tracking-widest hover:text-[#E3087E] hover:border-[#E3087E]/30 transition-all">
                          <span className="material-symbols-outlined text-sm">{a.icon}</span>{a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar Tab */}
              {activeTab === "calendar" && (
                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                      <h2 className="font-['Serif',serif] text-xl sm:text-2xl font-bold text-white">My Calendar</h2>
                      <p className="text-white/40 text-xs sm:text-sm mt-0.5">Manage your reservation requests</p>
                    </div>
                    <button onClick={() => setShowChoiceModal(true)}
                      className="w-full sm:w-auto px-5 py-3 bg-[#E50D7E] text-white font-bold uppercase tracking-widest rounded-xl text-[11px] hover:brightness-110 transition-all shadow-[0_10px_25px_rgba(229,13,126,0.3)] flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">add</span>
                      New Reservation
                    </button>
                  </div>

                  {/* Existing Requests List */}
                  {reservations.filter(r => r.girl_name === user?.name || r.user_email === user?.email).length === 0 ? (
                    <div className="text-center py-16 sm:py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                      <span className="material-symbols-outlined text-4xl sm:text-5xl text-white/10 block mb-4">calendar_month</span>
                      <p className="text-white/30 text-xs sm:text-sm font-bold uppercase tracking-widest">No requests yet</p>
                      <p className="text-white/20 text-[10px] sm:text-xs mt-2">Click "New Reservation" to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {reservations.filter(r => r.girl_name === user?.name || r.user_email === user?.email).map(r => (
                        <div key={r.id} className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${r.status === 'approved' ? 'bg-[#00ff88]/10 text-[#00ff88]' : r.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-400'}`}>
                              <span className="material-symbols-outlined text-base sm:text-lg">{r.status === 'approved' ? 'check' : r.status === 'pending' ? 'schedule' : 'close'}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-bold text-xs sm:text-sm truncate">{r.location} {r.room_number ? `• Room ${r.room_number}` : ''}</p>
                              <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-widest mt-0.5 truncate">{r.start_date} → {r.end_date} {r.cost ? `• €${r.cost}` : ''}</p>
                            </div>
                          </div>
                          <span className={`self-start sm:self-auto text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 sm:px-3 py-1 rounded-lg ${r.status === 'approved' ? 'bg-[#00ff88]/10 text-[#00ff88]' : r.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-400'}`}>{r.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
              {/* Inbox Tab */}
              {activeTab === "inbox" && (
                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-['Serif',serif] text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Appointments / Inbox</h2>
                  {inboxMessages.length === 0 ? (
                    <div className="text-center py-16 text-white/30">
                      <span className="material-symbols-outlined text-5xl mb-4 block">mail</span>
                      <p className="text-sm font-bold uppercase tracking-widest">No messages yet</p>
                    </div>
                  ) : inboxMessages.map((msg) => (
                    <div key={msg.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[#E3087E]/50 transition-colors mb-4 relative overflow-hidden">
                      {!msg.is_read && <div className="absolute top-0 left-0 w-1 h-full bg-[#E3087E]"></div>}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-bold text-lg">{msg.name}</h3>
                          {!msg.is_read && <span className="bg-[#E3087E]/20 text-[#E3087E] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">New</span>}
                        </div>
                        <p className="text-white/60 text-sm mb-1"><span className="font-bold text-white/40">Email:</span> {msg.email} | <span className="font-bold text-white/40">Phone:</span> {msg.phone}</p>
                        <p className="text-white/60 text-sm mb-3"><span className="font-bold text-white/40">Preferred Date:</span> {msg.date}</p>
                        <div className="bg-black/20 p-4 rounded-xl text-white/80 text-sm italic">
                          "{msg.message}"
                        </div>
                        <p className="text-white/30 text-[10px] uppercase tracking-widest mt-4">Received: {new Date(msg.created_at).toLocaleString()}</p>
                      </div>
                      {!msg.is_read && (
                        <div className="text-right">
                          <button onClick={() => handleMarkAsRead(msg.id)} className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-[#E3087E] hover:border-[#E3087E] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                            Mark as Read
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}



              {/* Profile & Gallery Tab */}
              {activeTab === "profile" && (
                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-['Serif',serif] text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Profile & Gallery</h2>
                  <div className="space-y-8">
                    {/* Info Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={labelClass}>Stage Name</label>
                        <input type="text" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} className={inputClass} placeholder="Your stage name" />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Age</label>
                        <input type="number" value={profile.age} onChange={e => setProfile(p => ({...p, age: e.target.value}))} className={inputClass} placeholder="e.g. 23" />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Height</label>
                        <input type="text" value={profile.height} onChange={e => setProfile(p => ({...p, height: e.target.value}))} className={inputClass} placeholder="e.g. 168cm" />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Weight</label>
                        <input type="text" value={profile.weight} onChange={e => setProfile(p => ({...p, weight: e.target.value}))} className={inputClass} placeholder="e.g. 55kg" />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Measurements</label>
                        <input type="text" value={profile.measurements} onChange={e => setProfile(p => ({...p, measurements: e.target.value}))} className={inputClass} placeholder="e.g. 88-60-90" />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Languages</label>
                        <input type="text" value={profile.languages} onChange={e => setProfile(p => ({...p, languages: e.target.value}))} className={inputClass} placeholder="e.g. English, German" />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>WhatsApp Number</label>
                        <input type="text" value={profile.whatsapp} onChange={e => setProfile(p => ({...p, whatsapp: e.target.value}))} className={inputClass} placeholder="e.g. 43123456789" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className={labelClass}>About Me / Bio</label>
                        <textarea rows="4" value={profile.desc} onChange={e => setProfile(p => ({...p, desc: e.target.value}))} className={inputClass} placeholder="Write something about yourself..." />
                      </div>
                    </div>

                    {/* Gallery */}
                    <div className="pt-6 border-t border-white/10">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                        <div>
                          <h3 className="text-white font-bold">Gallery Images</h3>
                          <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1">Select the radio button below an image to set it as your thumbnail</p>
                        </div>
                        <button onClick={() => fileInputRef.current?.click()}
                          className="text-[#E3087E] text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors bg-[#E3087E]/10 px-4 py-2 rounded-lg border border-[#E3087E]/30">
                          <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                          Upload Images / Videos
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime" multiple className="hidden" onChange={handleFileSelect} />
                      </div>

                      {/* Unified Gallery Grid */}
                      {profile.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                          {profile.images.map((media, idx) => {
                            const isVideo = media.type === "video" || isVideoUrl(media.url);
                            const url = media.url;
                            const isSelectedThumbnail = thumbnailId === media.id;
                            return (
                              <div key={media.id} className="group relative"
                                data-drag-index={idx}
                                draggable
                                onDragStart={() => handleDragStart(idx)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, idx)}
                                onTouchStart={() => handleTouchStart(idx)}
                                onTouchEnd={handleTouchEnd}
                              >
                                <div className={`aspect-[3/4] rounded-xl overflow-hidden relative border-2 transition-all cursor-move ${isSelectedThumbnail ? "border-[#E3087E] shadow-[0_0_20px_rgba(227,8,126,0.4)]" : "border-white/10"} ${draggedIdx === idx ? "opacity-50" : "opacity-100"}`}>
                                  {isVideo
                                    ? <video src={url} className="w-full h-full object-cover pointer-events-none" muted playsInline />
                                    : <img src={url} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover pointer-events-none" />}
                                  
                                  {isVideo && (
                                    <div className="absolute bottom-2 right-2 bg-black/70 rounded-full px-2 py-0.5 flex items-center gap-1">
                                      <span className="material-symbols-outlined text-white text-[12px]">videocam</span>
                                      <span className="text-white text-[9px] font-bold uppercase">Video</span>
                                    </div>
                                  )}
                                  
                                  {media.isNew && (
                                    <div className="absolute top-2 left-2 bg-[#E3087E]/80 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">New</div>
                                  )}
                                  
                                  {isSelectedThumbnail && !media.isNew && (
                                    <div className="absolute top-2 left-2 bg-[#E3087E] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">Thumbnail</div>
                                  )}
                                  
                                  <button onClick={() => removeGalleryItem(media.id)}
                                    className="absolute top-2 right-2 bg-black/70 hover:bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                  </button>
                                </div>
                                <label className="flex items-center gap-2 mt-2 cursor-pointer justify-center">
                                  <input type="radio" name="thumbnail" checked={isSelectedThumbnail} onChange={() => setThumbnailId(media.id)}
                                    className="accent-[#E3087E] w-4 h-4 cursor-pointer" />
                                  <span className="text-white/40 text-[10px] uppercase tracking-widest">Set Thumbnail</span>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {profile.images.length === 0 && (
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center mt-4 cursor-pointer hover:border-[#E3087E]/40 transition-colors" onClick={() => fileInputRef.current?.click()}>
                          <span className="material-symbols-outlined text-4xl text-white/20 mb-3 block">add_photo_alternate</span>
                          <p className="text-white/40 text-sm">Click to upload your first images</p>
                        </div>
                      )}
                    </div>

                    {/* Save button & message */}
                    {profileMsg && (
                      <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center ${profileMsg.type === 'success' ? 'bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88]' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                        {profileMsg.text}
                      </div>
                    )}
                    <button onClick={handleSaveProfile} disabled={profileSaving}
                      className="w-full sm:w-auto px-8 py-4 bg-[#E3087E] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#c0066a] transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] text-xs disabled:opacity-50 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">{profileSaving ? 'hourglass_top' : 'save'}</span>
                      {profileSaving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === "services" && (
                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-['Serif',serif] text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Services & Rates</h2>
                  <div className="space-y-8">
                    {/* Services */}
                    <div>
                      <h3 className="text-white font-bold mb-4">Included Services</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {services.map((s, idx) => (
                          <span key={idx} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold flex items-center gap-2">
                            {s}
                            <button onClick={() => setServices(sv => sv.filter((_, i) => i !== idx))} className="hover:text-red-400 transition-colors">
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input type="text" value={newService} onChange={e => setNewService(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter' && newService.trim()) { setServices(sv => [...sv, newService.trim()]); setNewService(""); }}}
                          placeholder="Add a service (press Enter)" className={`${inputClass} flex-1`} />
                        <button onClick={() => { if (newService.trim()) { setServices(sv => [...sv, newService.trim()]); setNewService(""); }}}
                          className="px-5 py-3 bg-[#E3087E]/10 border border-[#E3087E]/30 text-[#E3087E] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#E3087E] hover:text-white transition-all flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">add</span>Add
                        </button>
                      </div>
                    </div>

                    {/* Rates */}
                    <div className="pt-6 border-t border-white/10">
                      <h3 className="text-white font-bold mb-4">Rates</h3>
                      <div className="space-y-3 mb-4">
                        {prices.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                            <span className="text-[#E3087E] font-bold text-sm flex-1">{p.time}</span>
                            <span className="text-white font-bold">{p.price}</span>
                            <button onClick={() => setPrices(pr => pr.filter((_, i) => i !== idx))} className="text-white/30 hover:text-red-400 transition-colors">
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input type="text" value={newPriceTime} onChange={e => setNewPriceTime(e.target.value)} placeholder="Duration (e.g. 1 Hour)" className={`${inputClass} flex-1`} />
                        <input type="text" value={newPriceRate} onChange={e => setNewPriceRate(e.target.value)} placeholder="Rate (e.g. €150)" className={`${inputClass} flex-1`} />
                        <button onClick={() => { if (newPriceTime.trim() && newPriceRate.trim()) { setPrices(pr => [...pr, { time: newPriceTime.trim(), price: newPriceRate.trim() }]); setNewPriceTime(""); setNewPriceRate(""); }}}
                          className="px-5 py-3 bg-[#E3087E]/10 border border-[#E3087E]/30 text-[#E3087E] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#E3087E] hover:text-white transition-all flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">add</span>Add
                        </button>
                      </div>
                    </div>

                    {servicesMsg && (
                      <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center ${servicesMsg.type === 'success' ? 'bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88]' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                        {servicesMsg.text}
                      </div>
                    )}
                    <button onClick={handleSaveServices} disabled={servicesSaving}
                      className="w-full sm:w-auto px-8 py-4 bg-[#E3087E] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#c0066a] transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] text-xs disabled:opacity-50 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">{servicesSaving ? 'hourglass_top' : 'save'}</span>
                      {servicesSaving ? "Saving..." : "Save Services & Rates"}
                    </button>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <h2 className="font-['Serif',serif] text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Settings</h2>

                  {/* Change Password */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#E3087E]/10 flex items-center justify-center text-[#E3087E]">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold">Change Password</h3>
                        <p className="text-white/30 text-[10px] uppercase tracking-widest">You will be logged out after changing your password</p>
                      </div>
                    </div>
                    <form onSubmit={handleChangePassword} className="space-y-5">
                      <div className="space-y-2">
                        <label className={labelClass}>New Password</label>
                        <div className="relative">
                          <input type={showNewPass ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                            placeholder="Enter new password" className={`${inputClass} pr-12`} />
                          <button type="button" onClick={() => setShowNewPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[18px]">{showNewPass ? "visibility_off" : "visibility"}</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Confirm New Password</label>
                        <div className="relative">
                          <input type={showConfirmPass ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password" className={`${inputClass} pr-12`} />
                          <button type="button" onClick={() => setShowConfirmPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[18px]">{showConfirmPass ? "visibility_off" : "visibility"}</span>
                          </button>
                        </div>
                      </div>
                      {passMsg && (
                        <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center ${passMsg.type === 'success' ? 'bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88]' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                          {passMsg.text}
                        </div>
                      )}
                      <button type="submit" disabled={passLoading}
                        className="w-full sm:w-auto px-8 py-4 bg-[#E3087E] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#c0066a] transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] text-xs disabled:opacity-50 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">{passLoading ? 'hourglass_top' : 'lock_reset'}</span>
                        {passLoading ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  </div>

                  {/* Sign Out */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                        <span className="material-symbols-outlined">logout</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold">Sign Out</h3>
                        <p className="text-white/30 text-[10px] uppercase tracking-widest">You will be redirected to the login page</p>
                      </div>
                    </div>
                    <button onClick={handleSignOut}
                      className="px-8 py-4 bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-bold uppercase tracking-widest rounded-xl transition-all text-xs flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Choice Modal - Room vs Nightclub */}
      {showChoiceModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowChoiceModal(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" />
          <div className="relative bg-[#0c0f0f] border border-white/[0.08] rounded-3xl w-full max-w-sm shadow-[0_0_60px_rgba(227,8,126,0.2)] animate-in zoom-in-95 duration-300 p-6 sm:p-8" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E3087E]/15 to-[#E3087E]/10 flex items-center justify-center mx-auto mb-3 text-[#E3087E] shadow-[0_0_20px_rgba(227,8,126,0.15)]">
                <span className="material-symbols-outlined text-2xl">add_circle</span>
              </div>
              <h3 className="font-['Epilogue'] text-white font-black text-base uppercase tracking-widest">New Reservation</h3>
              <p className="text-white/25 text-[10px] uppercase tracking-widest mt-1.5 font-bold">Choose reservation type</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => { setShowChoiceModal(false); setStep(1); setShowModal(true); }}
                className="w-full px-5 py-4 rounded-xl font-bold text-sm transition-all duration-200 border text-left flex items-center justify-between bg-white/[0.02] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:text-white hover:border-[#E3087E]/40 hover:shadow-[0_0_15px_rgba(227,8,126,0.10)] group">
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#E3087E] text-lg">meeting_room</span>
                  <span>Room Reservation</span>
                </span>
                <span className="material-symbols-outlined text-sm text-white/15 group-hover:text-white/40">arrow_forward_ios</span>
              </button>
              <button onClick={() => { setShowChoiceModal(false); setShowNcModal(true); }}
                className="w-full px-5 py-4 rounded-xl font-bold text-sm transition-all duration-200 border text-left flex items-center justify-between bg-white/[0.02] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:text-white hover:border-[#E3087E]/40 hover:shadow-[0_0_15px_rgba(227,8,126,0.10)] group">
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#E3087E] text-lg">nightlife</span>
                  <span>Nightclub Book</span>
                </span>
                <span className="material-symbols-outlined text-sm text-white/15 group-hover:text-white/40">arrow_forward_ios</span>
              </button>
            </div>
            <button onClick={() => setShowChoiceModal(false)} className="w-full mt-4 py-2.5 text-white/25 text-[10px] uppercase tracking-widest font-bold hover:text-white/50 transition-colors rounded-xl border border-dashed border-white/[0.06] hover:border-white/20">Cancel</button>
          </div>
        </div>
      )}

      {/* Nightclub Assignment Modal */}
      {showNcModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowNcModal(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" />
          <div className="relative bg-[#0c0f0f] border border-white/[0.08] rounded-3xl w-full max-w-lg shadow-[0_0_60px_rgba(227,8,126,0.2)] animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-b from-[#0c0f0f] via-[#0c0f0f] to-transparent px-5 sm:px-7 pt-5 sm:pt-7 pb-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E3087E]/15 to-[#E3087E]/10 flex items-center justify-center text-[#E3087E]">
                  <span className="material-symbols-outlined text-lg">nightlife</span>
                </div>
                <div>
                  <h3 className="font-['Epilogue'] text-white font-black text-sm uppercase tracking-widest">Nightclub Assignment</h3>
                  <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold mt-0.5">Request nightclub booking</p>
                </div>
              </div>
              <button onClick={() => setShowNcModal(false)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-200">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-5 sm:p-7">
              <div className="bg-gradient-to-br from-[#E3087E]/10 to-[#ff00ff]/5 border border-[#E3087E]/30 rounded-2xl p-5 sm:p-6">
                <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#E3087E] text-sm">schedule</span>
                  Select Your Availability
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-white/50 text-[10px] uppercase tracking-widest font-bold block mb-1.5">Available From</label>
                    <input type="datetime-local" value={ncReqFrom} onChange={e => setNcReqFrom(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3087E]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-white/50 text-[10px] uppercase tracking-widest font-bold block mb-1.5">Available To</label>
                    <input type="datetime-local" value={ncReqTo} onChange={e => setNcReqTo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E3087E]/50 transition-colors" />
                  </div>
                </div>
                <button onClick={async () => {
                  if (!ncReqFrom || !ncReqTo) return;
                  setNcReqLoading(true);
                  setNcReqMsg(null);
                  try {
                    const res = await fetch("/wp-json/pascha/v1/nightclub/request", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: user.email, nightclub_from_datetime: ncReqFrom, nightclub_to_datetime: ncReqTo })
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      setNcReqMsg({ success: true, message: data.message });
                      setNcReqFrom(""); setNcReqTo("");
                      const r = await fetch(`/wp-json/pascha/v1/reservations?t=${Date.now()}`);
                      if (r.ok) setReservations(await r.json());
                    } else {
                      setNcReqMsg({ success: false, message: data.message || "Request failed." });
                    }
                  } catch (err) {
                    setNcReqMsg({ success: false, message: "Network error." });
                  } finally { setNcReqLoading(false); }
                }} disabled={ncReqLoading || !ncReqFrom || !ncReqTo} className="w-full py-3 bg-[#E3087E] text-white font-bold uppercase tracking-widest rounded-xl text-[11px] hover:brightness-110 transition-all shadow-[0_8px_25px_rgba(227,8,126,0.3)] flex items-center justify-center gap-2 disabled:opacity-40">
                  {ncReqLoading ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Submitting...</> : <><span className="material-symbols-outlined text-sm">send</span> Submit Request</>}
                </button>
                {ncReqMsg && (
                  <p className={`mt-3 text-[11px] text-center font-bold uppercase tracking-widest ${ncReqMsg.success ? 'text-[#00ff88]' : 'text-red-400'}`}>{ncReqMsg.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay - Root Level */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" />
          <div className="relative bg-[#0c0f0f] border border-white/[0.08] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(227,8,126,0.2)] mx-2 sm:mx-0 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>

            <div className="sticky top-0 bg-gradient-to-b from-[#0c0f0f] via-[#0c0f0f] to-transparent z-10 px-5 sm:px-7 pt-5 sm:pt-7 pb-3 sm:pb-4 flex items-center justify-between border-b border-white/[0.06]">
              <div className="flex items-center gap-2 sm:gap-3">
                {[1,2,3,4].map(s => (
                  <div key={s} className={`
                    w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold tracking-widest transition-all duration-300
                    ${step === s ? 'bg-[#E3087E] text-white shadow-[0_0_15px_rgba(227,8,126,0.4)]' :
                      step > s ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30' :
                      'bg-white/[0.04] text-white/25 border border-white/[0.06]'}
                  `}>
                    {step > s ? <span className="material-symbols-outlined text-[11px] sm:text-xs">check</span> : s}
                  </div>
                ))}
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-200">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-5 sm:p-7">
              {step === 1 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E3087E]/15 to-[#E3087E]/10 flex items-center justify-center mx-auto mb-3 text-[#E3087E] shadow-[0_0_20px_rgba(227,8,126,0.15)]">
                      <span className="material-symbols-outlined text-2xl">category</span>
                    </div>
                    <h3 className="font-['Epilogue'] text-white font-black text-base sm:text-lg uppercase tracking-widest">Select Your Category</h3>
                    <p className="text-white/25 text-[10px] uppercase tracking-widest mt-1 font-bold">Step 1 of 4</p>
                  </div>
                  <div className="space-y-2.5 pt-1">
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => { setSelectedCategory(cat); setStep(2); }}
                        className="w-full px-5 py-4 rounded-xl font-bold text-sm transition-all duration-200 border text-left flex items-center justify-between bg-white/[0.02] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:text-white hover:border-[#E3087E]/40 hover:shadow-[0_0_15px_rgba(227,8,126,0.10)] group">
                        {cat}
                        <span className="material-symbols-outlined text-sm text-white/15 group-hover:text-white/40 transition-colors">arrow_forward_ios</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E3087E]/15 to-[#E3087E]/10 flex items-center justify-center mx-auto mb-3 text-[#E3087E] shadow-[0_0_20px_rgba(227,8,126,0.15)]">
                      <span className="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                    <h3 className="font-['Epilogue'] text-white font-black text-base sm:text-lg uppercase tracking-widest">Select Location</h3>
                    <p className="text-white/25 text-[10px] uppercase tracking-widest mt-1 font-bold">Step 2 of 4</p>
                  </div>
                  <div className="space-y-2.5 pt-1">
                    {LOCATIONS.map(loc => (
                      <button key={loc.id} onClick={() => { setSelectedLocation(loc.id); setStep(3); }}
                        className="w-full px-5 py-4 rounded-xl font-bold text-sm transition-all duration-200 border text-left flex items-center justify-between bg-white/[0.02] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:text-white hover:border-[#E3087E]/40 hover:shadow-[0_0_15px_rgba(227,8,126,0.10)] group">
                        <span><span className="material-symbols-outlined text-sm mr-2 align-middle text-white/30">location_on</span>{loc.label}</span>
                        <span className="material-symbols-outlined text-sm text-white/15 group-hover:text-white/40 transition-colors">arrow_forward_ios</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} className="w-full py-3 text-white/25 text-[10px] uppercase tracking-widest font-bold hover:text-white/50 transition-colors rounded-xl border border-dashed border-white/[0.06] hover:border-white/20">← Back to Categories</button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E3087E]/15 to-[#E3087E]/10 flex items-center justify-center text-[#E3087E]">
                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                      </div>
                      <div>
                        <h3 className="font-['Epilogue'] text-white font-black text-sm sm:text-base uppercase tracking-widest">Select Dates</h3>
                        <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold">Step 3 of 4</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/20 text-[8px] uppercase tracking-widest font-bold">Marked</p>
                      <p className="text-white font-black text-base">{selectedAvailDates.length} days</p>
                    </div>
                  </div>
                  <div className="-mx-5 sm:-mx-0">
                    <ReservationCalendar mode="manage" bookedDates={bookedDates} onAvailabilityChange={setSelectedAvailDates} />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <button onClick={() => setStep(2)} className="px-4 py-2.5 text-white/25 text-[9px] uppercase tracking-widest font-bold hover:text-white/50 transition-colors rounded-xl border border-dashed border-white/[0.06] hover:border-white/20">← Back</button>
                    <button onClick={() => selectedAvailDates.length > 0 && setStep(4)}
                      className={`px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-200 ${selectedAvailDates.length > 0 ? 'bg-[#E3087E] text-white shadow-[0_0_20px_rgba(227,8,126,0.3)] hover:brightness-110' : 'bg-white/[0.04] text-white/20 cursor-not-allowed border border-white/[0.06]'}`}>
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00ff88]/15 to-[#00ff88]/5 flex items-center justify-center mx-auto mb-3 text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.15)]">
                      <span className="material-symbols-outlined text-2xl">assignment_turned_in</span>
                    </div>
                    <h3 className="font-['Epilogue'] text-white font-black text-base sm:text-lg uppercase tracking-widest">Confirm & Submit</h3>
                    <p className="text-white/25 text-[10px] uppercase tracking-widest mt-1 font-bold">Step 4 of 4</p>
                  </div>
                  <div className="space-y-3 pt-1">
                    {[{icon:'category',label:'Category',val:selectedCategory},{icon:'location_on',label:'Location',val:LOCATIONS.find(l=>l.id===selectedLocation)?.label},{icon:'calendar_month',label:'Duration',val:`${selectedAvailDates.length} days (${Math.max(1,Math.ceil(selectedAvailDates.length/7))} ${Math.max(1,Math.ceil(selectedAvailDates.length/7))===1?'week':'weeks'})`}].map((item,i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-4 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#E3087E] text-lg">{item.icon}</span>
                          <div>
                            <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold">{item.label}</p>
                            <p className="text-white font-bold text-sm mt-0.5">{item.val}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-gradient-to-r from-[#E3087E]/10 to-[#E3087E]/5 border border-[#E3087E]/20 rounded-2xl px-4 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-white/25 text-[9px] uppercase tracking-widest font-bold">Total Price</p>
                        <p className="text-white/40 text-[10px] mt-0.5">{PRICES[selectedCategory]?.[selectedLocation]||0}€/week &times; {Math.max(1,Math.ceil(selectedAvailDates.length/7))}</p>
                      </div>
                      <p className="text-2xl font-black text-white">€{(PRICES[selectedCategory]?.[selectedLocation]||0)*Math.max(1,Math.ceil(selectedAvailDates.length/7))}</p>
                    </div>
                  </div>
                  {reqMsg && (
                    <div className={`p-3 rounded-xl text-[10px] text-center font-bold uppercase tracking-widest ${reqMsg.type==='success'?'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20':'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{reqMsg.text}</div>
                  )}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button onClick={() => setStep(3)} className="px-4 py-3 text-white/25 text-[10px] uppercase tracking-widest font-bold hover:text-white/50 transition-colors rounded-xl border border-dashed border-white/[0.06] hover:border-white/20">← Back</button>
                    <button onClick={async()=>{
                      setReqLoading(true); setReqMsg(null);
                      try {
                        const sorted = [...selectedAvailDates].map(d=>new Date(d)).sort((a,b)=>a-b);
                        const startDate = sorted[0].toISOString().split('T')[0];
                        const endDate = sorted[sorted.length-1].toISOString().split('T')[0];
                        const price = (PRICES[selectedCategory]?.[selectedLocation]||0)*Math.max(1,Math.ceil(selectedAvailDates.length/7));
                        const res = await fetch('/wp-json/pascha/v1/girls/request-reservation',{
                          method:'POST',headers:{'Content-Type':'application/json'},
                          body:JSON.stringify({email:user.email,category:selectedCategory,location:selectedLocation,start_date:startDate,end_date:endDate,price}),
                        });
                        const data = await res.json();
                        if (data.success) {
                          setSelectedCategory(""); setSelectedLocation(""); setSelectedAvailDates([]);
                          fetchReservations();
                          setShowModal(false);
                          setShowThankYou(true);
                        } else { setReqMsg({type:'error',text:data.message||'Request failed.'}); }
                      } catch(err){ console.error(err); setReqMsg({type:'error',text:err.message||'Error'}); }
                      finally{ setReqLoading(false); }
                    }} disabled={reqLoading}
                      className="px-8 py-3 bg-[#E3087E] text-white font-bold uppercase tracking-widest rounded-xl text-[11px] hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(227,8,126,0.4)] flex items-center gap-2 disabled:opacity-50">
                      {reqLoading ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Submitting...</> : <><span className="material-symbols-outlined text-sm">send</span> Submit</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Thank You Popup */}
      {showThankYou && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" />
          <div className="relative bg-[#0c0f0f] border border-white/[0.08] rounded-3xl w-full max-w-sm shadow-[0_0_60px_rgba(227,8,126,0.2)] animate-in zoom-in-95 duration-300 p-6 sm:p-8" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00ff88]/15 to-[#00ff88]/5 flex items-center justify-center mx-auto mb-4 text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.15)]">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="font-['Epilogue'] text-white font-black text-base sm:text-lg uppercase tracking-widest mb-4">Request Submitted!</h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
                Please wait for a call from the authority or give a call on this number:
              </p>
              <a href="tel:+436766826881" className="inline-block mt-3 text-lg font-bold text-[#ffabf3] hover:text-white transition-colors">
                +43 676 6826881
              </a>
              <div className="mt-8">
                <button onClick={() => { setShowThankYou(false); setShowModal(false); setStep(1); }}
                  className="px-8 py-3 bg-white/[0.05] text-white/60 font-bold uppercase tracking-widest rounded-xl text-[11px] hover:bg-white/[0.1] hover:text-white transition-all border border-white/[0.08]">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
