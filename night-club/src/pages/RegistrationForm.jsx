import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [footerPad, setFooterPad] = useState(0);
  const [showAgeModal, setShowAgeModal] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    serviceName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    nationality: "",
    address: "",
    placeOfBirth: "",
    publicNumber: "",
    passportNumber: "",
    issuingDate: "",
    issuingAuthority: "",
    password: "",
    confirmPassword: "",
  });

  const [verificationDocs, setVerificationDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setVerificationDocs(prev => [...prev, ...selectedFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setVerificationDocs(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setStep(1); // Go back to first step to fix
      return;
    }

    if (verificationDocs.length === 0) {
      setError("Please upload at least one verification document!");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      data.set("originalName", `${formData.firstName} ${formData.lastName}`.trim());

      // Append all files
      verificationDocs.forEach(file => {
        data.append("verificationDocs[]", file);
      });

      const response = await fetch("/wp-json/pascha/v1/register/girl", {
        method: "POST",
        body: data,
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Failed to submit registration.");
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

      setSuccess("Registration completed successfully!");

      setFormData({
        serviceName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        nationality: "",
        address: "",
        placeOfBirth: "",
        publicNumber: "",
        passportNumber: "",
        issuingDate: "",
        issuingAuthority: "",
        password: "",
        confirmPassword: "",
      });
      setVerificationDocs([]);
      setStep(1);

      navigate("/girl-dashboard");

    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Dark Theme Styles
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E3087E] focus:ring-1 focus:ring-[#E3087E] transition-all duration-300";
  const labelClass = "block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 px-1";

  return (
    <div className="min-h-screen bg-[#0c0f0f] selection:bg-[#E3087E] selection:text-white" style={{ paddingBottom: footerPad }}>
      <Navbar />
      
      {/* Hero Section (Dark/Atmospheric) */}
      <section className="relative h-[75vh] min-h-[500px] flex items-center justify-center text-center px-6 pt-24 lg:pt-32 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/wp-content/uploads/2026/05/gallery-02.webp" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-[0.55] object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0c0f0f]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <h1 className="font-['Serif',serif] text-4xl md:text-6xl font-bold text-white tracking-tight">Registration</h1>
          <div className="w-12 h-1 bg-[#E3087E] mx-auto rounded-full" />
          <p className="font-['Be_Vietnam_Pro'] text-white/80 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Welcome to the Aurelius Private Network. Please provide your professional credentials with the utmost accuracy.
          </p>
        </div>
      </section>

      <main className="pb-24 px-6 -mt-20 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Stepper Progress (Dark Theme) */}
          <div className="flex justify-between items-center mb-10 max-w-sm mx-auto bg-white/5 backdrop-blur-xl p-4 rounded-full border border-white/10 shadow-2xl">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s ? 'bg-[#E3087E] text-white shadow-[0_0_20px_rgba(227,8,126,0.5)]' : 'bg-white/5 text-white/20'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-[2px] mx-4 rounded-full transition-all duration-500 ${step > s ? 'bg-[#E3087E]' : 'bg-white/5'}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Form Container (Dark Theme) */}
          <div className="glass-card p-8 md:p-14 rounded-[40px] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E3087E]/5 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <form onSubmit={handleSubmit} className="relative z-10">
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs uppercase tracking-widest text-center font-bold mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-xs uppercase tracking-widest text-center font-bold mb-6">
                  {success}
                </div>
              )}

              {/* Step 1: Identity & Professional Profile */}
              {step === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center">
                    <h2 className="font-['Serif',serif] text-2xl md:text-3xl font-bold text-white mb-2">Identity & Professional Profile</h2>
                    <p className="text-white/30 text-sm">Please enter your basic information below</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                      <label className={labelClass}>Service Name *</label>
                      <input 
                        type="text" 
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleChange}
                        placeholder="Elena" 
                        className={inputClass} 
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={labelClass}>Original First Name *</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John" 
                          className={inputClass} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Original Last Name *</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe" 
                          className={inputClass} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Mail *</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="private@example.com" 
                        className={inputClass} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Number *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+00 000 0000 000" 
                        className={inputClass} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Date of Birth *</label>
                      <input 
                        type="date" 
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={inputClass} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Nationality *</label>
                      <input 
                        type="text" 
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        placeholder="Your current citizenship" 
                        className={inputClass} 
                        required 
                      />
                    </div>
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
                    <button type="button" onClick={nextStep} className="w-full py-4.5 bg-[#E3087E] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#c0066a] transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] active:scale-[0.98] text-sm">
                      Continue to Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Origin & Location */}
              {step === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center">
                    <h2 className="font-['Serif',serif] text-2xl md:text-3xl font-bold text-white mb-2">Origin & Location</h2>
                    <p className="text-white/30 text-sm">Help us understand your background and location</p>
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Place of Birth *</label>
                    <input 
                      type="text" 
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleChange}
                      placeholder="City, Region, Country" 
                      className={inputClass} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Address *</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Your full address" 
                      className={inputClass} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Client Contact Number *</label>
                    <input 
                      type="tel" 
                      name="publicNumber"
                      value={formData.publicNumber}
                      onChange={handleChange}
                        placeholder="Client contact number" 
                      className={inputClass} 
                      required 
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={prevStep} className="flex-1 py-4.5 border border-white/10 bg-white/5 text-white/40 font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all text-sm">
                      Back
                    </button>
                    <button type="button" onClick={nextStep} className="flex-[2] py-4.5 bg-[#E3087E] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#c0066a] transition-all shadow-[0_10px_30px_rgba(227,8,126,0.3)] text-sm">
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Security Credentials */}
              {step === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center">
                    <h2 className="font-['Serif',serif] text-2xl md:text-3xl font-bold text-white mb-2">Security Credentials</h2>
                    <p className="text-white/30 text-sm">Final step to verify your professional identity</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                      <label className={labelClass}>Passport/ID Number *</label>
                      <input 
                        type="text" 
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleChange}
                        placeholder="Document ID" 
                        className={inputClass} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Issuing Authority *</label>
                      <input 
                        type="text" 
                        name="issuingAuthority"
                        value={formData.issuingAuthority}
                        onChange={handleChange}
                        placeholder="Authority name & Expiry" 
                        className={inputClass} 
                        required 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className={labelClass}>Issuing Date *</label>
                      <input 
                        type="date" 
                        name="issuingDate"
                        value={formData.issuingDate}
                        onChange={handleChange}
                        className={inputClass} 
                        required 
                      />
                    </div>
                    
                    <div className="md:col-span-2 space-y-2">
                      <label className={labelClass}>Verification Documents (ID/Passport) *</label>
                      <div className="relative group">
                        <input 
                          type="file" 
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                          multiple 
                        />
                        <div className="border-2 border-dashed border-white/10 rounded-[24px] p-12 flex flex-col items-center justify-center gap-4 group-hover:border-[#E3087E]/40 group-hover:bg-[#E3087E]/5 transition-all duration-300">
                          <div className="w-16 h-16 rounded-full bg-[#E3087E]/10 flex items-center justify-center text-[#E3087E] group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                          </div>
                          <div className="text-center">
                            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Upload high-resolution scans</h4>
                            <p className="text-white/20 text-xs">PDF, JPG or PNG (Max 10MB). Strictly confidential.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Previews */}
                  {verificationDocs.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                      {verificationDocs.map((file, index) => {
                        const isImage = file.type.startsWith("image/");
                        const objectUrl = isImage ? URL.createObjectURL(file) : "";
                        return (
                          <div key={index} className="aspect-square rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group/img">
                            {isImage ? (
                              <img src={objectUrl} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white/30 text-[10px] uppercase font-bold p-2 text-center break-all">
                                <span className="material-symbols-outlined text-xl mb-1">description</span>
                                {file.name.substring(0, 10)}...
                              </div>
                            )}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveFile(index)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#ff0000] text-white rounded-lg flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={prevStep} className="flex-1 py-4.5 border border-white/10 bg-white/5 text-white/40 font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all text-sm">
                      Back
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className={`flex-[2] py-4.5 bg-gradient-to-r from-[#E3087E] to-[#FF00FF] text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all shadow-[0_0_30px_rgba(227,8,126,0.4)] text-sm flex items-center justify-center gap-2
                        ${loading ? "opacity-55 cursor-not-allowed" : ""}
                      `}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : "Submit Application"}
                    </button>
                  </div>
                </div>
              )}

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
