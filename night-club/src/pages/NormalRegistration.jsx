import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NormalRegistration() {
  const navigate = useNavigate();
  const [footerPad, setFooterPad] = useState(0);
  
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showAgeModal, setShowAgeModal] = useState(true);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const update = () => setFooterPad(Math.ceil(footer.getBoundingClientRect().height));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/wp-json/pascha/v1/register/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      // Auto-login after registration
      const loginRes = await fetch("/wp-json/pascha/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginData.message || "Registration completed, but login failed. Please try logging in.");
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: loginData.name,
          email: loginData.email,
          user_type: loginData.user_type,
        })
      );

      setSuccess("Account created successfully!");
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/user-dashboard");

    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] focus:ring-1 focus:ring-[#E3087E] transition-all duration-300";
  const labelClass = "block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1";

  return (
    <div className="min-h-screen bg-[#0c0f0f] selection:bg-[#E3087E] selection:text-white" style={{ paddingBottom: footerPad }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[300px] flex items-center justify-center text-center px-6 pt-24 lg:pt-32 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/wp-content/uploads/2026/05/gallery-02.webp" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-[0.4] object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0c0f0f]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <h1 className="font-['Serif',serif] text-4xl md:text-5xl font-bold text-white tracking-tight">Create Account</h1>
          <div className="w-12 h-1 bg-[#E3087E] mx-auto rounded-full" />
        </div>
      </section>

      <main className="pb-24 px-6 -mt-10 relative z-20">
        <div className="max-w-2xl mx-auto">
          {/* Form Container */}
          <div className="glass-card p-8 md:p-12 rounded-[40px] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E3087E]/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="text-center mb-8">
                <h2 className="font-['Serif',serif] text-2xl font-bold text-white mb-2">Member Registration</h2>
                <p className="text-white/30 text-sm">Join us to book private suites and access exclusive services.</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs uppercase tracking-widest text-center font-bold">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-xs uppercase tracking-widest text-center font-bold">
                  {success}
                </div>
              )}
              
              <div className="space-y-2">
                <label className={labelClass}>Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  className={inputClass} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className={labelClass}>Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com" 
                  className={inputClass} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className={labelClass}>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+43 664 123 456" 
                  className={inputClass} 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelClass}>Password *</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className={inputClass} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Confirm Password *</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className={inputClass} 
                    required 
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-4.5 bg-gradient-to-r from-[#E3087E] to-[#FF00FF] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all shadow-[0_0_30px_rgba(227,8,126,0.4)] active:scale-[0.98] text-sm flex items-center justify-center gap-2
                    ${loading ? "opacity-55 cursor-not-allowed" : ""}
                  `}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : "Register Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      {/* Age Verification Modal */}
      {showAgeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(227,8,126,0.3)] w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300">
            <div className="absolute top-3 right-3 bg-[#E3087E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider">
              18+ Only Adults
            </div>
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-6xl text-[#E3087E]">block</span>
            </div>
            <h2 className="font-['Serif',serif] text-2xl font-bold text-[#E3087E] mb-4 text-center leading-snug">
              Age Verification Required
            </h2>
            <p className="text-gray-600 font-['Be_Vietnam_Pro'] text-sm text-center mb-8 leading-relaxed">
              Before a man can join our page, he must be made aware that he is over 18 years old. By clicking "I Confirm", you acknowledge that you are at least 18 years of age.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setShowAgeModal(false)}
                className="w-full py-4 bg-[#E3087E] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#c0066a] transition-all shadow-lg text-sm"
              >
                I Confirm — I am Over 18
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 text-gray-400 font-bold uppercase tracking-widest rounded-xl hover:text-[#E3087E] transition-all text-sm"
              >
                I am Under 18 — Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
