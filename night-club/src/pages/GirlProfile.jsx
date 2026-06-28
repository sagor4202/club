import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaWhatsapp, FaArrowLeft, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DEFAULT_RATES = [
  { time: "20 MIN", price: "80 EURO" },
  { time: "30 MIN", price: "120 EURO" },
  { time: "1 Hours", price: "170 EURO" },
];

const BRAUNAU_RATES = [
  { time: "20 MIN", price: "70 EURO" },
  { time: "30 MIN", price: "100 EURO" },
  { time: "1 Hours", price: "150 EURO" },
];

const NIGHTCLUB_RATES = [
  { time: "30 min", price: "150 EURO" },
  { time: "1 hour", price: "250 EURO" },
];

const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExts = [".mp4", ".webm", ".ogg", ".mov", ".qt", ".avi", ".mkv"];
  return videoExts.some(ext => url.toLowerCase().includes(ext) || url.toLowerCase().endsWith(ext));
};

export default function GirlProfile() {
  const { name } = useParams();
  const navigate = useNavigate();
  const locationState = useLocation();
  const fromClub = locationState.state?.from;

  const [activeImage, setActiveImage] = useState(0);
  const thumbsRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [name]);

  useEffect(() => {
    if (thumbsRef.current) {
      const activeThumb = thumbsRef.current.children[activeImage];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeImage]);

  const [dynamicGirl, setDynamicGirl] = useState(null);

  useEffect(() => {
    const fetchGirls = async () => {
      try {
        const response = await fetch(`/wp-json/pascha/v1/girls?t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          const found = data.find(g => g.name.toLowerCase() === name.toLowerCase());
          if (found) setDynamicGirl(found);
        }
      } catch (err) {
        console.error("Error fetching girl profile:", err);
      }
    };
    if (name) fetchGirls();
  }, [name]);

  // Fallback defaults
  const defaultImages = [
    "/wp-content/uploads/2026/05/gallery-01-scaled.webp",
    "/wp-content/uploads/2026/05/gallery-03-scaled.webp",
    "/wp-content/uploads/2026/05/gallery-04-scaled.webp",
    "/wp-content/uploads/2026/05/gallery-06-scaled.webp",
    "/wp-content/uploads/2026/05/gallery-07-scaled.webp",
    "/wp-content/uploads/2026/05/gallery-08-scaled.webp",
    "/wp-content/uploads/2026/05/gallery-09-scaled.webp",
    "/wp-content/uploads/2026/05/gallery-10-scaled.webp",
    "/wp-content/uploads/2026/05/gallery-11-scaled.webp",
    "/wp-content/uploads/2026/05/gallery-13-scaled.webp"
  ];

  const defaultServices = [];
  const defaultPrices = [];

  // Build gallery: normalize everything to {url, type} objects
  const gallery = useMemo(() => {
    const uploaded = (dynamicGirl?.images || []).map(item =>
      typeof item === "string" ? { url: item, type: "image" } : item
    );
    if (uploaded.length > 0) {
      return uploaded;
    }
    // No uploaded media, use default fallback images
    const fallback = defaultImages.map(u => ({ url: u, type: "image" }));
    const thumb = dynamicGirl?.img;
    const thumbType = dynamicGirl?.img_type || "image";
    if (thumb) return [{ url: thumb, type: thumbType }, ...fallback.slice(1)];
    return fallback;
  }, [dynamicGirl]);

  // Set the thumbnail as the active image on load/update
  useEffect(() => {
    if (dynamicGirl && gallery.length > 0) {
      const thumb = dynamicGirl.img;
      if (thumb) {
        const thumbIdx = gallery.findIndex(m => m.url === thumb);
        if (thumbIdx >= 0) {
          setActiveImage(thumbIdx);
        }
      }
    }
  }, [dynamicGirl, gallery]);

  const girl = {
    name: dynamicGirl?.name || name || "Luna",
    height: dynamicGirl?.height || "168cm",
    weight: dynamicGirl?.weight || "52kg",
    measurements: dynamicGirl?.measurements || "88-60-90",
    languages: dynamicGirl?.languages || "English, German",
    location: dynamicGirl?.location === "braunau" ? "Pascha Braunau am Inn"
             : dynamicGirl?.location === "salzburg" ? "Pasha Salzburg"
             : "Pascha",
    about: dynamicGirl?.desc || "I am an elegant, sophisticated companion who loves to create unforgettable memories. I offer the perfect mix of beauty, intelligence, and passion.",
    services: (dynamicGirl?.services && dynamicGirl.services.length > 0) ? dynamicGirl.services : [],
    prices: dynamicGirl?.prices || [],
    whatsapp: dynamicGirl?.whatsapp || "",
    show_on_nightclub: dynamicGirl?.show_on_nightclub || false,
    isNightclubActive: (() => {
      if (!dynamicGirl?.show_on_nightclub) return false;
      const from = dynamicGirl.nightclub_from_datetime;
      const to = dynamicGirl.nightclub_to_datetime;
      if (!from || !to) return false;
      const now = new Date();
      let fromDt = new Date(from);
      let toDt = new Date(to);
      if (toDt <= fromDt) toDt.setDate(toDt.getDate() + 1);
      return now >= fromDt && now <= toDt;
    })(),
    images: gallery
  };

  const activeMedia = girl.images[activeImage] || girl.images[0] || { url: "", type: "image" };
  const isActiveVideo = activeMedia.type === "video" || isVideoUrl(activeMedia.url);

  // Resolve which rates to display
  const displayRates = (() => {
    const p = dynamicGirl?.prices;
    // New format: object with location keys
    if (p && typeof p === "object" && !Array.isArray(p)) {
      const targetLoc = fromClub || dynamicGirl?.location || "nightclub";
      if (p[targetLoc]?.length > 0) return p[targetLoc];
      if (p["nightclub"]?.length > 0) return p["nightclub"];
    }
    // Old format: array
    if (Array.isArray(p) && p.length > 0) return p;
    // Fallback to location-based defaults
    if (fromClub === "nightclub") return NIGHTCLUB_RATES;
    if (fromClub === "braunau") return BRAUNAU_RATES;
    if (fromClub === "salzburg") return DEFAULT_RATES;
    if (dynamicGirl?.location === "braunau") return BRAUNAU_RATES;
    return DEFAULT_RATES;
  })();

  return (
    <div className="min-h-screen selection:bg-[#ffabf3] selection:text-[#5b005b] bg-[#0F0F3D]">
      <Navbar />

      <main className="pt-[100px] pb-24 px-6 lg:px-10 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-[#ff00ff] transition-colors mb-8 font-['Be_Vietnam_Pro'] text-sm"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left: Images */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-2xl overflow-hidden glass-card border border-white/10 group aspect-[3/4]">
              {isActiveVideo
                ? <video
                    key={activeMedia.url}
                    src={activeMedia.url}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls={false}
                  />
                : <img
                    src={activeMedia.url}
                    alt={girl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />}

              {/* Navigation Arrows */}
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev === 0 ? girl.images.length - 1 : prev - 1)); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#ff00ff]/90 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all z-40 active:scale-95 shadow-lg"
              >
                <FaChevronLeft className="text-lg" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev === girl.images.length - 1 ? 0 : prev + 1)); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#ff00ff]/90 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all z-40 active:scale-95 shadow-lg"
              >
                <FaChevronRight className="text-lg" />
              </button>

              <div className="absolute top-4 right-4 bg-[#ff00ff]/90 backdrop-blur-md text-white text-xs font-black px-4 py-1.5 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,0,255,0.4)] flex items-center gap-2 z-30">
                <FaStar className="text-[#e9c349]" /> Top Rated
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/60 to-transparent z-30">
                <div className="bg-[#00ff88]/20 backdrop-blur-md text-[#00ff88] text-xs font-black px-4 py-1.5 rounded-full border border-[#00ff88]/30 shadow-[0_0_15px_rgba(0,255,136,0.2)] uppercase tracking-widest flex items-center gap-2 w-max mb-4">
                  <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,136,1)]"></span>
                  Available Now
                </div>
              </div>
            </div>

            <div ref={thumbsRef} className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
              {girl.images.map((media, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`flex-none w-24 h-24 rounded-xl overflow-hidden glass-card border cursor-pointer transition-all relative ${activeImage === idx ? 'border-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'border-white/10 opacity-70 hover:opacity-100 hover:border-[#ff00ff]/50'}`}
                >
                  {(media.type === "video" || isVideoUrl(media.url))
                    ? <video src={media.url} className="w-full h-full object-cover" muted playsInline />
                    : <img src={media.url} alt={`${girl.name} ${idx + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />}
                  {(media.type === "video" || isVideoUrl(media.url)) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="material-symbols-outlined text-white text-[18px]">play_circle</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-6">
            <div className="mb-8">
              <h1 className="font-['Epilogue'] text-5xl md:text-6xl font-extrabold text-white mb-2 uppercase tracking-tight">
                {girl.name}
              </h1>
              <div className="flex items-center gap-4 text-white/70 font-['Be_Vietnam_Pro'] text-sm">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[#ffabf3] text-lg">location_on</span> {girl.location}</span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-[#ff00ff]/50 to-transparent mb-8"></div>

            <div className="mb-8">
              <h2 className="font-['Epilogue'] text-xl font-bold text-white mb-4 uppercase tracking-widest text-[#e9c349]">About Me</h2>
              <p className="font-['Be_Vietnam_Pro'] text-white/70 leading-relaxed">
                {girl.about}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Height", value: girl.height },
                { label: "Weight", value: girl.weight },
                { label: "Language", value: girl.languages.split(",")[0] }
              ].map(stat => (
                <div key={stat.label} className="glass-card p-4 rounded-xl border border-white/10 text-center">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="font-['Epilogue'] font-bold text-white text-lg">{stat.value}</div>
                </div>
              ))}
            </div>

            {girl.services.length > 0 && (
              <div className="mb-8">
                <h2 className="font-['Epilogue'] text-xl font-bold text-white mb-4 uppercase tracking-widest text-[#e9c349]">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {girl.services.map(service => (
                    <span key={service} className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/80 text-xs font-['Be_Vietnam_Pro'] uppercase tracking-wider hover:bg-[#ff00ff]/20 hover:border-[#ff00ff]/50 transition-colors">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {true && (
              <div className="mb-10">
                <h2 className="font-['Epilogue'] text-xl font-bold text-white mb-4 uppercase tracking-widest text-[#e9c349]">Rates</h2>
                <div className="grid grid-cols-2 gap-4">
                  {displayRates.map((price, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-xl border border-white/10 bg-white/5">
                      <span className="text-white/70 text-sm font-['Be_Vietnam_Pro'] uppercase tracking-wider">{price.time}</span>
                      <span className="font-['Epilogue'] font-bold text-[#ff00ff] text-xl">{price.price.replace(/u20ac/gi, "€")}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[#ffabf3] text-sm font-['Be_Vietnam_Pro'] mt-4 text-center font-bold px-4 py-2 rounded-lg bg-[#ff00ff]/10 border border-[#ff00ff]/20 shadow-[0_0_12px_rgba(255,0,255,0.15)]">
                  Sometimes the rates are negotiable. Please speak directly with the girls to confirm the final rate.
                </p>
              </div>
            )}

            {fromClub === "nightclub" && girl.isNightclubActive && (
              <div className="mb-10">
                <h2 className="font-['Epilogue'] text-xl font-bold text-white mb-4 uppercase tracking-widest text-[#e9c349]">Nightclub Rates</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 rounded-xl border border-[#ff00ff]/30 bg-[#ff00ff]/10">
                    <div>
                      <span className="text-white font-['Be_Vietnam_Pro'] text-sm uppercase tracking-wider">Pascha Dollar</span>
                      <p className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">Nightclub Special</p>
                    </div>
                    <span className="font-['Epilogue'] font-bold text-[#ffabf3] text-xl">30€</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl border border-[#ff00ff]/30 bg-[#ff00ff]/10">
                    <div>
                      <span className="text-white font-['Be_Vietnam_Pro'] text-sm uppercase tracking-wider">Dusche Show</span>
                      <p className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">Nightclub Special</p>
                    </div>
                    <span className="font-['Epilogue'] font-bold text-[#ffabf3] text-xl">50€</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl border border-[#ff00ff]/30 bg-[#ff00ff]/10">
                    <div>
                      <span className="text-white font-['Be_Vietnam_Pro'] text-sm uppercase tracking-wider">½ Stunde (30 Minutes) in room</span>
                      <p className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">Private Time</p>
                    </div>
                    <span className="font-['Epilogue'] font-bold text-[#ffabf3] text-xl">100€</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl border border-[#ff00ff]/30 bg-[#ff00ff]/10">
                    <div>
                      <span className="text-white font-['Be_Vietnam_Pro'] text-sm uppercase tracking-wider">1 Stunde (60 Minutes) in room</span>
                      <p className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">Private Time</p>
                    </div>
                    <span className="font-['Epilogue'] font-bold text-[#ffabf3] text-xl">200€</span>
                  </div>
                </div>
              </div>
            )}

              <div className="flex flex-col sm:flex-row gap-4">
              {girl.whatsapp ? (
                <a href={`https://wa.me/${girl.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300 flex items-center justify-center gap-3">
                  <FaWhatsapp className="text-xl" /> Book via WhatsApp
                </a>
              ) : (
                <button disabled className="flex-1 bg-[#25D366]/50 text-white/50 py-4 rounded-xl font-bold text-sm uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-3">
                  <FaWhatsapp className="text-xl" /> WhatsApp Unavailable
                </button>
              )}
              <button onClick={() => navigate(`/appointment/${girl.name}`)} className="flex-1 bg-gradient-to-r from-[#ff00ff] to-[#e1047d] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all duration-300">
                Get Appointment
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
