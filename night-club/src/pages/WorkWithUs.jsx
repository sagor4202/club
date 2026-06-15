import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReservationCalendar from "../components/ReservationCalendar";

export default function WorkWithUs() {
  const navigate = useNavigate();
  const { location: locId } = useParams();
  const { state: navState } = useLocation();
  const activeLoc = locId || navState?.location || "general";
  const isWpAdmin = Boolean(window.paschaCurrentUser?.is_admin);

  const [footerPad, setFooterPad] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [reservations, setReservations] = useState([]);
  const [weeklyCosts, setWeeklyCosts] = useState({ braunau: 500, salzburg: 600, nightclub: 400 });
  
  const [bookingStatus, setBookingStatus] = useState(null); // { success: boolean, message: string }

  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showNcModal, setShowNcModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectedAvailDates, setSelectedAvailDates] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqMsg, setReqMsg] = useState(null);
  const [ncReqFrom, setNcReqFrom] = useState("");
  const [ncReqTo, setNcReqTo] = useState("");
  const [ncReqLoading, setNcReqLoading] = useState(false);
  const [ncReqMsg, setNcReqMsg] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  // Category-based request state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMsg, setRequestMsg] = useState(null);

  const CATEGORIES = ["EU Ladies/Non Asian Ladies", "Chinese/Asian Ladies", "Trans Ladies"];

  const LOCATIONS = [
    { id: "braunau", label: "Pascha Laufhaus - Braunau am Inn" },
    { id: "salzburg", label: "Pascha Laufhaus - Salzburg" },
  ];

  const PRICES = {
    "EU Ladies/Non Asian Ladies": { braunau: 700, salzburg: 850 },
    "Chinese/Asian Ladies":       { braunau: 750, salzburg: 1000 },
    "Trans Ladies":               { braunau: 750, salzburg: 1000 },
  };

  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);  // Fetch reservations & weekly costs on load
  const fetchData = async () => {
    try {
      const [resRes, costRes] = await Promise.all([
        fetch(`/wp-json/pascha/v1/reservations?t=${Date.now()}`),
        fetch(`/wp-json/pascha/v1/weekly-costs?t=${Date.now()}`)
      ]);
      if (resRes.ok) {
        const data = await resRes.json();
        setReservations(data);
      }
      if (costRes.ok) {
        const data = await costRes.json();
        setWeeklyCosts(data);
      }
    } catch (err) {
      console.error("Error fetching reservation data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeLoc]);

  // Require login to access Work With Us submenus
  useEffect(() => {
    if (!locId || user || isWpAdmin) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/wp-json/pascha/v1/me?t=${Date.now()}`, { credentials: "include" });
        const data = await res.json();
        if (!cancelled && !(data && data.is_admin)) {
          navigate("/login");
        }
      } catch {
        if (!cancelled) navigate("/login");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locId, user, isWpAdmin, navigate]);

  // Auto-show the new reservation choice modal for girls when entering braunau or salzburg pages
  useEffect(() => {
    if (user && user.user_type === "girl" && (activeLoc === "braunau" || activeLoc === "salzburg")) {
      setShowChoiceModal(true);
    }
  }, [activeLoc, user]);

  // Extract all booked dates for the current location
  const getBookedDates = () => {
    const booked = [];
    reservations.forEach((res) => {
      if (res.location === activeLoc) {
        // If current user is a girl, skip other girls' reservations
        if (user && user.user_type === "girl") {
          const isMyEmail = res.user_email && user.email && res.user_email === user.email;
          const isMyName = res.girl_name === user.name;
          if (!isMyEmail && !isMyName) {
            return; // skip if it's not my reservation
          }
        }

        const start = new Date(res.start_date);
        const end = new Date(res.end_date);
        // Loop from start to end day and push to list
        const d = new Date(start);
        while (d <= end) {
          booked.push(d.toDateString());
          d.setDate(d.getDate() + 1);
        }
      }
    });
    return booked;
  };

  const bookedDates = getBookedDates();

  const handleRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setBookingStatus(null);
  };

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleBookingSubmit = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    if (!startDate || !endDate) return;
    setLoading(true);
    setBookingStatus(null);

    if (user.user_type === "girl" && !selectedCategory) {
      setBookingStatus({ success: false, message: "Please select a category first." });
      setLoading(false);
      return;
    }

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    try {
      let response;
      if (user.user_type === "girl") {
        response = await fetch("/wp-json/pascha/v1/girls/request-reservation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            category: selectedCategory,
            location: activeLoc,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            price: totalCost,
          }),
        });
      } else {
        response = await fetch("/wp-json/pascha/v1/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            location: activeLoc,
            suite_type: "Premium Suite 01",
            start_date: formatDate(startDate),
            end_date: formatDate(endDate)
          })
        });
      }

      const data = await response.json();
      if (response.ok && data.success) {
        setBookingStatus({ success: true, message: data.message });
        setStartDate(null);
        setEndDate(null);
        fetchData();
      } else {
        setBookingStatus({ success: false, message: data.message || "Reservation failed." });
      }
    } catch (err) {
      console.error("Booking error:", err);
      setBookingStatus({ success: false, message: err.message || "An error occurred while booking. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const LOCATION_DATA = {
    braunau: {
      title: "Pascha Braunau am Inn",
      subtitle: "Salzburger Str. 136 // 5280 Braunau am Inn",
      heroImg: "/wp-content/uploads/2026/05/hotel-1-scaled.webp",
      previewImg: "/wp-content/uploads/2026/05/hotel-1-scaled.webp",
      suite: "Premium Braunau Suite"
    },
    salzburg: {
      title: "Pasha Salzburg",
      subtitle: "Sterneckstraße 14 // 5020 Salzburg",
      heroImg: "/wp-content/uploads/2026/05/hotel-2-scaled.webp",
      previewImg: "/wp-content/uploads/2026/05/hotel-2-scaled.webp",
      suite: "Exclusive Salzburg Suite"
    },
    general: {
      title: "Reserve Your Sanctuary",
      subtitle: "Select your preferred window of tranquility.",
      heroImg: "/wp-content/uploads/2026/05/gallery-09-scaled.webp",
      previewImg: "/wp-content/uploads/2026/05/gallery-10-scaled.webp",
      suite: "Member Private Suite"
    }
  };

  const currentLoc = LOCATION_DATA[activeLoc] || LOCATION_DATA.general;

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const update = () => setFooterPad(Math.ceil(footer.getBoundingClientRect().height));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const calendarMode = (user && user.user_type === "girl") ? "book" : "view";
  const perWeekRate = (user?.user_type === "girl" && selectedCategory) ? (PRICES[selectedCategory]?.[activeLoc] || 0) : weeklyCosts[activeLoc] || 500;
  const suites = ["Premium Suite 01", "Exclusive Suite 02", "VIP Club Suite 03", "Luxury Suite 04"];

  const getWeeksCount = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    s.setHours(0, 0, 0, 0);
    const e = new Date(endDate);
    e.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const weeks = Math.ceil(diffDays / 7);
    return weeks > 0 ? weeks : 1;
  };
  const weeksCount = getWeeksCount();
  const totalCost = perWeekRate * weeksCount;

  return (
    <div className="min-h-screen bg-[#0c0f0f] selection:bg-[#E3087E] selection:text-white" style={{ paddingBottom: footerPad }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center px-6 pt-24 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/wp-content/uploads/2026/05/gallery-09-scaled.webp" 
            alt="Sanctuary Hero" 
            className="w-full h-full object-cover brightness-[0.4] object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0c0f0f]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          {activeLoc !== "general" && (
            <span className="font-['Be_Vietnam_Pro'] text-[12px] font-bold text-[#E3087E] tracking-[0.3em] block mb-4 uppercase">
              {currentLoc.title}
            </span>
          )}
          <h1 className="font-['Serif',serif] text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight uppercase whitespace-nowrap animate-in fade-in duration-700">
            Reserve Your Sanctuary
          </h1>
          <div className="w-16 h-1 bg-[#E3087E] mx-auto rounded-full" />
          <p className="font-['Be_Vietnam_Pro'] text-white/80 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            {currentLoc.subtitle}
          </p>
        </div>
      </section>

      <main className="pb-24 px-4 lg:px-8 xl:px-12 -mt-24 relative z-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Calendar Section */}
          <div className="lg:col-span-8 space-y-6">
            <ReservationCalendar 
              mode={calendarMode} 
              bookedDates={bookedDates} 
              onRangeChange={handleRangeChange} 
            />
          </div>

          {/* Sidebar - Suite Config & Actions */}
          <div className="lg:col-span-4">
            <div className="glass-card rounded-[40px] overflow-hidden border border-white/10 shadow-2xl sticky top-32">
              <div className="relative h-52 overflow-hidden">
                <img src={currentLoc.previewImg} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Suite Preview" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f0f] via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <div className="px-3 py-1 bg-[#E3087E] text-white text-[9px] font-bold uppercase tracking-widest rounded-full inline-block mb-2 shadow-lg">
                    {user?.user_type === "girl" && selectedCategory ? selectedCategory : "Room Booking"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#E3087E]">location_on</span>
                    <h4 className="text-white text-sm font-bold tracking-wide">{currentLoc.title}</h4>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {user && user.user_type === "girl" ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 bg-[#E3087E]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E3087E]/30">
                        <span className="material-symbols-outlined text-[#E3087E] text-2xl">calendar_month</span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">New Reservation</h3>
                      <p className="text-white/40 text-xs leading-relaxed font-['Be_Vietnam_Pro']">
                        Click below to start your room or nightclub reservation request in a few easy steps.
                      </p>
                    </div>

                    <button 
                      type="button"
                      onClick={() => setShowChoiceModal(true)}
                      className="w-full py-4 mb-3 bg-[#E3087E] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#c0066a] transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] text-xs flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      New Reservation
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="w-14 h-14 bg-[#E3087E]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E3087E]/30">
                        <span className="material-symbols-outlined text-[#E3087E] text-2xl">info</span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">Manage Suite Booking</h3>
                      <p className="text-white/40 text-xs leading-relaxed font-['Be_Vietnam_Pro']">
                        Select available dates and suites to confirm your room reservation. The calendar operates from Sunday to Saturday.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 text-center mb-4">
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">
                        {weeksCount > 1 ? "Total Booking Cost" : "Weekly Rate"}
                      </div>
                      <div className="text-3xl font-extrabold text-white">
                        €{totalCost.toFixed(2)}
                        <span className="text-xs text-white/40 font-normal">
                          {weeksCount > 1 ? ` for ${weeksCount} weeks` : " / week"}
                        </span>
                      </div>
                    </div>

                    {/* Selected Date Box */}
                    {startDate && endDate && (
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2 mb-4 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center">
                          <div className="text-[9px] text-[#00ff88] font-bold uppercase tracking-widest">Selected Period</div>
                          <div className="text-[9px] bg-[#E3087E]/20 text-[#E3087E] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            {weeksCount} {weeksCount === 1 ? "Week" : "Weeks"}
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-white">
                          <div>
                            <span className="block text-white/30 text-[8px] uppercase font-bold">Check-In</span>
                            {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          <div className="flex items-center text-white/20">➔</div>
                          <div className="text-right">
                            <span className="block text-white/30 text-[8px] uppercase font-bold">Check-Out</span>
                            {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Booking Status Message */}
                    {bookingStatus && (
                      <div className={`p-4 rounded-2xl border text-xs text-center font-medium animate-in fade-in duration-300 mb-4 ${
                        bookingStatus.success
                          ? "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20"
                          : "bg-[#ff0000]/10 text-red-400 border-red-500/20"
                      }`}>
                        {bookingStatus.message}
                      </div>
                    )}

                    {startDate && endDate ? (
                      <button
                        type="button"
                        onClick={handleBookingSubmit}
                        disabled={loading}
                        className="w-full py-4 mb-3 bg-[#E3087E] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#c0066a] disabled:bg-[#E3087E]/50 transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] text-xs flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Reserving...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">send</span>
                            Reserve Suite (€{totalCost.toFixed(2)})
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center p-4 bg-white/5 border border-white/5 rounded-2xl mb-3 text-white/40 text-[10px] uppercase tracking-widest font-bold">
                        Select a Sunday on calendar
                      </div>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <span className="w-3 h-3 rounded-sm bg-[#E3087E]/30 border border-[#E3087E] flex-none" />
                        <span className="text-white/60 text-xs">Available / Booked week</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <span className="w-3 h-3 rounded-sm bg-black/40 border border-white/10 flex-none" />
                        <span className="text-white/60 text-xs">Past or unavailable date</span>
                      </div>
                    </div>

                    <a 
                      href="https://wa.me/43000000000" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full py-4 bg-[#25D366] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#1eb857] transition-all shadow-lg text-xs flex items-center justify-center gap-3"
                    >
                      <span className="material-symbols-outlined text-lg">chat</span>
                      Contact via WhatsApp
                    </a>

                                      </>
                )}

                <div className="flex items-center justify-center gap-2 opacity-30 pt-2">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <p className="text-[9px] uppercase tracking-widest font-bold">Discreet & Secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
                          fetchData();
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
