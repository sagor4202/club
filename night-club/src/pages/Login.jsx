import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../i18n/LanguageContext";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [footerPad, setFooterPad] = useState(0);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const update = () => setFooterPad(Math.ceil(footer.getBoundingClientRect().height));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/wp-json/pascha/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      // Save user session
      localStorage.setItem("user", JSON.stringify({
        name: data.name,
        email: data.email,
        user_type: data.user_type,
      }));

      // Redirect based on user type
      if (data.user_type === "girl") {
        navigate("/girl-dashboard");
      } else {
        navigate("/user-dashboard");
      }

    } catch (err) {
      setError(err.message || "An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] focus:ring-1 focus:ring-[#E3087E] transition-all duration-300";
  const labelClass = "block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1";

  return (
    <div className="min-h-screen bg-[#0c0f0f] selection:bg-[#E3087E] selection:text-white" style={{ paddingBottom: footerPad }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center px-6 pt-24 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/wp-content/uploads/2026/05/gallery-07-scaled.webp" 
            alt="Login Background" 
            className="w-full h-full object-cover opacity-50 brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0c0f0f]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="font-['Serif',serif] text-4xl md:text-6xl font-bold text-white tracking-tight">{t("access_your_account")}</h1>
          <div className="w-12 h-1 bg-[#E3087E] mx-auto rounded-full mt-4" />
        </div>
      </section>

      <main className="pb-24 px-6 -mt-24 relative z-20">
        <div className="max-w-md mx-auto">
          <div className="glass-card p-10 md:p-12 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#E3087E]/10 blur-[60px] rounded-full -ml-16 -mt-16" />
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="text-center mb-10">
                <h2 className="font-['Serif',serif] text-2xl font-bold text-white mb-2">{t("welcome_back")}</h2>
                <p className="text-white/30 text-sm">Please enter your details to log in</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs uppercase tracking-widest text-center font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className={labelClass}>{t("email_address")}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" 
                  className={inputClass} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className={labelClass}>{t("password")}</label>
                  <Link to="/forgot-password" className="text-[#E3087E] text-[10px] font-bold uppercase tracking-widest hover:underline">{t("forgot")}</Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className={inputClass} 
                  required 
                />
              </div>

              <div className="flex items-center gap-3 px-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#E3087E] focus:ring-[#E3087E]" />
                <label htmlFor="remember" className="text-white/40 text-xs cursor-pointer select-none">{t("remember_30_days")}</label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-4.5 bg-[#E3087E] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#c0066a] transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] active:scale-[0.98] text-sm flex items-center justify-center gap-2
                    ${loading ? "opacity-55 cursor-not-allowed" : ""}
                  `}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("signing_in")}
                    </>
                  ) : t("sign_in")}
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-white/30 text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(true)}
                    className="text-white font-bold hover:text-[#E3087E] transition-colors"
                  >
                    {t("join_us")}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      {/* Registration Choice Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(227,8,126,0.3)] w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300">
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#E3087E] transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h2 className="font-['Serif',serif] text-3xl font-bold text-[#E3087E] mb-2 text-center">{t("join_us")}</h2>
            <p className="text-gray-500 font-['Be_Vietnam_Pro'] text-sm text-center mb-8">
              {t("select_account_type")}
            </p>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setShowRegisterModal(false);
                  navigate("/registration-form");
                }}
                className="w-full py-4 bg-[#E3087E] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#c0066a] transition-all shadow-lg text-sm flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">favorite</span>
                {t("working_lady")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRegisterModal(false);
                  navigate("/normal-registration");
                }}
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
