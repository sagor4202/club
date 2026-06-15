import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RoomReservation from "../components/RoomReservation";

const CLUBS = {
  braunau: {
    name: "Pascha Laufhaus - Braunau Am Inn",
    address: "Salzburger Str. 136 // 5280 Braunau am Inn",
    heroImg: "/wp-content/uploads/2026/05/hero-01.png",
    mapLink: "https://maps.app.goo.gl/gM9w6F5DfrXGDjsi9",
  },
  salzburg: {
    name: "pascha Laufhaus - Salzburg",
    address: "Sterneckstraße 14 // 5020 Salzburg",
    heroImg: "/wp-content/themes/night-club-theme/dist/images/hero-02.jpeg",
    mapLink: "https://maps.app.goo.gl/Qb6ShHv4Z7o1EK6L6",
  },
  nightclub: {
    name: "Pascha nightclub - Salzburg",
    address: "Sterneckstraße 14 // 5020 Salzburg",
    heroImg: "/wp-content/themes/night-club-theme/dist/images/hero-03.mp4",
    mapLink: "https://maps.app.goo.gl/Qb6ShHv4Z7o1EK6L6",
  },
  all: {
    name: "All Our Ladies",
    address: "Available at All Pascha Locations",
    heroImg: "/wp-content/themes/night-club-theme/dist/images/5871210-uhd_2160_3840_24fps.mp4",
  },
  laufhaus: {
    name: "Pascha Laufhaus",
    address: "Premium Room Reservations",
    heroImg: "/wp-content/themes/night-club-theme/dist/images/hero-02.jpeg",
  },
};

const ALL_PAGE_SECTIONS = [
  {
    id: "braunau",
    title: "Pascha Laufhaus - Braunau Am Inn",
    subtitle: "Available Girls in Braunau",
  },
  {
    id: "salzburg",
    title: "pascha Laufhaus - Salzburg",
    subtitle: "Available Girls in Salzburg",
  },
  {
    id: "nightclub",
    title: "Pascha nightclub - Salzburg",
    subtitle: "Available Girls in Nightclub",
  },
];

const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExts = [".mp4", ".webm", ".ogg", ".mov", ".qt", ".avi", ".mkv"];
  return videoExts.some(ext => url.toLowerCase().includes(ext) || url.toLowerCase().endsWith(ext));
};

function NightclubDanceHeading() {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center relative z-10">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/55 to-transparent mb-4"></div>
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-[#ff00ff]/0 via-[#ff00ff]/50 to-[#ff00ff]/10"></span>
        <span className="text-[#ff3f8f] text-2xl drop-shadow-[0_0_18px_rgba(255,0,255,0.45)]">♛</span>
        <span className="h-px flex-1 bg-gradient-to-l from-[#ff00ff]/0 via-[#ff00ff]/50 to-[#ff00ff]/10"></span>
      </div>
      <h3 className="mt-4 font-['Epilogue'] text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-[0.12em] leading-[1.12] drop-shadow-[0_0_18px_rgba(255,255,255,0.18)]">
        Table Dance / Nightclub
        <span className="block text-[#e9c349] tracking-[0.18em] mt-1">
          Lapdance Striptease
        </span>
        <span className="block text-[#ffabf3] tracking-[0.2em] mt-1">
          Room Service
        </span>
      </h3>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/35 to-transparent mt-4"></div>
    </div>
  );
}

