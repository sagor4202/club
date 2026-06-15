import React from "react";

const AGE_KEY = "pascha_age_verified";

export default function AgeVerification() {
  const [dismissed, setDismissed] = React.useState(() => localStorage.getItem(AGE_KEY) === "1");

  const handleEnter = () => {
    localStorage.setItem(AGE_KEY, "1");
    setDismissed(true);
  };

  const handleUnder = () => {
    window.location.href = "https://google.com";
  };

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0c0f0f] border border-white/10 rounded-3xl p-10 md:p-14 max-w-md w-full mx-4 text-center shadow-[0_0_60px_rgba(227,8,126,0.2)]">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#E3087E] flex items-center justify-center text-4xl font-black text-white shadow-[0_0_30px_rgba(255,0,255,0.4)]">
          18+
        </div>
        <h2 className="font-['Epilogue'] text-2xl font-black text-white uppercase tracking-widest mb-3">
          Age Verification
        </h2>
        <p className="font-['Be_Vietnam_Pro'] text-sm text-white/60 mb-8 leading-relaxed">
          This website contains adult content. Please confirm you are at least 18 years of age to continue.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleEnter}
            className="w-full py-4 bg-gradient-to-r from-[#ff00ff] to-[#E3087E] text-white font-bold uppercase tracking-widest rounded-xl text-sm hover:shadow-[0_0_30px_rgba(227,8,126,0.5)] transition-all"
          >
            I am 18 or Older — Enter
          </button>
          <button
            onClick={handleUnder}
            className="w-full py-3 bg-white/5 border border-white/10 text-white/50 font-bold uppercase tracking-widest rounded-xl text-xs hover:text-white hover:border-white/30 transition-all"
          >
            I am Under 18
          </button>
        </div>
      </div>
    </div>
  );
}
