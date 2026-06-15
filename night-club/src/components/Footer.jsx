import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdLanguage, MdExpandMore, MdKeyboardArrowUp } from "react-icons/md";
import { useLanguage } from "../i18n/LanguageContext";
import { LANGUAGES } from "../i18n/translations";

const WHATSAPP_NUMBER = "436766826881";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const socialLinks = [
  { label: "facebook", href: "https://www.facebook.com/people/Pascha-Salzburg/61557611800529/", Icon: FaFacebookF },
  { label: "instagram", href: "https://www.instagram.com/pascha_salzburg?utm_source=qr", Icon: FaInstagram },
  { label: "twitter", href: "#", Icon: FaXTwitter },
  { label: "youtube", href: "#", Icon: FaYoutube },
];

const neonBadgeClass =
  "inline-flex h-7 md:h-8 lg:h-9 items-center justify-center rounded-md border-2 border-[#ff00ff] bg-transparent px-3 md:px-4 lg:px-5 font-['Epilogue'] text-[11px] md:text-[13px] lg:text-[17px] font-semibold leading-none tracking-wide text-[#ffabf3] whitespace-nowrap";

function LangDropdown({ selectedLabel, isOpen, onToggle, onSelect }) {
  const { language } = useLanguage();
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1 font-['Epilogue'] text-[10px] sm:text-[11px] lg:text-[13px] font-medium uppercase tracking-wider text-white/50 hover:text-white cursor-pointer transition-colors select-none leading-none"
        aria-label="Language"
        aria-expanded={isOpen}
      >
        <MdLanguage className="text-sm sm:text-base lg:text-xl" />
        <span className="translate-y-[0.5px]">
          <span data-no-translate>{selectedLabel}</span>
        </span>
        <MdExpandMore className="text-sm sm:text-base lg:text-lg" />
      </button>
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 bottom-full mb-2 z-[80] w-44 rounded-2xl border border-white/10 bg-[#0F0F3D]/95 backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,255,0.25)] p-2">
          {LANGUAGES.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => onSelect(item.code)}
              className={[
                "w-full text-left px-3 py-2 rounded-xl uppercase tracking-widest transition-colors",
                "text-[10px] sm:text-[11px] lg:text-xs",
                item.code === language
                  ? "bg-[#FF00FF] text-white"
                  : "text-white/80 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              <span data-no-translate>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const selectedLabel =
    LANGUAGES.find((item) => item.code === language)?.label || "English";

  useEffect(() => {
    const toggleVisibility = () => { setIsVisible(window.pageYOffset > 300); };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      id="site-footer"
      className="fixed bottom-0 left-0 w-full py-2 px-2 sm:px-4 lg:px-8 bg-[#2E2C7F] shadow-[0_-8px_35px_rgba(46,44,127,0.5),0_-2px_20px_rgba(255,0,255,0.15)] z-50 flex flex-col justify-center"
    >
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="absolute -top-3.5 right-4 lg:right-10 flex h-7 w-7 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-[#ff00ff]/20 border border-[#ff00ff]/50 text-[#ffabf3] shadow-[0_0_15px_rgba(255,0,255,0.3)] backdrop-blur-md transition-all duration-300 hover:bg-[#ff00ff] hover:text-white hover:shadow-[0_0_25px_rgba(255,0,255,0.6)] hover:-translate-y-1 active:scale-95 z-[60]"
          aria-label={t("back_to_top")}
        >
          <MdKeyboardArrowUp className="text-lg lg:text-2xl" />
        </button>
      )}

      {/* ── MOBILE LAYOUT (< sm) ── */}
      <div className="flex sm:hidden flex-col w-full items-center gap-1">
        <div className="flex items-center justify-between w-full">
          <LangDropdown
            selectedLabel={selectedLabel}
            isOpen={isLanguageOpen}
            onToggle={() => setIsLanguageOpen((o) => !o)}
            onSelect={(code) => { setLanguage(code); setIsLanguageOpen(false); }}
          />
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="h-6 px-3 rounded-full bg-white/5 flex items-center justify-center gap-1 text-white hover:text-[#ffabf3] transition-all active:opacity-80 no-hover-scale"
            aria-label={t("live_chat")}
          >
            <FaWhatsapp className="w-3 h-3 text-[#25D366]" />
            <span className="text-[8px] font-bold uppercase tracking-widest leading-none translate-y-[0.5px]">
              {t("live_chat")}
            </span>
          </a>
        </div>

        <div className="flex justify-center items-center gap-2 flex-wrap">
          <div className={neonBadgeClass}>
            <span>Open&nbsp;</span>
            <span className="text-[#00e5ff]">24/7</span>
          </div>
          {socialLinks.map(({ label, href, Icon }) => (
            <a key={label} target="_blank" rel="noopener noreferrer"
              className="transition-transform duration-200 hover:scale-110 flex items-center justify-center text-white"
              href={href} aria-label={label}
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          ))}
          <div className={neonBadgeClass}>
            <span className="text-[#00e5ff]">18+&nbsp;</span>
            <span>Adults Only</span>
          </div>
        </div>

        <div className="w-full text-center">
          <div className="flex flex-wrap justify-center items-center gap-1.5 font-['Epilogue'] text-[7px] font-medium uppercase tracking-wider text-white/30">
            <span>© 2026 Pascha Nightlife</span>
            <span className="text-white/10">|</span>
            <a href="/legal-notice" className="hover:text-white transition-colors">{t("legal_notice")}</a>
            <span className="text-white/10">|</span>
            <a href="/privacy-policy" className="hover:text-white transition-colors">{t("privacy_policy")}</a>
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (sm+) ── */}
      <div className="hidden sm:flex w-full items-center justify-between px-2 lg:px-4 gap-4">
        {/* Left Side */}
        <div className="flex items-center flex-1 justify-start">
          <LangDropdown
            selectedLabel={selectedLabel}
            isOpen={isLanguageOpen}
            onToggle={() => setIsLanguageOpen((o) => !o)}
            onSelect={(code) => { setLanguage(code); setIsLanguageOpen(false); }}
          />
        </div>

        {/* Center Side */}
        <div className="flex items-center justify-center gap-4 lg:gap-8">
          {/* Open 24/7 */}
          <div className={neonBadgeClass}>
            <span>Open&nbsp;</span>
            <span className="text-[#00e5ff]">24/7</span>
          </div>

          {/* Socials & Copyright */}
          <div className="flex flex-col items-center gap-2 mt-1">
            <div className="flex justify-center items-center gap-3 lg:gap-5">
              {socialLinks.map(({ label, href, Icon }) => (
                <a key={label} target="_blank" rel="noopener noreferrer"
                  className="transition-transform duration-200 hover:scale-110 flex items-center justify-center text-white"
                  href={href} aria-label={label}
                >
                  <Icon className="w-4 h-4 lg:w-[22px] lg:h-[22px]" />
                </a>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-1.5 lg:gap-2 font-['Epilogue'] text-[7px] lg:text-[8.5px] font-medium uppercase tracking-widest text-white/40">
              <span>© 2026 Pascha Nightlife</span>
              <span className="text-white/10">|</span>
              <a href="/legal-notice" className="hover:text-white transition-colors">{t("legal_notice")}</a>
              <span className="text-white/10">|</span>
              <a href="/privacy-policy" className="hover:text-white transition-colors">{t("privacy_policy")}</a>
            </div>
          </div>

          {/* 18+ Adults Only */}
          <div className={neonBadgeClass}>
            <span className="text-[#00e5ff]">18+&nbsp;</span>
            <span>Adults Only</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center flex-1 justify-end">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 lg:h-11 px-4 lg:px-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 text-white transition-all border border-white/10 backdrop-blur-sm"
            aria-label={t("live_chat")}
          >
            <FaWhatsapp className="w-4 h-4 lg:w-5 lg:h-5 text-[#25D366]" />
            <span className="text-[10px] lg:text-[13px] font-bold uppercase tracking-widest leading-none translate-y-[1px]">
              {t("live_chat")}
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
