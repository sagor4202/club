import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../i18n/LanguageContext";

export default function Register() {
  const navigate = useNavigate();
  const [footerPad, setFooterPad] = React.useState(0);
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();

  React.useEffect(() => {
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

  return (
    <div 
      className="min-h-screen bg-white selection:bg-[#E3087E] selection:text-white"
      style={{ paddingBottom: footerPad }}
    >
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <section className="relative h-[75vh] min-h-[500px] flex items-center justify-center text-center px-6 pt-24 lg:pt-32">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/wp-content/uploads/2026/05/hello-world.png"
            alt="Background"
            className="w-full h-full object-cover brightness-[0.55] object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <h1 className="font-['Serif',serif] text-xl md:text-4xl font-bold text-white leading-tight">
            {t("hero_join_prompt")}
          </h1>
          
          <div className="w-16 h-1 bg-[#E3087E] mx-auto rounded-full" />

          <p className="font-['Be_Vietnam_Pro'] text-white/80 text-xs md:text-base max-w-xl mx-auto leading-relaxed font-light">
            Experience the pinnacle of discreet luxury. Our members enjoy unparalleled access to private suites and bespoke services tailored to every desire.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <button 
              onClick={() => setShowModal(true)}
              className="w-full sm:w-64 py-4 bg-[#E3087E] text-white font-bold uppercase tracking-widest rounded-md hover:bg-[#c0066a] transition-all shadow-lg text-sm"
            >
              Registration
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="w-full sm:w-64 py-4 bg-white text-[#E3087E] font-bold uppercase tracking-widest rounded-md border border-[#E3087E]/20 hover:bg-gray-50 transition-all shadow-lg text-sm"
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -z-10" />
            <h2 className="inline-block bg-white px-8 font-['Serif',serif] text-3xl md:text-4xl font-bold text-[#E3087E]">
              {t("our_key_features")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-10 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(227,8,126,0.1)] transition-all text-center group">
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-pink-50 text-[#E3087E] group-hover:bg-[#E3087E] group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-4xl">calendar_month</span>
              </div>
              <h3 className="font-['Serif',serif] text-2xl font-bold text-[#E3087E] mb-4">{t("priority_booking")}</h3>
              <p className="text-gray-500 font-['Be_Vietnam_Pro'] leading-relaxed">
                Early access to seasonal suites and exclusive events.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-10 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(227,8,126,0.1)] transition-all text-center group">
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-pink-50 text-[#E3087E] group-hover:bg-[#E3087E] group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-4xl">sell</span>
              </div>
              <h3 className="font-['Serif',serif] text-2xl font-bold text-[#E3087E] mb-4">{t("member_rates")}</h3>
              <p className="text-gray-500 font-['Be_Vietnam_Pro'] leading-relaxed">
                Preferential pricing across the global Aureum portfolio.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-10 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(227,8,126,0.1)] transition-all text-center group">
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-pink-50 text-[#E3087E] group-hover:bg-[#E3087E] group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-4xl">notifications_active</span>
              </div>
              <h3 className="font-['Serif',serif] text-2xl font-bold text-[#E3087E] mb-4">{t("concierge_24_7")}</h3>
              <p className="text-gray-500 font-['Be_Vietnam_Pro'] leading-relaxed">
                A dedicated team to manage every detail of your stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Registration Choice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(227,8,126,0.3)] w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#E3087E] transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
            
            <h2 className="font-['Serif',serif] text-3xl font-bold text-[#E3087E] mb-2 text-center">{t("join_us")}</h2>
            <p className="text-gray-500 font-['Be_Vietnam_Pro'] text-sm text-center mb-8">{t("select_account_type")}</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => navigate("/registration-form")}
                className="w-full py-4 bg-[#E3087E] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#c0066a] transition-all shadow-lg text-sm flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">favorite</span>
                {t("working_lady")}
              </button>
              <button 
                onClick={() => navigate("/normal-registration")}
                className="w-full py-4 bg-white text-[#E3087E] font-bold uppercase tracking-widest rounded-xl border-2 border-[#E3087E]/30 hover:bg-pink-50 hover:border-[#E3087E] transition-all shadow-md text-sm flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">person</span>
                {t("normal_user")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
