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

  // Category-based request state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMsg, setRequestMsg] = useState(null);

  const CATEGORIES = ["EU Ladies/Non Asian Ladies", "Chinese/Asian Ladies", "Trans Ladies"];

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
                    {/* Category Selection */}
                    <div>
                      <label className="block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-3">
                        Select Your Category
                      </label>
                      <div className="space-y-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setBookingStatus(null);
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl border font-bold text-[10px] uppercase tracking-wider transition-all duration-300 ${
                              selectedCategory === cat
                                ? "bg-[#E3087E] text-white border-[#E3087E] shadow-lg shadow-[#E3087E]/30"
                                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedCategory && (
                      <div className="p-4 bg-[#E3087E]/5 border border-[#E3087E]/20 rounded-2xl text-center">
                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Weekly Rate</div>
                        <div className="text-xl font-extrabold text-[#E3087E]">
                          €{perWeekRate}
                          <span className="text-xs text-white/40 font-normal block mt-0.5">
                            {activeLoc === "salzburg" ? "Salzburg" : "Braunau"} • {selectedCategory}
                          </span>
                        </div>
                      </div>
                    )}

                    {(user?.user_type !== "girl" || selectedCategory) && (
                    <div className="pt-4 border-t border-white/10 text-center">
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
                    )}

                    {/* Selected Date Box */}
                    {startDate && endDate && (
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2 animate-in slide-in-from-bottom-4 duration-300">
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
                      <div className={`p-4 rounded-2xl border text-xs text-center font-medium animate-in fade-in duration-300 ${
                        bookingStatus.success
                          ? "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20"
                          : "bg-[#ff0000]/10 text-red-400 border-red-500/20"
                      }`}>
                        {bookingStatus.message}
                      </div>
                    )}

                    {/* Submit reservation button */}
                    {user?.user_type === "girl" && !selectedCategory ? (
                      <div className="text-center p-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 text-[10px] uppercase tracking-widest font-bold">
                        Select a category first
                      </div>
                    ) : startDate && endDate ? (
                      <button
                        type="button"
                        onClick={handleBookingSubmit}
                        disabled={loading}
                        className="w-full py-4 bg-[#E3087E] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#c0066a] disabled:bg-[#E3087E]/50 transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] text-xs flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Reserving...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">send</span>
                          {user?.user_type === "girl" ? `Request (€${totalCost.toFixed(2)})` : `Reserve Suite (€${totalCost.toFixed(2)})`}
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center p-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 text-[10px] uppercase tracking-widest font-bold">
                        Select a Sunday on calendar
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="w-14 h-14 bg-[#E3087E]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E3087E]/30">
                        <span className="material-symbols-outlined text-[#E3087E] text-2xl">info</span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">Manage Room Schedule</h3>
                      <p className="text-white/40 text-xs leading-relaxed font-['Be_Vietnam_Pro']">
                        Select available dates and suites to confirm your room reservation. The calendar operates from Sunday to Saturday.
                      </p>
                    </div>

                    <div className="space-y-3">
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

      <Footer />
    </div>
  );
}