export default function LocationGirls() {
  const { club } = useParams();
  const navigate = useNavigate();
  const isWpAdmin = Boolean(window.paschaCurrentUser?.is_admin);
  const [footerPad, setFooterPad] = useState(0);
  const soonTrackRef = useRef(null);
  const soonRafRef = useRef(null);
  const soonLastTsRef = useRef(0);
  const soonPausedRef = useRef(false);

  
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Require login for nightclub page
  useEffect(() => {
    if (club === "nightclub" && !user && !isWpAdmin) {
      navigate("/login", { replace: true });
    }
  }, [club, user, isWpAdmin, navigate]);

  // State for per‑girl reservation modal
  const [activeGirl, setActiveGirl] = useState(null); // currently selected girl object
  const [calendarWeekStart, setCalendarWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day; // set to Sunday
    return new Date(now.setDate(diff));
  });
  const [selectedDays, setSelectedDays] = useState([]);

  // Helper to get start of week (Sunday) for any date
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const handleReserveClick = (girl) => {
    if (!user && !isWpAdmin) {
      setShowAuthPopup(true);
      return;
    }
    setActiveGirl(girl);
    setCalendarWeekStart(getWeekStart(new Date()));
    setSelectedDays([]);
  };

  const toggleDaySelection = (day) => {
    const dayStr = day.toISOString().split('T')[0];
    setSelectedDays((prev) =>
      prev.includes(dayStr) ? prev.filter((d) => d !== dayStr) : [...prev, dayStr]
    );
  };

  const submitGirlReservation = async () => {
    if (!activeGirl) return;
    try {
      const payload = {
        girlId: activeGirl.name,
        weekStart: calendarWeekStart.toISOString().split('T')[0],
        dates: selectedDays,
      };
      // Assume the WP REST endpoint exists
      const response = await fetch('/wp-json/pascha/v1/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert('Reservation successful!');
        setActiveGirl(null);
      } else {
        alert('Reservation failed.');
      }
    } catch (e) {
      console.error(e);
      alert('Error while reserving.');
    }
  };

  // Calendar rendering helpers
  const getWeekDays = (start) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Auth check removed per user request


  const clubInfo = CLUBS[club];

  const [allGirls, setAllGirls] = useState([]);
  const [allReservations, setAllReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [girlsRes, resRes] = await Promise.all([
          fetch(`/wp-json/pascha/v1/girls?t=${Date.now()}`),
          fetch(`/wp-json/pascha/v1/reservations?t=${Date.now()}`)
        ]);
        if (girlsRes.ok) setAllGirls(await girlsRes.json());
        if (resRes.ok) setAllReservations(await resRes.json());
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availableGirls = useMemo(() => {
    return allGirls.filter(g => {
      return allReservations.some(r => {
        const matchLocation = club === "all" || club === "laufhaus" || club === "nightclub" || r.location === club;
        if (!matchLocation) return false;

        if (r.status && r.status !== "approved") return false;

        const isSameGirl = (r.user_email && r.user_email === g.email) || r.girl_name === g.name;
        if (!isSameGirl) return false;

        const start = new Date(r.start_date);
        const end = new Date(r.end_date);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return today >= start && today <= end;
      });
    });
  }, [allGirls, allReservations, club, today]);

  const nightclubGridGirls = useMemo(() => {
    if (club !== "nightclub" && club !== "all") return [];
    const now = new Date();
    return allGirls.filter(g => {
      // Check assigned girls first — bypass datetime filter
      if (g.show_on_nightclub) return true;
      // Check datetime range
      if (g.nightclub_from_datetime && g.nightclub_to_datetime) {
        const fromDt = new Date(g.nightclub_from_datetime);
        const toDt = new Date(g.nightclub_to_datetime);
        // Handle midnight crossing (e.g., 20:00 → 02:00 next day)
        if (toDt <= fromDt) toDt.setDate(toDt.getDate() + 1);
        if (now < fromDt || now > toDt) return false;
      }
      return allReservations.some(r => {
        if (r.status && r.status !== "approved") return false;
        if (String(r.show_on_nightclub ?? "0") !== "1") return false;

        const isSameGirl = (r.user_email && r.user_email === g.email) || r.girl_name === g.name;
        if (!isSameGirl) return false;

        const end = new Date(r.end_date);
        end.setHours(23, 59, 59, 999);
        return today <= end;
      });
    });
  }, [allGirls, allReservations, club, today]);

  const allAvailableGirlsByLocation = useMemo(() => {
    const isActiveReservationForGirl = (girl, location) => {
      return allReservations.some(r => {
        if (r.location !== location) return false;
        if (r.status && r.status !== "approved") return false;

        const isSameGirl = (r.user_email && r.user_email === girl.email) || r.girl_name === girl.name;
        if (!isSameGirl) return false;

        const start = new Date(r.start_date);
        const end = new Date(r.end_date);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return today >= start && today <= end;
      });
    };

    return {
      braunau: allGirls.filter(girl => isActiveReservationForGirl(girl, "braunau")),
      salzburg: allGirls.filter(girl => isActiveReservationForGirl(girl, "salzburg")),
      nightclub: nightclubGridGirls,
    };
  }, [allGirls, allReservations, nightclubGridGirls, today]);

  const soonGirls = useMemo(() => {
    return allGirls.filter(g => {
      // If she is available right now in this club, she is not "upcoming"
      const isActiveHere = availableGirls.some(ag => ag.id === g.id);
      if (isActiveHere) return false;

      // Check if she has a future approved reservation for this club
      const hasFutureHere = allReservations.some(r => {
        const matchLocation = club === "all" || club === "laufhaus" || club === "nightclub" || r.location === club;
        if (!matchLocation) return false;
        
        if (r.status !== "approved") return false;
        
        const isSameGirl = (r.user_email && r.user_email === g.email) || r.girl_name === g.name;
        if (!isSameGirl) return false;

        const start = new Date(r.start_date);
        start.setHours(0, 0, 0, 0);
        return start > today;
      });

      return hasFutureHere;
    });
  }, [allGirls, allReservations, availableGirls, club, today]);

  const atmosphere = useMemo(
    () => [
      "/wp-content/uploads/2026/05/hero-1-scaled.webp",
      "/wp-content/uploads/2026/05/hero-2-scaled.webp",
      "/wp-content/uploads/2026/05/hero-3-scaled.webp",
      "/wp-content/uploads/2026/05/gallery-06-scaled.webp",
      "/wp-content/uploads/2026/05/gallery-07-scaled.webp",
      "/wp-content/uploads/2026/05/gallery-10-scaled.webp",
    ],
    []
  );

  const atmosphereTiles = useMemo(
    () => [
      {
        title: "Main Club Floor",
        desc: "Experience the pulse of the night with world-class sound and lighting.",
        img: "/wp-content/uploads/2026/05/hotel-1-scaled.webp",
        className: "md:col-span-2 md:row-span-2",
        pad: "p-8",
        heading: "font-['Epilogue'] text-lg md:text-2xl font-extrabold uppercase tracking-widest",
        text: "font-['Be_Vietnam_Pro'] text-white/70 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500",
      },
      {
        title: "Designer Suite",
        desc: "Ultimate privacy and luxury comfort.",
        img: "/wp-content/uploads/2026/05/hotel-2-scaled.webp",
        className: "",
        pad: "p-4",
        heading: "font-['Epilogue'] text-sm font-extrabold uppercase tracking-widest",
        text: "text-[10px] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity",
      },
      {
        title: "Premium Bar",
        desc: "Exquisite cocktails and rare spirits.",
        img: "/wp-content/uploads/2026/05/hotel-3-scaled.webp",
        className: "",
        pad: "p-4",
        heading: "font-['Epilogue'] text-sm font-extrabold uppercase tracking-widest",
        text: "text-[10px] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity",
      },
      {
        title: "VIP Lounge",
        desc: "Refined elegance for exclusive gatherings.",
        img: "/wp-content/uploads/2026/05/hotel-2-scaled.webp",
        className: "md:col-span-2",
        pad: "p-6",
        heading: "font-['Epilogue'] text-lg lg:text-xl font-extrabold uppercase tracking-widest",
        text: "font-['Be_Vietnam_Pro'] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity",
      },
    ],
    []
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [club]);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return undefined;

    const update = () => {
      const next = Math.ceil(footer.getBoundingClientRect().height);
      setFooterPad(next);
    };

    update();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(footer);
    window.addEventListener("resize", update);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const track = soonTrackRef.current;
    if (!track) return undefined;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) return undefined;

    const baseSpeed = 60;
    soonLastTsRef.current = 0;

    const step = (ts) => {
      if (!track.isConnected) return;
      const half = track.scrollWidth / 2;
      if (!half) {
        soonRafRef.current = requestAnimationFrame(step);
        return;
      }

      if (!soonPausedRef.current) {
        const last = soonLastTsRef.current || ts;
        const dt = Math.min(48, ts - last);
        soonLastTsRef.current = ts;
        const delta = (baseSpeed * dt) / 1000;
        track.scrollLeft += delta;
        if (track.scrollLeft >= half) track.scrollLeft -= half;
      } else {
        soonLastTsRef.current = ts;
      }

      soonRafRef.current = requestAnimationFrame(step);
    };

    soonRafRef.current = requestAnimationFrame(step);
    let isDown = false;
    let startX;
    let scrollLeft;

    const onEnter = () => {
      soonPausedRef.current = true;
    };
    const onLeave = () => {
      isDown = false;
      track.classList.remove("active");
      soonPausedRef.current = false;
    };
    const onDown = (e) => {
      isDown = true;
      track.classList.add("active");
      soonPausedRef.current = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const onUp = () => {
      isDown = false;
      track.classList.remove("active");
      soonPausedRef.current = false;
    };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 2; // scroll-fast factor
      track.scrollLeft = scrollLeft - walk;
    };

    const onTouchStart = () => {
      soonPausedRef.current = true;
    };
    const onTouchEnd = () => {
      window.setTimeout(() => {
        soonPausedRef.current = false;
      }, 2000);
    };

    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);
    track.addEventListener("mousedown", onDown);
    track.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchend", onTouchEnd, { passive: true });

    const onReduce = () => {
      if (media?.matches) {
        soonPausedRef.current = true;
      }
    };
    media?.addEventListener?.("change", onReduce);

    return () => {
      if (soonRafRef.current) cancelAnimationFrame(soonRafRef.current);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
      track.removeEventListener("mousedown", onDown);
      track.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
      media?.removeEventListener?.("change", onReduce);
    };
  }, []);

  useEffect(() => {
    if (clubInfo) {
      document.title = `${clubInfo.name} | Pascha`;
    }
  }, [clubInfo]);

  if (!clubInfo) {
    return (
      <div className="min-h-screen selection:bg-[#ffabf3] selection:text-[#5b005b]">
        <Navbar />
        <main className="pt-[72px] px-6 lg:px-10 py-16 text-center">
          <h1 className="font-['Epilogue'] text-3xl lg:text-5xl font-extrabold text-white uppercase tracking-tight">
            Page Not Found
          </h1>
          <p className="mt-3 text-white/70 font-['Be_Vietnam_Pro']">
            This location is not available yet.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#ff00ff] text-white font-bold text-xs uppercase tracking-wider border border-white/20 hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all duration-300 active:scale-95 no-hover-scale"
            onClick={() => navigate("/")}
          >
            Back To Home
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen selection:bg-[#ffabf3] selection:text-[#5b005b]"
      style={{ paddingBottom: footerPad }}
    >
      <Navbar />

      <main>
        {/* Immersive Hero Section */}
        <header className="relative h-[75vh] flex items-center justify-center overflow-hidden mb-0">
          <div className="absolute inset-0 z-0">
            {isVideoUrl(clubInfo.heroImg) ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className={`w-full h-full object-cover ${club === "nightclub" ? "brightness-100" : "brightness-50"}`}
                src={clubInfo.heroImg}
              />
            ) : (
              <img
                className={`w-full h-full object-cover ${club === "nightclub" ? "brightness-100" : "brightness-50"}`}
                src={clubInfo.heroImg}
                alt={clubInfo.name}
              />
            )}
            {club !== "nightclub" && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f3d]/60 via-transparent to-[#0f0f3d]"></div>
            )}
          </div>

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <span className="font-['Be_Vietnam_Pro'] text-[10px] font-bold text-[#e9c349] tracking-[0.3em] block mb-4 uppercase">
              {club === "nightclub" ? "Established Excellence" : "Discreet & Refined"}
            </span>
            <h1 className="font-['Epilogue'] text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight uppercase">
              {club === "all" ? "Pascha Salzburg & Braunau" : club === "braunau" ? "Now Presenting in Braunau" : club === "salzburg" ? "Now Presenting in Salzburg" : clubInfo.name}
            </h1>
            <div className="w-32 h-[2px] bg-[#e1047d] mx-auto mb-8 shadow-[0_0_15px_rgba(225,4,125,0.6)]"></div>
            {clubInfo.mapLink ? (
              <a
                href={clubInfo.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-white/80 max-w-3xl mx-auto leading-relaxed hover:text-[#ffabf3] transition-colors inline-flex items-center justify-center gap-2"
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" className="w-4 h-4 shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
                </svg>
                {clubInfo.address?.replace(" // ", ", ")}
              </a>
            ) : (
              <p className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-white/80 max-w-3xl mx-auto leading-relaxed inline-flex items-center justify-center gap-2">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" className="w-4 h-4 shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
                </svg>
                {clubInfo.address?.replace(" // ", ", ")}
              </p>
            )}
          </div>
        </header>

        {club === "nightclub" && (
          <>
          <section className="max-w-[1280px] mx-auto px-6 lg:px-8 mt-14 mb-20 relative z-10">
            <div className="absolute -inset-x-8 -top-12 h-[220px] bg-gradient-to-b from-[#0f0f3d]/35 via-[#0f0f3d]/20 to-transparent blur-2xl rounded-[48px] pointer-events-none"></div>
            <NightclubDanceHeading />
            <div className="mb-10 relative z-10">
              <h2 className="font-['Epilogue'] text-2xl lg:text-3xl font-extrabold text-white uppercase tracking-widest mb-2">
                Available Girls
              </h2>
              <p className="font-['Be_Vietnam_Pro'] text-sm text-white/70 tracking-wide">
                Assigned by admin from reservations
              </p>
            </div>

            {nightclubGridGirls.length === 0 ? (
              <div className="glass-card rounded-2xl border border-white/10 p-10 text-center text-white/50 relative z-10">
                No girls assigned yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                {nightclubGridGirls.map((g) => (
                  <div
                    key={`nightclub-grid-${g.name}`}
                    onClick={() => navigate(`/profile/${g.name}`)}
                    className="cursor-pointer glass-card rounded-2xl overflow-hidden transition-all duration-500 group relative hover:shadow-[0_0_40px_rgba(255,0,255,0.25)] border border-white/10"
                  >
                    {/* Top Badge */}
                    {g.top_badge && (
                      <div className="absolute top-3 right-3 z-30 pointer-events-none">
                        <div className="bg-[#ff00ff]/95 text-white text-[12px] font-black px-3.5 py-2 rounded-full border border-white/25 shadow-[0_0_22px_rgba(255,0,255,0.55)] uppercase tracking-[0.18em] drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                          {g.top_badge}
                        </div>
                      </div>
                    )}

                    {/* Available Badge */}
                    <div className="absolute top-3 left-3 z-30 pointer-events-none">
                      <div className="bg-[#00e5ff]/95 text-[#061019] text-[12px] font-black px-3.5 py-2 rounded-full border border-white/25 shadow-[0_0_22px_rgba(0,229,255,0.55)] uppercase tracking-[0.18em] flex items-center gap-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                        <span className="w-2.5 h-2.5 bg-[#061019] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.65)]"></span>
                        Available
                      </div>
                    </div>

                    <div className="relative h-[380px] overflow-hidden">
                      {(g.img_type === "video" || isVideoUrl(g.img)) ? (
                        <video
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={g.img}
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          alt={g.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={g.img}
                          loading="lazy"
                        />
                      )}

                      <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#0f0f3d] via-[#0f0f3d]/60 to-transparent z-10">
                        <h3 className="font-['Epilogue'] text-2xl font-black text-white tracking-wide mb-1 text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                          {g.name}
                        </h3>
                        <p className="font-['Be_Vietnam_Pro'] text-[13px] leading-relaxed mb-2 font-semibold flex items-center justify-center gap-1.5 text-[#e9c349] drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]">
                          <span className="material-symbols-outlined text-sm text-[#ffabf3]">location_on</span>
                          Available in {clubInfo.name}
                        </p>

                          <div className="mt-3 flex justify-center">
                          <div className="bg-[#ff00ff]/15 text-[#ffabf3] text-[12px] font-black px-4 py-2 rounded-full border border-[#ff00ff]/30 shadow-[0_0_18px_rgba(255,0,255,0.25)] tracking-[0.12em] flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {(() => {
                              if (!g.nightclub_from_datetime || !g.nightclub_to_datetime) return "Available Now";
                              const from = new Date(g.nightclub_from_datetime);
                              const to = new Date(g.nightclub_to_datetime);
                              const fmtTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              return from.toDateString() === to.toDateString()
                                ? `${fmtTime(from)} — ${fmtTime(to)}`
                                : `${from.toLocaleString()} — ${to.toLocaleString()}`;
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {false && (
            <section className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-20 relative z-10">
              <div className="bg-[#0f0f3d]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 hover:border-[#00ff88]/30 transition-all duration-500 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#00ff88]/5 blur-[80px] rounded-full pointer-events-none"></div>
                <div>
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                    <div>
                      <h3 className="font-['Epilogue'] text-3xl font-black text-white tracking-wider uppercase">Herren Getränke</h3>
                      <p className="text-[#00ff88] text-[10px] font-black uppercase tracking-widest mt-1">Gratis Consumation</p>
                    </div>
                    <span className="bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/30 text-sm px-4 py-1.5 rounded-full font-black">40€</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-white/90 font-medium"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span><span className="font-['Be_Vietnam_Pro'] text-sm">Diverse Soft Drinks</span></div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-white/90 font-medium"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span><span className="font-['Be_Vietnam_Pro'] text-sm">Orangensaft</span></div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-white/90 font-medium"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span><span className="font-['Be_Vietnam_Pro'] text-sm">Kaffee</span></div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-white/90 font-medium"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span><span className="font-['Be_Vietnam_Pro'] text-sm">Tonic</span></div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-white/90 font-medium"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span><span className="font-['Be_Vietnam_Pro'] text-sm">Coca Cola</span></div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-white/90 font-medium"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span><span className="font-['Be_Vietnam_Pro'] text-sm">Energy Drinks</span></div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-white/90 font-medium"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span><span className="font-['Be_Vietnam_Pro'] text-sm">Bier</span></div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-white/90 font-medium"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span><span className="font-['Be_Vietnam_Pro'] text-sm">Mineralwasser</span></div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-white/90 font-medium"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span><span className="font-['Be_Vietnam_Pro'] text-sm">Wein (Rot &amp; Weiss)</span></div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="font-['Epilogue'] text-xs font-black text-white/40 uppercase tracking-widest mb-4">Premium Bottles (Gratis)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center font-['Be_Vietnam_Pro'] text-white/90"><span>Pascha Wodka (0,7 l)</span><span className="text-[#00ff88] text-xs font-bold uppercase tracking-widest">GRATIS</span></div>
                      <div className="flex justify-between items-center font-['Be_Vietnam_Pro'] text-white/90"><span>Pascha Rum (0,7 l)</span><span className="text-[#00ff88] text-xs font-bold uppercase tracking-widest">GRATIS</span></div>
                      <div className="flex justify-between items-center font-['Be_Vietnam_Pro'] text-white/90"><span>Pascha Gin (0,7 l)</span><span className="text-[#00ff88] text-xs font-bold uppercase tracking-widest">GRATIS</span></div>
                      <div className="flex justify-between items-center font-['Be_Vietnam_Pro'] text-white/90"><span>Pascha Whisky (0,7 l)</span><span className="text-[#00ff88] text-xs font-bold uppercase tracking-widest">GRATIS</span></div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 text-center text-white/30 text-[10px] uppercase tracking-widest font-medium">Unser Etablissement bietet Ihnen eine einzigartige Kombination aus erstklassigem Entertainment und diskretem Service.</div>
              </div>
            </section>
          )}
          </>
        )}

        {club === "all" ? (
          ALL_PAGE_SECTIONS.map((section) => {
            const sectionGirls = allAvailableGirlsByLocation[section.id] || [];

            return (
              <section key={section.id} className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-8 pb-10 mb-6 relative z-10">
                <div className="mb-10">
                  <h2 className="font-['Epilogue'] text-2xl lg:text-3xl font-extrabold text-white uppercase tracking-widest mb-2">
                    {section.title}
                  </h2>
                  <p className="font-['Be_Vietnam_Pro'] text-sm text-white/70 tracking-wide">
                    {section.subtitle}
                  </p>
                </div>

                {sectionGirls.length === 0 ? (
                  <div className="glass-card rounded-2xl border border-white/10 p-10 text-center text-white/50">
                    No available girls in this location right now.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sectionGirls.map((g) => (
                    <div
                      key={`all-${section.id}-${g.name}`}
                      onClick={() => navigate(`/profile/${g.name}`)}
                      className="cursor-pointer glass-card rounded-2xl overflow-hidden transition-all duration-500 group relative hover:shadow-[0_0_40px_rgba(255,0,255,0.25)] border border-white/10"
                    >
                      {/* Top Badge - only shown when admin assigns one */}
                      {g.top_badge && (
                        <div className="absolute top-3 right-3 z-30 pointer-events-none">
                          <div className="bg-[#ff00ff]/90 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,0,255,0.4)] uppercase tracking-widest">
                            {g.top_badge}
                          </div>
                        </div>
                      )}

                      {/* Available Badge - Top Left */}
                      <div className="absolute top-3 left-3 z-30 pointer-events-none">
                        <div className="bg-[#00ff88]/90 backdrop-blur-md text-black text-[11px] font-black px-3 py-1.5 rounded-full border border-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.4)] uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-black rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]"></span>
                          Available
                        </div>
                      </div>

                      <div className="relative h-[380px] overflow-hidden">
                        {(g.img_type === "video" || isVideoUrl(g.img)) ? (
                          <video
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            src={g.img}
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            alt={g.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            src={g.img}
                            loading="lazy"
                          />
                        )}

                        {/* Bottom Info Gradient */}
                        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#0f0f3d] via-[#0f0f3d]/60 to-transparent z-10">
                          {/* Phone Badge centered above name */}
                          <div className="flex justify-center mb-3">
                            <div className="bg-white/10 backdrop-blur-md text-white text-[12px] font-black px-4 py-1.5 rounded-full border border-white/20 shadow-xl uppercase tracking-widest flex items-center gap-2 group/phone hover:bg-white/20 transition-all">
                              <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                              +43 664 123 456
                            </div>
                          </div>

                          <h3 className="font-['Epilogue'] text-xl font-black text-white tracking-wide mb-1 text-center">
                            {g.name}
                          </h3>
                          <p className="text-white/70 font-['Be_Vietnam_Pro'] text-xs leading-relaxed mb-2 font-medium flex items-center justify-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-[#ffabf3]">location_on</span>
                            Available in {section.title}
                          </p>
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })
        ) : club === "laufhaus" ? (
          <section className="max-w-[1000px] mx-auto px-6 lg:px-8 mb-20 -mt-36 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { 
                  id: "braunau", 
                  title: "Pascha Braunau am Inn", 
                  img: "/wp-content/uploads/2026/05/hotel-1-scaled.webp",
                  address: "Salzburger Str. 136, 5280 Braunau am Inn"
                },
                { 
                  id: "salzburg", 
                  title: "Pasha Salzburg", 
                  img: "/wp-content/uploads/2026/05/hotel-2-scaled.webp",
                  address: "Sterneckstraße 14, 5020 Salzburg"
                }
              ].map((loc) => (
                <div 
                  key={loc.id}
                  onClick={() => navigate(`/work-with-us/${loc.id}`)}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:shadow-[0_0_50px_rgba(255,0,255,0.2)] transition-all duration-500"
                >
                  <div className="relative h-[400px] overflow-hidden">
                    <img 
                      src={loc.img} 
                      alt={loc.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f3d] via-[#0f0f3d]/20 to-transparent" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="bg-[#ff00ff] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg">
                        Reserve Room Now
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8">
                      <h3 className="font-['Epilogue'] text-2xl font-black text-white uppercase tracking-widest mb-3">
                        {loc.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                        <span className="material-symbols-outlined text-sm text-[#ffabf3]">location_on</span>
                        {loc.address}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : club === "nightclub" ? null : (
          <section className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-20 -mt-36 relative z-10">
            <div className="mb-10">
              <h2 className="font-['Epilogue'] text-2xl lg:text-3xl font-extrabold text-white uppercase tracking-widest mb-2">
                Available Girls
              </h2>
              <p className="font-['Be_Vietnam_Pro'] text-sm text-white/70 tracking-wide">
                Now presenting in Salzburg &amp; Braunau
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableGirls.map((g, index) => (
                <div
                  key={`available-${g.name}`}
                  onClick={() => navigate(`/profile/${g.name}`)}
                  className="cursor-pointer glass-card rounded-2xl overflow-hidden transition-all duration-500 group relative hover:shadow-[0_0_40px_rgba(255,0,255,0.25)] border border-white/10"
                >
                  {/* Top Badge - only shown when admin assigns one */}
                  {g.top_badge && (
                    <div className="absolute top-3 right-3 z-30 pointer-events-none">
                      <div className="bg-[#ff00ff]/95 text-white text-[12px] font-black px-3.5 py-2 rounded-full border border-white/25 shadow-[0_0_22px_rgba(255,0,255,0.55)] uppercase tracking-[0.18em] drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                        {g.top_badge}
                      </div>
                    </div>
                  )}

                  {/* Available Badge - Top Left */}
                  <div className="absolute top-3 left-3 z-30 pointer-events-none">
                    <div className="bg-[#00e5ff]/95 text-[#061019] text-[12px] font-black px-3.5 py-2 rounded-full border border-white/25 shadow-[0_0_22px_rgba(0,229,255,0.55)] uppercase tracking-[0.18em] flex items-center gap-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                      <span className="w-2.5 h-2.5 bg-[#061019] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.65)]"></span>
                      Available
                    </div>
                  </div>

                  <div className="relative h-[380px] overflow-hidden">
                    {(g.img_type === "video" || isVideoUrl(g.img)) ? (
                      <video
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={g.img}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        alt={g.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={g.img}
                        loading="lazy"
                      />
                    )}

                    {/* Bottom Info Gradient */}
                    <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#0f0f3d] via-[#0f0f3d]/60 to-transparent z-10">
                      <h3 className="font-['Epilogue'] text-2xl font-black text-white tracking-wide mb-1 text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                        {g.name}
                      </h3>
                      <p className="font-['Be_Vietnam_Pro'] text-[13px] leading-relaxed mb-2 font-semibold flex items-center justify-center gap-1.5 text-[#e9c349] drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]">
                        <span className="material-symbols-outlined text-sm text-[#ffabf3]">location_on</span>
                        Available in {clubInfo.name}
                      </p>

                      {/* Phone Badge - bottom */}
                        <div className="mt-3 flex justify-center">
                          <div className="bg-[#25D366]/15 text-white text-[13px] font-black px-4 py-2 rounded-full border border-[#25D366]/40 shadow-[0_0_18px_rgba(37,211,102,0.35)] uppercase tracking-[0.18em] flex items-center gap-2 hover:bg-[#25D366]/25 transition-all">
                            <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                            +43 664 123 456
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Special Sections for Nightclub */}
        {club === "nightclub" && (
          <>
            {/* Services & Nightclub Entrance Card */}
            <section className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-20">
              <div className="text-center mb-16">
                <div className="hidden">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/55 to-transparent mb-4"></div>
                  <div className="flex items-center gap-4">
                    <span className="h-px flex-1 bg-gradient-to-r from-[#ff00ff]/0 via-[#ff00ff]/50 to-[#ff00ff]/10"></span>
                    <span className="text-[#ff3f8f] text-2xl drop-shadow-[0_0_18px_rgba(255,0,255,0.45)]">♛</span>
                    <span className="h-px flex-1 bg-gradient-to-l from-[#ff00ff]/0 via-[#ff00ff]/50 to-[#ff00ff]/10"></span>
                  </div>
                  <h3 className="mt-4 font-['Epilogue'] text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-[0.12em] leading-[1.12] drop-shadow-[0_0_18px_rgba(255,255,255,0.18)]">
                    Table Dance / Nightclub
                    <span className="block text-[#e9c349] tracking-[0.18em] mt-1">
                      Lapdance Striptease
                    </span>
                  </h3>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/35 to-transparent mt-4"></div>
                </div>
                <div className="mx-auto max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ff00ff]/60 to-white/20"></span>
                    <span className="font-['Be_Vietnam_Pro'] text-[10px] font-black text-[#ffabf3] uppercase tracking-[0.45em]">
                      Salzburg
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#ff00ff]/60 to-white/20"></span>
                  </div>
                  <h2 className="font-['Epilogue'] text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-[0.14em] leading-tight drop-shadow-[0_0_20px_rgba(255,0,255,0.22)]">
                    Club Services
                    <span className="block text-[#e9c349] tracking-[0.22em]">& Prices</span>
                  </h2>
                  <div className="mx-auto mt-5 h-[2px] w-44 bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent shadow-[0_0_16px_rgba(255,0,255,0.85)]"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Services Left Panel */}
                <div className="lg:col-span-7 bg-[#0c0f3d]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 flex flex-col justify-between hover:border-[#ff00ff]/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff00ff]/5 blur-[80px] rounded-full pointer-events-none" />
                  
                  <div>
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                      <h3 className="font-['Epilogue'] text-3xl font-black text-white tracking-wider uppercase">Services</h3>
                      <span className="bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/30 text-[10px] px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">Salzburg</span>
                    </div>

                    <div className="space-y-6">
                      {[
                        { name: "Pascha Dollar", price: "30" },
                        { name: "Dusche Show", price: "50" },
                        { name: "1/2 Stunde (30 Minutes) in room", price: "100" },
                        { name: "1 Stunde (60 Minutes) in room", price: "200" },
                      ].map((item) => (
                        <div key={item.name} className="flex justify-between items-end gap-4 group">
                          <span className="font-['Be_Vietnam_Pro'] text-white/90 text-lg font-semibold tracking-wide group-hover:text-[#ffabf3] transition-colors">{item.name}</span>
                          <div className="flex-1 border-b border-dashed border-white/10 mb-2 h-0 group-hover:border-white/25 transition-all"></div>
                          <span className="font-['Epilogue'] text-2xl font-black text-white">{item.price}€</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl">
                      <h4 className="font-['Epilogue'] text-lg font-black text-[#e9c349] tracking-widest uppercase mb-4">Jacuzzi & Dolls</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-['Be_Vietnam_Pro'] text-white/80 font-medium">Jacuzzi 1 Stunde</span>
                          <span className="font-['Epilogue'] text-xl font-bold text-white">300€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-['Be_Vietnam_Pro'] text-white/80 font-medium">Sexdolls 1 Stunde</span>
                          <span className="font-['Epilogue'] text-xl font-bold text-white">200€</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <div className="text-center mb-4">
                      <span className="text-[#00ff88] text-xl font-black uppercase tracking-widest inline-block drop-shadow-[0_0_10px_rgba(0,255,136,0.6)] animate-pulse">Alles mit Schutz!</span>
                    </div>

                  </div>
                </div>

                {/* Services Right Promotional Image Panel */}
                <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[450px] border border-white/10 group shadow-2xl">
                  <img 
                    src="/wp-content/uploads/2026/05/gallery-09-scaled.webp" 
                    alt="Pascha Salzburg" 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-[0.4]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f3d] via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-left">
                    <img 
                      src="/wp-content/themes/night-club-theme/dist/images/Logo-Pascha-.png" 
                      alt="Pascha Logo" 
                      className="h-16 w-auto object-contain self-start mb-6 drop-shadow-[0_0_15px_rgba(255,0,255,0.4)]"
                    />
                    <h3 className="font-['Epilogue'] text-2xl font-black text-white uppercase tracking-widest mb-2">Pascha Salzburg</h3>
                    <p className="font-['Be_Vietnam_Pro'] text-white/60 text-sm leading-relaxed mb-4">
                      Sterneckstraße 14, 5020 Salzburg<br/>
                      www.pascha-salzburg.at
                    </p>
                    <div className="inline-flex items-center gap-2 bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/30 text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-widest w-max">
                      Herzlich Willkommen
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Intro text between services and drinks */}
            <div className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-16 text-center">
              <div className="w-16 h-0.5 bg-[#ff00ff]/50 mx-auto mb-6 shadow-[0_0_12px_rgba(255,0,255,0.6)]"></div>
              <p className="font-['Epilogue'] text-white text-2xl lg:text-3xl font-bold leading-relaxed max-w-4xl mx-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
                Unser Etablissement bietet Ihnen eine einzigartige Kombination aus erstklassigem Entertainment und diskretem Service.
              </p>
              <div className="w-16 h-0.5 bg-[#ff00ff]/50 mx-auto mt-6 shadow-[0_0_12px_rgba(255,0,255,0.6)]"></div>
            </div>

            {/* Liquid Gold & Getränkekarte Section */}
            <section className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-24">
              <div className="text-center mb-16">
                <span className="font-['Be_Vietnam_Pro'] text-[10px] font-extrabold text-[#e9c349] tracking-[0.4em] uppercase mb-4 block">Premium Drinks Selection</span>
                <h2 className="font-['Epilogue'] text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-widest mb-4">
                  Getränkekarte
                </h2>
                <div className="w-24 h-1 bg-[#e9c349] mx-auto shadow-[0_0_10px_rgba(233,195,73,0.8)]"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Herren Getränke (Gratis) Panel */}
                <div className="bg-[#0f0f3d]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 hover:border-[#00ff88]/30 transition-all duration-500 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-[#00ff88]/5 blur-[80px] rounded-full pointer-events-none" />
                  
                  <div>
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                      <div>
                        <h3 className="font-['Epilogue'] text-3xl font-black text-white tracking-wider uppercase">Herren Getränke</h3>
                        <p className="text-[#00ff88] text-[10px] font-black uppercase tracking-widest mt-1">Gratis Consumation</p>
                      </div>
<span className="bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/30 text-3xl px-8 py-3 rounded-full font-black">40€</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Diverse Soft Drinks",
                        "Orangensaft",
                        "Kaffee",
                        "Tonic",
                        "Coca Cola",
                        "Energy Drinks",
                        "Bier",
                        "Mineralwasser",
                        "Wein (Rot & Weiss)"
                      ].map((drink) => (
                        <div key={drink} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-white/90 font-medium">
                          <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span>
                          <span className="font-['Be_Vietnam_Pro'] text-sm">{drink}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10">
                      <h4 className="font-['Epilogue'] text-xs font-black text-white/40 uppercase tracking-widest mb-4">Premium Bottles (Gratis)</h4>
                      <div className="space-y-3">
                        {[
                          "Pascha Wodka (0,7 l)",
                          "Pascha Rum (0,7 l)",
                          "Pascha Gin (0,7 l)",
                          "Pascha Whisky (0,7 l)"
                        ].map((bottle) => (
                          <div key={bottle} className="flex justify-between items-center font-['Be_Vietnam_Pro'] text-white/90">
                            <span>{bottle}</span>
                            <span className="text-[#00ff88] text-xs font-bold uppercase tracking-widest">GRATIS</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 text-center text-white/30 text-[10px] uppercase tracking-widest font-medium">
                    Unser Etablissement bietet Ihnen eine einzigartige Kombination aus erstklassigem Entertainment und diskretem Service.
                  </div>
                </div>

                {/* Damen Getränke Panel */}
                <div className="bg-[#0f0f3d]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 hover:border-[#e9c349]/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9c349]/5 blur-[80px] rounded-full pointer-events-none" />
                  
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                    <div>
                      <h3 className="font-['Epilogue'] text-3xl font-black text-white tracking-wider uppercase">Damen Getränke</h3>
                      <p className="text-[#e9c349] text-[10px] font-black uppercase tracking-widest mt-1">Premium Selection</p>
                    </div>
                    <span className="bg-[#e9c349]/20 text-[#e9c349] border border-[#e9c349]/30 text-[10px] px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">Premium</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: "Pascha Crystal (0,35 l)", price: "155" },
                      { name: "Pascha Crystal (0,70 l)", price: "250" },
                      { name: "Schlumberger (0,7 l)", price: "150" },
                      { name: "Moët & Chandon (0,30 l)", price: "150" },
                      { name: "Moët & Chandon (0,70 l)", price: "300" },
                      { name: "Moët & Chandon Rosé (0,70 l)", price: "350" },
                      { name: "Moët & Magnum (1,5 l)", price: "650" },
                      { name: "Cremant (0,7 l)", price: "500" },
                      { name: "Dom Pérignon (0,7 l)", price: "1000" },
                      { name: "Nyetimber (0,7 l)", price: "250" },
                    ].map((item) => (
                      <div key={item.name} className="flex justify-between items-end gap-4 group">
                        <span className="font-['Be_Vietnam_Pro'] text-white/80 text-sm font-medium tracking-wide group-hover:text-[#e9c349] transition-colors">{item.name}</span>
                        <div className="flex-1 border-b border-dashed border-white/10 mb-1.5 h-0"></div>
                        <span className="font-['Epilogue'] text-base font-extrabold text-white">{item.price}€</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-[#e9c349] text-xs font-bold uppercase tracking-widest">
                    <span>Diverse Weine</span>
                    <span>Cubanische Zigarren</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {club !== "nightclub" && club !== "all" && club !== "laufhaus" && (
          <section className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-20">
            <div className="mb-12">
              <h2 className="font-['Epilogue'] text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-widest mb-2">
                Upcoming Arrivals
              </h2>
              <p className="font-['Be_Vietnam_Pro'] text-white/70 tracking-wide">
                Arriving soon to our private ateliers
              </p>
            </div>

            <div className="relative w-full">
              <div
                ref={soonTrackRef}
                className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[calc((100%-24px)/2)] md:auto-cols-[calc((100%-48px)/3)] lg:auto-cols-[calc((100%-72px)/4)] overflow-x-auto gap-6 pb-6 no-scrollbar"
              >
                {soonGirls.map((g, idx) => (
                  <div
                    key={`soon-${g.name}-${idx}`}
                    onClick={() => navigate(`/profile/${g.name}`)}
                    className="cursor-pointer glass-card rounded-lg overflow-hidden group relative border border-white/15 hover:shadow-[0_0_30px_rgba(255,0,255,0.2)] transition-all"
                  >
                    <div className="relative h-[340px] transition-all duration-500">
                      {/* Top Rank Badge - only shown when admin assigns one */}
                      {g.top_badge && (
                        <div className="absolute top-2 right-2 z-30 pointer-events-none">
                          <div className="bg-[#ff00ff]/95 text-white text-[12px] font-black px-3.5 py-2 rounded-full border border-white/25 shadow-[0_0_22px_rgba(255,0,255,0.55)] uppercase tracking-[0.18em] drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                            {g.top_badge}
                          </div>
                        </div>
                      )}

                      {/* Available Soon Badge */}
                      <div className="absolute top-2 left-2 z-30 pointer-events-none">
                        <div className="bg-[#00e5ff]/95 text-[#061019] text-[12px] font-black px-3.5 py-2 rounded-full border border-white/25 shadow-[0_0_22px_rgba(0,229,255,0.55)] uppercase tracking-[0.18em] flex items-center gap-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                          <span className="w-2.5 h-2.5 bg-[#061019] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.65)]"></span>
                          Soon
                        </div>
                      </div>

                      {(g.img_type === "video" || isVideoUrl(g.img)) ? (
                        <video
                          className="w-full h-full object-cover"
                          src={g.img}
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          alt={g.name}
                          className="w-full h-full object-cover"
                          src={g.img}
                          loading="lazy"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#0f0f3d] via-[#0f0f3d]/60 to-transparent z-10">
                        <h3 className="font-['Epilogue'] text-2xl font-black text-white tracking-wide mb-1 text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                          {g.name}
                        </h3>
                        <p className="font-['Be_Vietnam_Pro'] text-[13px] leading-relaxed mb-2 font-semibold flex items-center justify-center gap-1.5 text-[#e9c349] drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]">
                          <span className="material-symbols-outlined text-sm text-[#ffabf3]">location_on</span>
                          Available in {clubInfo.name}
                        </p>

                        {/* Phone Badge - bottom */}
                        <div className="mt-3 flex justify-center">
                          <div className="bg-[#25D366]/15 text-white text-[13px] font-black px-4 py-2 rounded-full border border-[#25D366]/40 shadow-[0_0_18px_rgba(37,211,102,0.35)] uppercase tracking-[0.18em] flex items-center gap-2 hover:bg-[#25D366]/25 transition-all">
                            <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                            +43 664 123 456
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {club !== "all" && club !== "laufhaus" && (
          <section className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-20">
            <div className="mb-12">
              <h2 className="font-['Epilogue'] text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-widest mb-2">
                Our Atmosphere
              </h2>
              <p className="font-['Be_Vietnam_Pro'] text-white/70 max-w-3xl leading-relaxed">
                Our nightclub offers a vibrant and energetic atmosphere with dim lights, powerful music, and a lively
                dance floor perfect for an unforgettable night out.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
              {atmosphereTiles.map((tile, idx) => (
                <div
                  key={idx}
                  className={[tile.className, "relative overflow-hidden rounded-xl group cursor-pointer glass-card border border-white/15"].join(" ")}
                >
                  <img
                    alt={tile.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={tile.img}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F3D]/90 via-transparent to-transparent opacity-100 group-hover:via-[#0F0F3D]/20 transition-all duration-500"></div>
                  <div className={`absolute bottom-0 left-0 w-full ${tile.pad}`}>
                    <h3 className={`${tile.heading} text-white mb-2`}>{tile.title}</h3>
                    <p className={tile.text}>{tile.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {club === "laufhaus" && <RoomReservation />}

        <section className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-20 mt-16 lg:mt-20">
          <h2 className="font-['Epilogue'] text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-widest mb-12 text-center">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card p-8 rounded-xl text-center transition-all border border-white/15 hover:shadow-[0_0_22px_rgba(255,0,255,0.2)]">
              <span className="material-symbols-outlined text-4xl text-[#ffabf3] mb-4">
                location_on
              </span>
              <h3 className="font-['Epilogue'] text-2xl font-extrabold text-white mb-2">
                Location
              </h3>
              <p className="font-['Be_Vietnam_Pro'] text-white/70">
                {clubInfo.address}
              </p>
            </div>
            <div className="glass-card p-8 rounded-xl text-center transition-all border border-white/15 hover:shadow-[0_0_22px_rgba(255,0,255,0.2)]">
              <span className="material-symbols-outlined text-4xl text-[#ffabf3] mb-4">
                mail
              </span>
              <h3 className="font-['Epilogue'] text-2xl font-extrabold text-white mb-2">
                Email
              </h3>
              <p className="font-['Be_Vietnam_Pro'] text-white/70">
                office@pascha.com
                <br />
                info@pascha.at
              </p>
            </div>
            <div className="glass-card p-8 rounded-xl text-center transition-all border border-white/15 hover:shadow-[0_0_22px_rgba(255,0,255,0.2)]">
              <span className="material-symbols-outlined text-4xl text-[#ffabf3] mb-4">
                chat
              </span>
              <h3 className="font-['Epilogue'] text-2xl font-extrabold text-white mb-2">
                WhatsApp
              </h3>
              <p className="font-['Be_Vietnam_Pro'] text-white/70">
                +43 664 1234567
                <br />
                Available 24/7
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              type="button"
              className="px-12 py-4 bg-[#ff00ff] rounded-lg font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] transition-all min-w-[240px] text-white active:scale-95 no-hover-scale border border-white/20"
            >
              Live Chat
            </button>
            <button
              type="button"
              className="px-12 py-4 border-2 border-[#ffabf3] text-[#ffabf3] rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#ffabf3]/10 transition-all min-w-[240px] active:scale-95"
              onClick={() => navigate("/")}
            >
              Back To Home
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
