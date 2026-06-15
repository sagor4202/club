import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../i18n/LanguageContext";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [footerPad, setFooterPad] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const update = () => setFooterPad(Math.ceil(footer.getBoundingClientRect().height));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password reset link has been sent to your email!");
    navigate("/login");
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] focus:ring-1 focus:ring-[#E3087E] transition-all duration-300";
  const labelClass = "block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1";

  return (
    <div className="min-h-screen bg-[#0c0f0f] selection:bg-[#E3087E] selection:text-white" style={{ paddingBottom: footerPad }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center text-center px-6 pt-24 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/wp-content/uploads/2026/05/gallery-02.webp" 
            alt="Forgot Password Background" 
            className="w-full h-full object-cover opacity-50 brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0c0f0f]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="font-['Serif',serif] text-4xl md:text-6xl font-bold text-white tracking-tight">{t("recover_account")}</h1>
          <div className="w-12 h-1 bg-[#E3087E] mx-auto rounded-full mt-4" />
        </div>
      </section>

      <main className="pb-24 px-6 -mt-20 relative z-20">
        <div className="max-w-md mx-auto">
          <div className="glass-card p-10 md:p-12 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E3087E]/10 blur-[60px] rounded-full -mr-16 -mt-16" />
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-[#E3087E]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E3087E]">
                  <span className="material-symbols-outlined text-3xl">lock_reset</span>
                </div>
                <h2 className="font-['Serif',serif] text-2xl font-bold text-white mb-2">{t("forgot_password")}</h2>
                <p className="text-white/30 text-sm leading-relaxed">Enter your email and we'll send you a link to reset your password.</p>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>{t("email_address")}</label>
                <input type="email" placeholder="your@email.com" className={inputClass} required />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4.5 bg-[#E3087E] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#c0066a] transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] active:scale-[0.98] text-sm">
                  {t("send_reset_link")}
                </button>
              </div>

              <div className="text-center pt-4">
                <Link to="/login" className="inline-flex items-center gap-2 text-white/40 text-sm font-bold uppercase tracking-widest hover:text-[#E3087E] transition-colors">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  {t("back_to_login")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
