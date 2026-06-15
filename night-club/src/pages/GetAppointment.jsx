import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../i18n/LanguageContext";

export default function GetAppointment() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [dynamicGirl, setDynamicGirl] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({ name: "", email: "", phone: "", date: "", message: "" });
  const [appointmentStatus, setAppointmentStatus] = useState(null);
  const [appointmentSubmitting, setAppointmentSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setAppointmentSubmitting(true);
    setAppointmentStatus(null);
    try {
      const res = await fetch("/wp-json/pascha/v1/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          girl_email: dynamicGirl?.email || "default@pascha.test",
          ...appointmentForm
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAppointmentStatus({ type: "success", text: t("appointment_sent") });
        setAppointmentForm({ name: "", email: "", phone: "", date: "", message: "" });
        setTimeout(() => navigate(`/profile/${name}`), 3000);
      } else {
        setAppointmentStatus({ type: "error", text: data.message || t("failed_to_send_request") });
      }
    } catch (err) {
      setAppointmentStatus({ type: "error", text: t("network_error") });
    } finally {
      setAppointmentSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-[#ffabf3] selection:text-[#5b005b] bg-[#0F0F3D] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-[120px] pb-24 px-6 lg:px-10 max-w-3xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-[#ff00ff] transition-colors mb-8 font-['Be_Vietnam_Pro'] text-sm"
        >
          <FaArrowLeft /> {t("back_to_profile", { name })}
        </button>

        <div className="bg-[#0c0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(227,8,126,0.15)] glass-card">
          <div className="p-8 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent flex items-center gap-4">
            {dynamicGirl?.img && (
               <img src={dynamicGirl.img} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-[#E3087E] shadow-[0_0_15px_rgba(227,8,126,0.5)]" />
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest font-['Epilogue']">{t("get_appointment_title")}</h1>
              <p className="text-[#ffabf3] font-bold text-sm tracking-widest mt-1 uppercase">{t("with_name", { name })}</p>
            </div>
          </div>
          
          <div className="p-8 md:p-10">
            {appointmentStatus && (
              <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest mb-8 text-center ${appointmentStatus.type === 'success' ? 'bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88]' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {appointmentStatus.text}
              </div>
            )}
            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              <div>
                <label className="block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t("your_name")}</label>
                <input type="text" required value={appointmentForm.name} onChange={e => setAppointmentForm(f => ({...f, name: e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] focus:ring-1 focus:ring-[#E3087E] transition-all" placeholder="Enter your full name" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t("email_address")}</label>
                  <input type="email" required value={appointmentForm.email} onChange={e => setAppointmentForm(f => ({...f, email: e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] transition-all" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t("phone_number")}</label>
                  <input type="tel" required value={appointmentForm.phone} onChange={e => setAppointmentForm(f => ({...f, phone: e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] transition-all" placeholder="Your phone number" />
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t("preferred_date_time")}</label>
                <input type="text" required value={appointmentForm.date} onChange={e => setAppointmentForm(f => ({...f, date: e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] transition-all" placeholder="e.g. Tomorrow at 8 PM" />
              </div>
              <div>
                <label className="block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t("message_optional")}</label>
                <textarea rows="4" value={appointmentForm.message} onChange={e => setAppointmentForm(f => ({...f, message: e.target.value}))} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] transition-all" placeholder="Any special requests or details?"></textarea>
              </div>
              <button type="submit" disabled={appointmentSubmitting} className="w-full py-5 mt-4 bg-gradient-to-r from-[#ff00ff] to-[#e1047d] text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] hover:shadow-[0_10px_40px_rgba(227,8,126,0.5)] active:scale-[0.98] disabled:opacity-50 text-sm">
                {appointmentSubmitting ? t("sending_request") : t("send_request")}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
