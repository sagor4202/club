import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState("ladies");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleMobileNavigate = (path) => {
    setIsMenuOpen(false);
    if (path === "logout") {
      handleSignOut();
    } else if (path.startsWith("http")) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else if (path !== "#") {
      navigate(path);
    }
  };

  const mobileMenus = [
    {
      key: "ladies",
      label: t("see_our_ladies"),
      items: [
        { label: "Pascha Laufhaus - Braunau Am Inn", path: "/girls/braunau" },
        { label: "Pascha Laufhaus - Salzburg", path: "/girls/salzburg" },
        { label: "Pascha NightClub - Salzburg", path: "/girls/nightclub" },
        { label: t("see_all_ladies"), path: "/girls/all" },
      ],
    },
    {
      key: "work",
      label: t("work_with_us"),
      items: [
        { label: "Pascha Laufhaus - Salzburg & Braunau Am Inn", path: "/work-with-us/laufhaus" },
        { label: "Pascha NightClub - Salzburg", path: "/girls/nightclub" },
      ],
    },
  ];

  return (
    <nav className="fixed top-0 w-full z-[60] border-b border-white/20 bg-[#20207A]/80 backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,255,0.2)]">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-0 w-full">
        <div className="flex-1 flex items-center gap-2 xl:gap-3">
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:text-[#ffabf3] hover:bg-white/10 transition-colors no-hover-scale shrink-0"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-[30px] leading-none">
              menu
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <button
              type="button"
              className="px-3 py-1.5 xl:px-4 xl:py-2 rounded-full border border-white/15 bg-white/5 text-white font-bold text-[9px] xl:text-[10px] 2xl:text-[11px] uppercase tracking-wider hover:bg-[#FF00FF] hover:border-[#FF00FF] transition-all duration-300 active:scale-95 no-hover-scale whitespace-nowrap"
              onClick={() => navigate("/girls/all")}
            >
              {t("get_appointment")}
            </button>
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-1.5 xl:px-4 xl:py-2 rounded-full border border-[#ffabf3]/50 bg-[#ffabf3]/10 text-white font-bold text-[9px] xl:text-[10px] 2xl:text-[11px] uppercase tracking-wider hover:bg-[#FF00FF] hover:border-[#FF00FF] transition-all duration-300 active:scale-95 no-hover-scale whitespace-nowrap"
              >
                {t("see_our_ladies")}
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 pointer-events-none translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0">
                <div className="w-[340px] rounded-2xl border border-white/10 bg-[#0F0F3D]/95 backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,255,0.25)] p-2 flex flex-col gap-1.5">
                  {[
                    { label: "Pascha Laufhaus -Braunau Am Inn", path: "braunau" },
                    { label: "Pascha Laufhaus -Salzburg", path: "salzburg" },
                    { label: "Pascha NightClub - Salzburg", path: "nightclub" },
                    { label: t("see_all_ladies"), path: "all" },
                  ].map((club) => (
                    <button
                      key={club.path}
                      type="button"
                      className="w-full text-left px-4 py-2.5 rounded-xl text-white/80 hover:text-white bg-white/5 hover:bg-[#FF00FF] border border-white/5 hover:border-[#FF00FF] transition-all duration-300 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap"
                      onClick={() => navigate(`/girls/${club.path}`)}
                    >
                      {club.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 xl:px-4 xl:py-2 rounded-full border border-white/15 bg-white/5 text-white font-bold text-[9px] xl:text-[10px] 2xl:text-[11px] uppercase tracking-wider hover:bg-[#FF00FF] hover:border-[#FF00FF] transition-all duration-300 active:scale-95 no-hover-scale whitespace-nowrap"
            >
              {t("free_dating_appointment")}
            </button>
            <a
              href="https://paschasexportal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 xl:px-5 xl:py-2 rounded-lg bg-[#ff00ff] text-white border border-white/20 font-bold text-[10px] xl:text-[11px] 2xl:text-[12px] uppercase tracking-wider hover:bg-[#FF00FF] hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] transition-all duration-300 active:scale-95 no-hover-scale whitespace-nowrap"
            >
              Pascha Sex Portel
            </a>
          </div>
        </div>

        <div className="flex-none px-0 flex items-center justify-center">
          <Link to="/" className="inline-flex items-center justify-center shrink-0">
            <img
              alt="Pascha Logo"
              className="h-14 xl:h-20 w-auto object-contain"
              src="/wp-content/themes/night-club-theme/dist/images/Logo-Pascha-.png"
            />
          </Link>
        </div>

        <div className="flex-1 flex items-center">
          <div className="flex-1 flex justify-center hidden lg:flex">
            <a
              href="https://apeshop.at/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/wp-content/themes/night-club-theme/dist/images/Upper Bar.jpg.jpeg"
                alt="Apeshop"
                className="h-8 xl:h-10 w-auto object-contain"
              />
            </a>
          </div>

          <div className="flex items-center justify-end gap-1.5 xl:gap-3">
            <div className="relative hidden lg:inline-flex group">
              <button
                type="button"
                className="hidden lg:inline-flex border-2 border-[#ffabf3] text-white px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-lg font-bold text-[9px] xl:text-[10px] 2xl:text-[11px] uppercase tracking-wider hover:bg-[#FF00FF] hover:border-[#FF00FF] transition-all duration-300 active:scale-95 whitespace-nowrap"
              >
                {t("work_with_us")}
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 pointer-events-none translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0">
                <div className="w-[340px] rounded-2xl border border-white/10 bg-[#0F0F3D]/95 backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,255,0.25)] p-2 flex flex-col gap-1.5">
                  {[
                    { label: "Pascha Laufhaus - Salzburg & Braunau am Inn", path: "laufhaus" },
                    { label: "Pascha NightClub - Salzburg", path: "nightclub" },
                  ].map((club) => (
                    <button
                      key={club.path}
                      type="button"
                      className="w-full text-left px-4 py-2.5 rounded-xl text-white/80 hover:text-white bg-white/5 hover:bg-[#FF00FF] border border-white/5 hover:border-[#FF00FF] transition-all duration-300 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap"
                      onClick={() => navigate(`/girls/${club.path}`)}
                    >
                      {club.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.open("https://call.paschasexportal.com/?room=b36669dc-ca5c-40d2-9c8c-392a62affafb", "_blank", "noopener,noreferrer")}
              className="hidden lg:inline-flex bg-[#ff00ff] text-white px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-lg border border-white/20 font-bold text-[9px] xl:text-[10px] 2xl:text-[11px] uppercase tracking-wider hover:bg-[#FF00FF] hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] transition-all duration-300 active:scale-95 no-hover-scale whitespace-nowrap"
            >
              {t("live_video_chat")}
            </button>

            {user ? (
              <button
                type="button"
                className="h-10 w-10 flex items-center justify-center rounded-full border-2 border-[#ffabf3] text-[#ffabf3] bg-[#ffabf3]/10 hover:bg-[#FF00FF] hover:text-white hover:border-[#FF00FF] transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0"
                onClick={() => navigate(user.user_type === "girl" ? "/girl-dashboard" : "/user-dashboard")}
                title={`${t("dashboard")} (${user.name})`}
              >
                <span className="material-symbols-outlined text-[22px] leading-none">
                  account_circle
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="hidden lg:inline-flex border-2 border-[#ffabf3] text-white px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-lg font-bold text-[9px] xl:text-[10px] 2xl:text-[11px] uppercase tracking-wider hover:bg-[#FF00FF] hover:border-[#FF00FF] transition-all duration-300 active:scale-95 whitespace-nowrap"
                onClick={() => navigate("/register")}
              >
                {t("login_signup")}
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className={[
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300",
          isMenuOpen ? "max-h-[calc(100vh-64px)] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="px-4 sm:px-6 pb-4 max-h-[calc(100vh-82px)] overflow-y-auto">
          <div className="rounded-2xl border border-white/10 bg-[#0F0F3D]/95 backdrop-blur-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            {[
              { label: t("get_appointment"), path: "/girls/all" },
              { label: t("free_dating_appointment"), path: "#" },
              { label: "Pascha Sex Portel", path: "https://paschasexportal.com/" },
              { label: t("live_video_chat"), path: "https://call.paschasexportal.com/?room=b36669dc-ca5c-40d2-9c8c-392a62affafb" },
              { label: t("shop_at_apeshop"), path: "https://apeshop.at/" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className="w-full text-left px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/5 transition-colors font-['Be_Vietnam_Pro']"
                onClick={() => handleMobileNavigate(item.path)}
              >
                {item.label}
              </button>
            ))}

            {mobileMenus.map((menu) => (
              <div key={menu.key} className="mt-1 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-white font-bold uppercase tracking-wider text-xs"
                  onClick={() => setOpenMobileSubmenu((current) => (current === menu.key ? "" : menu.key))}
                >
                  <span>{menu.label}</span>
                  <span className={`material-symbols-outlined text-[20px] transition-transform ${openMobileSubmenu === menu.key ? "rotate-180 text-[#ffabf3]" : "text-white/60"}`}>
                    expand_more
                  </span>
                </button>
                <div className={`${openMobileSubmenu === menu.key ? "max-h-80 opacity-100 pb-2" : "max-h-0 opacity-0"} overflow-hidden transition-[max-height,opacity,padding] duration-300`}>
                  {menu.items.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="w-[calc(100%-16px)] mx-2 mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-white/75 hover:text-white bg-white/5 hover:bg-[#ff00ff]/80 border border-white/5 transition-all font-['Be_Vietnam_Pro'] text-sm"
                      onClick={() => handleMobileNavigate(item.path)}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e9c349] shadow-[0_0_10px_rgba(233,195,73,0.7)]"></span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {(user
              ? [{ label: `${t("dashboard")} (${user.name})`, path: user.user_type === "girl" ? "/girl-dashboard" : "/user-dashboard" }]
              : [{ label: t("login_signup"), path: "/register" }]
            ).map((item) => (
              <button
                key={item.label}
                type="button"
                className="mt-2 w-full text-left px-4 py-3 rounded-xl text-white bg-[#ff00ff]/80 hover:bg-[#ff00ff] transition-colors font-bold uppercase tracking-wider text-xs"
                onClick={() => handleMobileNavigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
