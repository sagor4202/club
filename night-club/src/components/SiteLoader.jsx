import React from "react";

export default function SiteLoader({ isVisible }) {
  return (
    <div
      className={[
        "pascha-loader fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#07072c]",
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
      aria-hidden={!isVisible}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.20),transparent_34%),radial-gradient(circle_at_70%_70%,rgba(233,195,73,0.16),transparent_28%)]" />
      <div className="pascha-loader-grid absolute inset-0 opacity-35" />
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="pascha-loader-orbit relative mb-8 flex h-32 w-32 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(255,0,255,0.35)]">
          <div className="pascha-loader-ring absolute inset-0 rounded-full" />
          <div className="pascha-loader-ring-reverse absolute inset-3 rounded-full" />
          <img
            src="/wp-content/themes/night-club-theme/dist/images/Logo-Pascha-.png"
            alt="Pascha"
            className="h-16 w-auto object-contain drop-shadow-[0_0_22px_rgba(255,0,255,0.8)]"
          />
        </div>
        <div className="font-['Epilogue'] text-2xl sm:text-4xl font-black uppercase tracking-[0.35em] text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.28)]">
          Pascha
        </div>
        <div className="mt-3 font-['Be_Vietnam_Pro'] text-[10px] sm:text-xs font-bold uppercase tracking-[0.55em] text-[#e9c349]">
          Loading Experience
        </div>
        <div className="mt-7 h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
          <div className="pascha-loader-bar h-full w-1/2 rounded-full bg-gradient-to-r from-[#ff00ff] via-[#e9c349] to-[#00ff88]" />
        </div>
      </div>
    </div>
  );
}
