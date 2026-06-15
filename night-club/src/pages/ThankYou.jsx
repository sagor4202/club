import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0f0f] selection:bg-[#E3087E] selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-[100px] pb-24 px-6 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E3087E]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="glass-card max-w-lg w-full p-10 md:p-14 rounded-[40px] border border-white/10 text-center relative z-10 shadow-2xl">
          <div className="w-24 h-24 bg-[#E3087E]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#E3087E]/50 animate-bounce">
            <span className="material-symbols-outlined text-5xl text-[#E3087E]">check_circle</span>
          </div>
          
          <h1 className="font-['Serif',serif] text-4xl md:text-5xl font-bold text-white mb-4">Thank You!</h1>
          <p className="font-['Be_Vietnam_Pro'] text-white/70 text-base mb-10 leading-relaxed">
            Your request has been successfully submitted. Our team will review your reservation and get back to you shortly.
          </p>
          
          <button 
            onClick={() => navigate("/")}
            className="w-full py-4.5 bg-gradient-to-r from-[#E3087E] to-[#FF00FF] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all shadow-[0_0_30px_rgba(227,8,126,0.4)] active:scale-95 text-sm"
          >
            Back to Home
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
